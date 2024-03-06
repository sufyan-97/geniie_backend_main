// Libraries
const fs = require("fs");
const path = require("path");
const { Op, json } = require("sequelize");
const pug = require("pug");
const pdf = require("html-pdf");
const md5 = require("md5");
const moment = require("moment");

// Modals
const User = require("../../SqlModels/User");
const Currency = require("../../SqlModels/Currency");
const Payment = require("../../SqlModels/Payment");
const PaymentMethod = require("../../SqlModels/PaymentMethod");
const FinancialAccountTransaction = require("../../SqlModels/FinancialAccountTransaction");
const Invoice = require("../../SqlModels/Invoice");
const PromoHistory = require("../../SqlModels/PromoHistory");
const PromoCode = require("../../SqlModels/PromoCode");

// Helpers
const generalHelper = require("../../../helpers/general_helper");
const invoiceHelper = require("../../../helpers/invoiceHelper");
const paymentHelper = require("../../../helpers/paymentHelper");

// Custom Libraries
const { sequelize_conn } = require("../../../../config/database");

// Constants
const constants = require("../../../../config/constants");
const app_constants = require('../../Constants/app.constants');
const { refundToWallet } = require("../../../helpers/paymentHelper");
const Country = require("../../SqlModels/Country");

const paymentFunctions = Object.keys(paymentHelper);

exports.serviceTransaction = async function (call, callback) {
	const sequelizeTransaction = await sequelize_conn.transaction();
	try {
		/**
		 * REQUEST PAYLOAD
		 * {
		 *      "user": {
		 *      },
		 *      "paymentMethodSlug": "",
		 *      "paymentData": {
		 *          "cardId": "card_abc",
		 *          "email": "abc@xyz.com",
		 *          "coinId": 1,
		 *          "splitPayment": true
		 *      },
		 *      "orderId": 1,
		 *      "amount": 123
		 * }
		 */

		/**
		 * SUCCESS RESPONSE
		 * {
		 *      "status": true
		 *      "data": {}
		 * }
		 */

		/**
		 * ERROR RESPONSE
		 * {
		 *      "status": false
		 *      "message": "Error: error message there"
		 *      "statusCode": 400
		 * }
		 */

		let req = call.request;

		/**
		 * 1.0 - check if user is not exists
		 */
		let paymentMethodSlug = req.paymentMethodSlug;

		let paymentMethodData = await PaymentMethod.findOne({
			where: { slug: paymentMethodSlug },
			attributes: {
				include: ["paymentFunction", "instantPayment", "validParams"],
			},
			transaction: sequelizeTransaction,
		});

		if (!paymentMethodData || !paymentMethodData.paymentFunction) {
			sequelizeTransaction.rollback();
			callback({
				status: false,
				message: "Error: Payment Method not Supported",
			});
			return;
		}

		let paymentReqData = JSON.parse(req.paymentData);

		let validatePaymentMethodData = generalHelper.validateReqData(paymentReqData && Object.keys(paymentReqData).length ? paymentReqData : {},
			paymentMethodData.validParams
		);
		if (!validatePaymentMethodData) {
			sequelizeTransaction.rollback();

			// Error
			callback(
				{
					status: false,
					message: "invalid data",
				},
				null
			);
			return;
		}

		/**
		 * 1.1 - check if user is not exists
		 */
		let jsonUser = JSON.parse(req.user);
		const user = await User.findOne({
			where: {
				id: jsonUser.id,
				deleteStatus: false,
				// stripeId: {
				//     [Op.not]: null
				// }
			},
			transaction: sequelizeTransaction,
		});

		if (!user) {
			sequelizeTransaction.rollback();

			callback({
				status: false,
				message: "Error: User not found",
			});
			return;
		}

		/**
		 * 1.2 - get existing accountBalance
		 */

		let accountBalance = await user.getAccountBalance(
			{
				include: [
					{
						model: Currency,
						// attributes: ['currencySymbol']
					},
				],
			},
			{
				transaction: sequelizeTransaction,
			}
		);

		/**
		 * 1.3 create accountBalance if not exists
		 */
		console.log(accountBalance);
		if (!accountBalance) {
			// add user Account Balance here.
			let countryCode = constants.DEFAULT_COUNTRY;

			// let ipAddress = req.header("CF-Connecting-IP") ? req.header("CF-Connecting-IP") : req.header("x-real-ip") ? req.header("x-real-ip") : req.connection.remoteAddress;

			// let ipInfo = await generalHelper.getIpInformation(ipAddress);
			// countryCode = ipInfo?.country ? ipInfo?.country : countryCode;

			// Country
			let countryData = await Country.findOne({
				where: {
					countryCode: countryCode,
				},
			});

			if (!countryData || !countryData.currencyId) {
				sequelizeTransaction.rollback();
				callback({
					status: false,
					message: "Error: country or currency not found",
				});
				return;
			}

			accountBalance = await user.createAccountBalance(
				{
					countryId: countryData.id,
					currencyId: countryData.currencyId,
					balance: 0,
				},
				{
					transaction: sequelizeTransaction,
				}
			);

			if (!accountBalance) {
				sequelizeTransaction.rollback();

				callback({
					status: false,
					message: "Error: Unable to handle this request.",
				});
				return;
			}
		}

		// body data
		let amount = req.amount;
		let type = req.type ? req.type : app_constants.TRANSACTION_OF.ORDER;

		// console.log('OrderId:', orderId, req)
		// query data
		let paymentMethodId = paymentMethodData.id;
		let userId = user.id;

		// default data
		let currentDate = moment().unix();

		/**
		 * 1.4 payment processing based on payment method
		 */
		if (paymentFunctions.includes(paymentMethodData.paymentFunction) && typeof paymentHelper[paymentMethodData.paymentFunction] !== "function") {
			sequelizeTransaction.rollback();
			callback({
				status: false,
				message: "Error: payment method is under development",
			});
			return;
		}

		let paymentResData = null;
		let splitPaymentResData = null;
		let pendingAmount = amount;
		let completedBySplitPayment = false;

		let splitPaymentMethod = await PaymentMethod.findOne({
			where: { slug: 'app_pay' },
			attributes: {
				include: ["paymentFunction", "instantPayment", "validParams"],
			},
			transaction: sequelizeTransaction,
		});

		try {
			if (type === "booking") {
				paymentReqData.paypalSuccess = "paypalBookingSuccess";
				paymentReqData.paypalFailure = "paypalBookingFailure";
			} else {
				paymentReqData.paypalSuccess = "paypalOrderSuccess";
				paymentReqData.paypalFailure = "paypalOrderFailure";
			}

			if (paymentReqData.splitPayment) {
				splitPaymentResData = await paymentHelper["appPay"](paymentReqData, amount, accountBalance, user, sequelizeTransaction);

				pendingAmount = splitPaymentResData.paymentResponse ? splitPaymentResData.paymentResponse.pendingAmount : amount;

				if (pendingAmount > 0) {
					paymentResData = await paymentHelper[paymentMethodData.paymentFunction](paymentReqData, splitPaymentResData.paymentResponse.pendingAmount, accountBalance, user);
				} else {
					completedBySplitPayment = true
				}
			} else {
				paymentResData = await paymentHelper[paymentMethodData.paymentFunction](paymentReqData, amount, accountBalance, user);
			}
		} catch (error) {
			console.log(error);
			sequelizeTransaction.rollback();

			callback({
				status: false,
				message: `${error?.response?.message ? error?.response?.message : error?.message}`,
			});
			return;
		}

		if (!paymentResData && !splitPaymentResData) {
			sequelizeTransaction.rollback();

			callback({
				status: false,
				message: "Error: payment response is empty",
			});
			return;
		}

		let paymentStatus = completedBySplitPayment? 'completed' : paymentResData?.paymentStatus ?paymentResData?.paymentStatus : splitPaymentResData?.paymentStatus;

		/**
		 * 3.1 - add payment history
		 */

		let paymentSummery = {
			paymentReqData: paymentReqData,
			payment: paymentResData?.paymentResponse ? paymentResData.paymentResponse : null,
			splitPayment: splitPaymentResData?.paymentResponse ? splitPaymentResData.paymentResponse : null,
		};

		// change for split payment
		let paymentRecordData = await Payment.create(
			{
				userId: userId,
				paymentMethod: paymentMethodId,
				paymentStatus: paymentStatus,
				amount: amount,
				paymentSummery: paymentSummery,
			},
			{
				transaction: sequelizeTransaction,
			}
		);

		if (!paymentRecordData) {
			sequelizeTransaction.rollback();

			callback({
				status: false,
				message: "Error: payment could not be stored for some reason",
			});
			return;
		}

		let orderId = req.orderId;
		// console.log(orderId);
		/**
		 * 3.2 create transaction
		 */
		let financialAccountTransactionData = await FinancialAccountTransaction.create(
			{
				userId,
				paymentId: paymentRecordData.id,
				orderId: orderId,
				transactionType: "debit",
				transactionOf: type,
				amount,
			},
			{
				transaction: sequelizeTransaction,
			}
		);

		if (!financialAccountTransactionData) {
			sequelizeTransaction.rollback();

			callback({
				status: false,
				message: "Error: payment could not be stored for some reason",
			});
			return;
		}

		if (pendingAmount > 0 && !paymentMethodData.instantPayment) {
			sequelizeTransaction.commit();

			callback(null, {
				status: true,
				data: JSON.stringify({
					pendingAmount: pendingAmount,
					instantPayment: paymentMethodData.instantPayment,
					paymentResponse: paymentResData.paymentResponse,
					completedBySplitPayment: completedBySplitPayment,
					splitPaymentMethod: splitPaymentMethod
				}),
			});
			return;
		}


		/**
		 * 4 - create invoice
		 */

		let folderName = md5(user.id);

		let storagePath = path.join(__dirname, `../../../storage/${folderName}`);

		let storagePathExists = fs.existsSync(storagePath);
		if (!storagePathExists) {
			fs.mkdirSync(storagePath);
		}

		let invoiceHtml = pug.renderFile(path.join(__dirname, "../../../views/invoice/index.pug"), {});
		let invoiceFilename = `invoice-${currentDate}.pdf`;

		pdf.create(invoiceHtml, {
			format: "Letter", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
			orientation: "portrait", // portrait or landscape
			type: "pdf", // allowed file types: png, jpeg, pdf
			quality: "75", // only used for types png & jpeg
		}).toFile(
			path.join(`${storagePath}/${invoiceFilename}`),
			async function (error, invoiceFileSaved) {
				if (error) {
					sequelizeTransaction.rollback();

					console.log(error);
					callback({
						status: false,
						message: "Error: Internal server error",
					});
					return;
				}

				console.log(invoiceFileSaved);
				try {
					let invoiceId =
						await invoiceHelper.getInvoiceIdWithConnection(
							sequelizeTransaction
						);

					let invoiceSummery = {
						amount: amount,
						user: user,
						transactionOf: type,
						paymentMethod: paymentMethodSlug,
						transactionData: financialAccountTransactionData,
						paymentData: paymentMethodData,
						paymentResData,
						splitPaymentResData,
					};

					let savedInvoiceData = await Invoice.create({
						invoiceId: invoiceId,
						invoiceSummery: invoiceSummery,
						file: invoiceFilename,
					});

					if (!savedInvoiceData) {
						sequelizeTransaction.rollback();

						callback({
							status: false,
							message: "Error: invoice data cannot be saved",
						});
						return;
					}

					financialAccountTransactionData.invoiceId = savedInvoiceData.id;
					await financialAccountTransactionData.save({
						transaction: sequelizeTransaction,
					});

					sequelizeTransaction.commit();
					// console.log(invoiceSaved)

					/**
					 * 5 - send email to user
					 */

					callback(null, {
						message: "Account Has Been topped up successfully.",
						data: JSON.stringify({
							pendingAmount: pendingAmount,
							instantPayment: paymentMethodData.instantPayment,
							balance: accountBalance.balance,
							completedBySplitPayment: completedBySplitPayment,
							splitPaymentMethod: splitPaymentMethod
						}),
					});
					return;
				} catch (error) {
					console.log(error);
					sequelizeTransaction.rollback();

					callback({
						status: false,
						message: "Error: Internal server error",
					});
					return;
				}
			}
		);
	} catch (error) {
		console.log(error);
		sequelizeTransaction.rollback();

		callback({
			status: false,
			message: `Error: ${error.message}`,
		});
		return;
	}
};

exports.getPaymentMethods = async function (call, callback) {
	let id = call.request.id;

	PaymentMethod.findAll({
		where: {
			[Op.and]: [
				{
					id: id,
				},
				{
					deleteStatus: false,
				},
			],
		},
	})
		.then((paymentMethods) => {
			if (paymentMethods && paymentMethods.length) {
				let stringifyPaymentMethods = JSON.stringify(
					paymentMethods[0].toJSON()
				);
				// console.log(stringifyPaymentMethods)

				callback(null, {
					status: true,
					data: stringifyPaymentMethods,
				});
				return;
			} else {
				return callback({
					status: false,
					message: "Unable to fetch item.",
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return callback({
				status: false,
				message: "Internal Server Error.",
			});
		});
};

exports.checkPromoAvailability = async function (call, callback) {
	console.log(call);
	let userId = call.request.userId;
	let promoCode = call.request.promoCode;
	PromoCode.findOne({
		where: {
			promoCode: promoCode,
			deleteStatus: false,
			status: "active",
			remainingLimit: {
				[Op.gt]: 0,
			},
		},
		include: {
			model: PromoHistory,
			where: {
				userId: userId,
			},
			required: false,
		},
	})
		.then((data) => {
			if (data) {
				if (
					data.promo_histories &&
					data.promo_histories.length < data.userMaxUseLimit
				) {
					callback(null, {
						status: true,
						message: "",
					});
				} else {
					callback(null, {
						status: false,
						message:
							"Maximum limit to use this promo code is exceeded.",
					});
				}
			} else {
				callback(null, {
					status: false,
					message: "Promo Code not available for use.",
				});
			}
		})
		.catch((err) => {
			console.log(err);
			callback(null, {
				message: "Internal Server Error.",
			});
		});
};

exports.addPromoHistory = async function (call, callback) {
	let userId = call.request.userId;
	let promoCode = call.request.promoCode;
	PromoCode.findOne({
		where: {
			promoCode: promoCode,
			deleteStatus: false,
			status: "active",
			remainingLimit: {
				[Op.gt]: 0,
			},
		}
	})
		.then((data) => {
			if (data) {
				PromoHistory.create({
					userId: userId,
					promoCodeId: data.id,
				});

				data.remainingLimit = data.remainingLimit - 1;
				data.save();
				console.log("PROMO CODE HISTORY ADDED");
				callback(null, {
					status: true,
					message: "",
				});
			} else {
				callback(null, {
					status: false,
					message: "",
				});
			}
		})
		.catch((err) => {
			console.log(err)
			callback(null, {
				status: false,
				message: "",
			});
		});
};

exports.refundToWallet = async function (call, callBack) {
	const sequelizeTransaction = await sequelize_conn.transaction();
	try {
		if (call.request.data) {
			let dataBody = JSON.parse(call.request.data)
			let refundResponse = await refundToWallet(sequelizeTransaction, dataBody)
			callBack(null, refundResponse)
		} else {
			callBack(null, { status: false, message: "Invalid Data." })
		}
	} catch (error) {
		console.log(error)
		callBack(null, { status: false, message: "Error: Internal Server Error." })
	}
}