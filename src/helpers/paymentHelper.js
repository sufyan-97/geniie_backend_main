// Libraries
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize')
const pug = require('pug');
const pdf = require('html-pdf');
const md5 = require('md5');
const moment = require("moment");

// Models
// const Invoice = require('../app/SqlModels/Invoice')
const Currency = require('../app/SqlModels/Currency');



// Custom Libraries
const { stripe } = require('../lib/stripe')
const { coinPaymentsClient } = require('../lib/coinpayments');
const paypal = require('../lib/paypal')


// Constants
const constants = require("../../config/constants");
const PaymentMethod = require('../app/SqlModels/PaymentMethod');
const { TRANSACTION_OF } = require('../app/Constants/app.constants');
const FinancialAccountTransaction = require('../app/SqlModels/FinancialAccountTransaction');
const User = require('../app/SqlModels/User');
const Country = require('../app/SqlModels/Country');
const Payment = require('../app/SqlModels/Payment');
const Invoice = require('../app/SqlModels/Invoice');
const invoiceHelper = require('./invoiceHelper');

module.exports = {
	cashOnDelivery: function (paymentReqData, amount, accountBalance, user) {
		return new Promise((resolve, reject) => {
			return resolve({
				paymentStatus: 'pending',
				paymentResponse: {
					amount: amount,
					paymentReqData: paymentReqData,
					// deductedAmount: 0
				}
			})
		})
	},

	appPay: function (paymentReqData, amount, accountBalance, user, sequelizeTransaction = null) {
		return new Promise(async (resolve, reject) => {
			if (!paymentReqData.splitPayment) {
				if (!(accountBalance.balance > 0) && accountBalance.balance < amount) {
					return reject({
						message: "Error: Insufficient balance"
					})
				}
			}

			try {
				let pendingAmount = amount;
				let paymentStatus = 'pending'

				if (!(accountBalance.balance > 0)) {
					return resolve({
						paymentStatus: paymentStatus,
						paymentResponse: {
							pendingAmount: pendingAmount,
							amount: amount,
							paymentReqData: paymentReqData,
							deductedAmount: 0
						}
					})
				}
				let deductedAmount = 0
				if (accountBalance.balance > amount) {
					pendingAmount = 0
					deductedAmount = amount
					paymentStatus = "completed"
				} else {
					pendingAmount -= accountBalance.balance
					deductedAmount = amount - pendingAmount
					paymentStatus = "partially paid"
				}
				accountBalance.balance = accountBalance.balance - deductedAmount;

				let saveOptions = {}
				if (sequelizeTransaction) {
					saveOptions = {
						transaction: sequelizeTransaction
					}
				}
				await accountBalance.save(saveOptions);

				return resolve({
					paymentStatus: paymentStatus,
					paymentResponse: {
						pendingAmount: pendingAmount,
						amount: amount,
						paymentReqData: paymentReqData,
						deductedAmount: deductedAmount
					}
				})
			} catch (error) {
				console.log(error.message)
				return reject(error)
			}
		})
	},

	stripePayment: function (paymentReqData, amount, accountBalance, user) {
		return new Promise(async (resolve, reject) => {
			try {
				console.log("STRIPE FUNCTION", user.stripeId);
				if (!user.stripeId) {
					return reject({
						status: false,
						message: "User not found"
					})
				}
				let cardId = paymentReqData.cardId;
				let cardInfo = await stripe.customers.retrieveSource(user.stripeId, cardId)

				if (!cardInfo) {
					return resolve(null)
				}

				let paymentResponse = await stripe.charges.create({
					amount: amount * 100,
					currency: accountBalance.currency?.currencyCode,
					source: cardInfo.id,
					customer: user.stripeId,
					metadata: {

					}
				})
				let paymentStatus = 'completed'
				return resolve({
					paymentResponse,
					paymentStatus
				})
			} catch (error) {
				console.log(error.message)
				return reject(error)
			}
		})
	},

	cryptoPayment: function (paymentReqData, amount, accountBalance, user) {
		return new Promise(async (resolve, reject) => {
			try {
				let cryptoCoin = await Currency.findOne({ where: { id: paymentReqData.coinId } })
				if (!cryptoCoin) {
					return resolve(null)
				}


				paymentResponse = await coinPaymentsClient.createTransaction({

					currency1: accountBalance.currency?.currencyCode,
					currency2: cryptoCoin.currencyCode,
					amount: amount,
					item_name: 'FOOD PAYMENT',
					buyer_name: 'Whistle-tech',
					buyer_email: user.email,
					// ipn_url?: string;
					// success_url?: string;
					// cancel_url?: string;
				})
				let paymentStatus = 'pending'

				return resolve({
					paymentResponse,
					paymentStatus
				})
			} catch (error) {
				return reject(error)
			}
		})

	},

	paypalPayment: function (paymentReqData, amount, accountBalance, user) {
		let successEndpoint = paymentReqData.paypalSuccess ? paymentReqData.paypalSuccess : 'paypalSuccess'
		let failureEndpoint = paymentReqData.paypalFailure ? paymentReqData.paypalFailure : 'paypalFailure'
		return new Promise((resolve, reject) => {
			var create_payment_json = {
				intent: "sale",
				payer: {
					payment_method: "paypal",
					// payer_id: user.email
				},

				redirect_urls: {
					return_url: `${constants.HOST}/ipn/${successEndpoint}`,
					cancel_url: `${constants.HOST}/ipn/${failureEndpoint}`
				},
				transactions: [
					{
						// item_list: {
						//     items: [{
						//         name: "item",
						//         sku: "item",
						//         price: amount,
						//         currency: accountBalance.currency?.currencyCode,
						//         quantity: 1
						//     }]
						// },
						payee: {
							email: user.email
						},
						amount: {
							currency: accountBalance.currency?.currencyCode,
							total: amount
						},
						description: "This is the payment description."
					}
				]
			};

			// console.log(JSON.stringify(create_payment_json))
			paypal.payment.create(create_payment_json, function (error, paymentResponse) {
				if (error) {
					// console.log(error)
					return reject(error);
				}
				try {
					let paymentStatus = 'pending'

					// console.log('paymentResponse:', paymentResponse)
					const execute_payment_json = {
						// payer: { payment_method: 'paypal' },
						payer_id: 'paypal',
						transactions: [{
							amount: {
								currency: "USD",
								total: amount
							}
						}]
					};
					return resolve({
						paymentResponse,
						paymentStatus
					})
					// paypal.payment.execute(paymentResponse.id, execute_payment_json, function (error, payment) {
					//     if (error) {
					//         console.log(error.response);
					//         throw error;
					//     } else {
					//         console.log("-------Response--------" + JSON.stringify(payment));
					//         res.redirect("/payment_success");
					//     }
					//     console.log(payment)
					// });
				} catch (error) {
					reject(error)
				}

			});
		})

	},

	refundToWallet: function (sequelizeTransaction = null, dataBody = {}) {
		return new Promise(async (resolve, reject) => {
			try {
				let walletUserId = dataBody.userId
				let summary = dataBody.paymentSummary
				/**
				 * 1.1 - check if user is not exists
				 */
				const user = await User.findOne({
					where: {
						id: walletUserId,
						deleteStatus: false,
						// stripeId: {
						//     [Op.not]: null
						// }
					}
				}, { transaction: sequelizeTransaction })


				if (!user) {
					sequelizeTransaction.rollback()
					return resolve({
						status: false,
						message: "Error: User not found"
					})
				}

				/**
				 * 1.2 - get existing accountBalance
				 */

				let accountBalance = await user.getAccountBalance({
					include: [{
						model: Currency,
						// attributes: ['currencySymbol']
					}]
				}, {
					transaction: sequelizeTransaction
				})

				/**
				 * 1.3 create accountBalance if not exists
				 */
				if (!accountBalance) {
					// add user Account Balance here.
					let countryCode = constants.DEFAULT_COUNTRY;

					// let ipAddress = req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.header('x-real-ip') ? req.header('x-real-ip') : req.connection.remoteAddress

					// let ipInfo = await generalHelper.getIpInformation(ipAddress)
					// countryCode = ipInfo?.country ? ipInfo?.country : countryCode

					// Country
					let countryData = await Country.findOne({
						where: {
							countryCode: countryCode
						}
					})

					if (!countryData || !countryData.currencyId) {
						sequelizeTransaction.rollback()
						return resolve({
							status: false,
							message: 'Error: country or currency not found'
						})
					}

					accountBalance = await user.createAccountBalance({
						countryId: countryData.id,
						currencyId: countryData.currencyId,
						balance: 0
					}, {
						transaction: sequelizeTransaction
					})

					if (!accountBalance) {
						sequelizeTransaction.rollback()
						return resolve({
							message: 'Error: Unable to handle this request.',
						});
					}
				}

				// body data
				let amount = dataBody.amount;

				// query data
				let paymentMethodSlug = 'system_pay'

				let paymentMethodData = await PaymentMethod.findOne({
					where: {
						slug: paymentMethodSlug,
					}
				}, {
					transaction: sequelizeTransaction
				})

				if (!paymentMethodData) {
					return resolve({
						message: 'Error: Unable to handle this request.',
					});
				}

				let userId = user.id

				// default data
				let currentDate = moment().unix()

				let paymentStatus = "completed"

				/**
				 * 3.1 - add payment history
				 */

				let paymentRecordData = await Payment.create({
					userId: userId,
					paymentMethod: paymentMethodData.id,
					paymentStatus: paymentStatus,
					amount: amount,
					paymentSummery: summary
				}, {
					transaction: sequelizeTransaction
				})


				if (!paymentMethodData) {
					sequelizeTransaction.rollback();

					return resolve({
						status: false,
						message: 'Error: payment could not be stored for some reason'
					})
				}

				/**
				 * 3.2 create transaction
				 */
				let financialAccountTransactionData = await FinancialAccountTransaction.create({
					userId,
					paymentId: paymentRecordData.id,
					transactionType: 'credit',
					transactionOf: TRANSACTION_OF.REFUND,
					amount,
					orderId: dataBody.orderId
				}, {
					transaction: sequelizeTransaction
				})

				if (!financialAccountTransactionData) {
					sequelizeTransaction.rollback();
					return resolve({
						status: false,
						message: 'Error: payment could not be stored for some reason'
					})
				}


				/**
				 * 3 - update account balance
				 */
				accountBalance.balance = parseFloat(accountBalance.balance) + parseFloat(amount)
				await accountBalance.save({ transaction: sequelizeTransaction })



				/**
				 * 4 - create invoice
				 */

				let folderName = md5(user.id)

				let storagePath = path.join(__dirname, `../storage/${folderName}`)
				let storagePathExists = fs.existsSync(storagePath)
				if (!storagePathExists) {
					fs.mkdirSync(storagePath);
				}

				let invoiceHtml = pug.renderFile(path.join(__dirname, '../views/invoice/index.pug'), {

				})
				let invoiceFilename = `invoice-${currentDate}.pdf`

				pdf.create(invoiceHtml, {
					format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
					orientation: "portrait", // portrait or landscape
					type: "pdf",           // allowed file types: png, jpeg, pdf
					quality: "75",         // only used for types png & jpeg
				}).toFile(path.join(`${storagePath}/${invoiceFilename}`), async function (error, invoiceFileSaved) {
					if (error) {
						console.log(error)
						sequelizeTransaction.rollback();
						resolve({ status: false, message: "Unable to handle this request." })
					}
					console.log(invoiceFileSaved)
					try {
						let invoiceId = await invoiceHelper.getInvoiceIdWithConnection(sequelizeTransaction)

						let invoiceSummery = {
							amount: amount,
							user: user,
							transactionOf: TRANSACTION_OF.REFUND,
							paymentMethod: paymentMethodSlug,
							transactionData: financialAccountTransactionData,
							paymentData: paymentMethodData
						}

						let savedInvoiceData = await Invoice.create({
							invoiceId: invoiceId,
							invoiceSummery: invoiceSummery,
							file: invoiceFilename
						})

						if (!savedInvoiceData) {
							sequelizeTransaction.rollback();
							resolve({ status: false, message: "Unable to handle this request." })
						}

						financialAccountTransactionData.invoiceId = savedInvoiceData.id
						await financialAccountTransactionData.save({
							transaction: sequelizeTransaction
						})

						sequelizeTransaction.commit();

						/**
						 * 5 - send email to user
						 */
						//SEND REDUND EMAIL


						resolve({ status: true, message: "Account Has Been topped up successfully." })
					} catch (error) {
						console.log(error)
						sequelizeTransaction.rollback();
						resolve({ status: false, message: "Unable to handle this request." })
					}


				})

			} catch (error) {
				console.log(error)
				await sequelizeTransaction.rollback();
				resolve({ status: false, message: "Unable to handle this request." })
			}
		})

	},

	createPaymentAndTransaction: function (sequelizeTransaction = null, requestData = {}) {
		return new Promise(async (resolve, reject) => {
			try {
				let user = requestData.user
				let userId = user.id
				let summary = requestData.paymentSummary
				let amount = requestData.amount;
				let paymentMethodSlug = 'system_pay'
				let transactionOf = requestData.transactionOf
				let transactionData = requestData.transactionData

				let paymentMethodData = await PaymentMethod.findOne({
					where: {
						slug: paymentMethodSlug,
					}
				}, {
					transaction: sequelizeTransaction
				})

				if (!paymentMethodData) {
					return resolve({ status: false, message: "PaymentMethodData Issue." })
				}


				// default data
				let currentDate = moment().unix()

				let paymentStatus = "completed"

				/**
				 * 3.1 - add payment history
				 */

				let paymentRecordData = await Payment.create({
					userId: userId,
					paymentMethod: paymentMethodData.id,
					paymentStatus: paymentStatus,
					amount: amount,
					paymentSummery: summary
				}, {
					transaction: sequelizeTransaction
				})


				if (!paymentMethodData) {
					sequelizeTransaction.rollback();

					return resolve({ status: false })
				}

				/**
				 * 3.2 create transaction
				 */
				let financialAccountTransactionData = await FinancialAccountTransaction.create({
					userId,
					paymentId: paymentRecordData.id,
					transactionType: 'credit',
					transactionOf: transactionOf,
					amount,
					transactionData: transactionData
				}, {
					transaction: sequelizeTransaction
				})

				if (!financialAccountTransactionData) {
					sequelizeTransaction.rollback();

					return resolve({ status: false })
				}

				/**
				 * 4 - create invoice
				 */

				let folderName = md5(userId)

				let storagePath = path.join(__dirname, `../storage/${folderName}`)
				let storagePathExists = fs.existsSync(storagePath)
				if (!storagePathExists) {
					fs.mkdirSync(storagePath);
				}

				let invoiceHtml = pug.renderFile(path.join(__dirname, '../views/invoice/index.pug'), {

				})
				let invoiceFilename = `invoice-${currentDate}.pdf`

				pdf.create(invoiceHtml, {
					format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
					orientation: "portrait", // portrait or landscape
					type: "pdf",           // allowed file types: png, jpeg, pdf
					quality: "75",         // only used for types png & jpeg
				}).toFile(path.join(`${storagePath}/${invoiceFilename}`), async function (error, invoiceFileSaved) {
					if (error) {
						console.log(error)
						sequelizeTransaction.rollback();
						resolve({ status: false })
					}
					try {
						let invoiceId = await invoiceHelper.getInvoiceIdWithConnection(sequelizeTransaction)

						let invoiceSummery = {
							amount: amount,
							user: user,
							transactionOf: transactionOf,
							paymentMethod: paymentMethodSlug,
							transactionData: financialAccountTransactionData,
							paymentData: paymentMethodData
						}

						let savedInvoiceData = await Invoice.create({
							invoiceId: invoiceId,
							invoiceSummery: invoiceSummery,
							file: invoiceFilename
						})

						if (!savedInvoiceData) {
							sequelizeTransaction.rollback();
							return resolve({ status: false })
						}

						financialAccountTransactionData.invoiceId = savedInvoiceData.id

						await financialAccountTransactionData.save({
							transaction: sequelizeTransaction
						})

						return resolve({ status: true })

					} catch (error) {
						console.log(error)
						sequelizeTransaction.rollback();
						return resolve({ status: false })
					}


				})

			} catch (error) {
				console.log(error)
				await sequelizeTransaction.rollback();
				return resolve({ status: false, message: "Unable to handle this request." })
			}
		})

	}


}

