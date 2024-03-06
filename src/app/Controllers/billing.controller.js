//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Libraries
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize')
const pug = require('pug');
const pdf = require('html-pdf');
const md5 = require('md5');
const moment = require("moment");

// Modals
const User = require('../SqlModels/User');
const Currency = require('../SqlModels/Currency');
const Payment = require('../SqlModels/Payment');
const PaymentMethod = require('../SqlModels/PaymentMethod');
const FinancialAccountTransaction = require('../SqlModels/FinancialAccountTransaction');
const Invoice = require('../SqlModels/Invoice');


// Helpers
const generalHelper = require('../../helpers/general_helper');
const invoiceHelper = require('../../helpers/invoiceHelper');
const paymentHelper = require('../../helpers/paymentHelper');
const general_helper = require('../../helpers/general_helper');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');
const { stripe } = require('../../lib/stripe')

// Constants
const app_constants = require('../Constants/app.constants')
const constants = require('../../../config/constants');
const { refundToWallet } = require('../../helpers/paymentHelper');
const paymentFunctions = Object.keys(paymentHelper)


// ============= Crypto APIs ============= //

exports.getCryptoCoins = async function (req, res) {
	try {

		Currency.findAll({
			where: {
				status: true,
				currencyType: 'crypto'
			},
			attributes: ['id', 'currencyName', 'currencyCode', 'currencySymbol']
		}).then(coinList => {

			return res.send({
				status: true,
				data: coinList
			})
		}).catch(err => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		})

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

// ============= Stripe APIs ============= //

exports.getCards = async function (req, res) {
	try {

		const user = await User.findOne({
			where: {
				id: req.user.id,
				deleteStatus: false,

			}
		})

		if (!user) {
			return res.status(400).send({
				status: false,
				message: "Error: User not found"
			})
		}

		if (!user.stripeId) {
			return res.send({
				status: true,
				data: []
			})
		}

		let cardList = [];

		let cards = await stripe.customers.listSources(user.stripeId)
		cards?.data.map(cardData => {
			cardList.push({
				id: cardData.id,
				brand: cardData.brand,
				exp_month: cardData.exp_month,
				exp_year: cardData.exp_month,
				last4: cardData.last4
			})
		});
		return res.send({
			status: true,
			data: cardList
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.addCard = async function (req, res) {
	try {

		const user = await User.findOne({
			where: {
				id: req.user.id,
				deleteStatus: false,

			}
		})

		if (!user) {
			return res.status(400).send({
				status: false,
				message: "Error: User not found"
			})
		}


		if (!user.stripeId) {
			let customerInfo = await stripe.customers.create({
				email: user.email,
				name: user.username
			})

			if (!customerInfo) {
				return res.send({
					status: false,
					message: 'Error: Customer cannot be created'
				})
			}

			user.stripeId = customerInfo.id
			await user.save();
		}


		let cardNumber = req.body.cardNumber;
		let expiryMonth = req.body.expiryMonth;
		let expiryYear = req.body.expiryYear;
		let cardHolderName = req.body.cardHolderName;
		let cardCvc = req.body.cardCvc


		let previousCards = []
		try {

			previousCards = await stripe.customers.listSources(user.stripeId)
		} catch (error) {
			return res.status(400).send({
				status: false,
				message: `Error: ${error.message}`
			})
		}

		let prevCardData = previousCards.data;

		let findCard = prevCardData.find((prevCard) => {
			if (String(prevCard.exp_year).slice(-2) == expiryYear && prevCard.exp_month == expiryMonth && prevCard.last4 === cardNumber.substr(cardNumber.length - 4)) {
				return prevCard
			}
		})

		if (findCard) {
			return res.status(400).send({
				status: false,
				message: 'Error: card has already been added'
			})
		}

		let cardToken = null

		try {
			cardToken = await stripe.tokens.create({
				card: {
					number: cardNumber,
					exp_month: expiryMonth,
					exp_year: expiryYear,
					name: cardHolderName,
					cvc: cardCvc
				}
			})

		} catch (error) {
			return res.status(400).send({
				status: false,
				message: `Error: ${error.message}`
			})
		}

		if (!cardToken) {
			return res.status(400).send({
				status: false,
				message: 'Error: card not saved'
			})
		}
		console.log(req.body, user.stripeId)

		// let getCard = await stripe.stripe.customers.retrieveSource()
		let card = await stripe.customers.createSource(user.stripeId, {
			source: cardToken.id
		})

		console.log(card)

		return res.send({
			status: true,
			message: 'card has been saved successfully'
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.deleteCard = async function (req, res) {
	try {
		const cardId = req.query.cardId;

		const user = await User.findOne({
			where: {
				id: req.user.id,
				deleteStatus: false,

			}
		})

		if (!user) {
			return res.status(400).send({
				status: false,
				message: "Error: User not found"
			})
		}

		if (!user.stripeId) {
			return res.send({
				status: false,
				message: 'Error: card is not available'
			})
		}

		let cardStatus = null;

		try {
			cardStatus = await stripe.customers.deleteSource(user.stripeId, cardId)
		} catch (error) {
			return res.status(400).send({
				status: false,
				message: `Error: ${error.message}`
			})
		}
		if (!cardStatus) {
			return res.status(400).send({
				status: false,
				message: "Error: card not found"
			})
		}
		if (user.selectedCardId === cardStatus.id) {
			user.selectedCardId = null;
			await user.save()
		}

		return res.send({
			status: true,
			user: user ? user : {},
			message: 'card has been deleted successfully'
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.switchCard = async function (req, res) {
	try {
		const cardId = req.body.cardId;

		const user = await User.findOne({
			where: {
				id: req.user.id,
				deleteStatus: false,

			}
		})

		if (!user) {
			return res.status(400).send({
				status: false,
				message: "Error: User not found"
			})
		}

		if (!user.stripeId) {
			return res.send({
				status: false,
				message: 'Error: card is not available'
			})
		}

		let cardInfo = null
		try {
			cardInfo = await stripe.customers.retrieveSource(user.stripeId, cardId)

		} catch (error) {
			return res.status(400).send({
				message: 'Error: invalid card'
			})
		}

		// console.log('testing===', cardInfo)
		if (!cardInfo) {
			return res.status(400).send({
				message: 'Error: invalid card'
			})
		}

		user.selectedCardId = cardId;
		await user.save()

		return res.send({
			user: user ? user : {},
			status: true,
			message: 'Default card has been selected'
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}


// ============= General Billing APIs ============= //
exports.switchPaymentMethod = async function (req, res) {
	try {

		const user = await User.findOne({
			where: {
				id: req.user.id,
				deleteStatus: false,

			}
		})

		if (!user) {
			return res.status(400).send({
				status: false,
				message: "Error: User not found"
			})
		}

		const paymentMethodId = req.body.paymentMethodId;

		let paymentMethodInfo = await PaymentMethod.findOne({
			where: {
				id: paymentMethodId
			}
		})
		// console.log('testing===', cardInfo)
		if (!paymentMethodInfo) {
			return res.status(400).send({
				message: 'Error: invalid payment method'
			})
		}

		user.paymentMethodId = paymentMethodId;
		await user.save()

		return res.send({
			user: user ? user : {},
			status: true,
			message: 'Default payment method has been saved'
		})

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.topUp = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();
	try {

		/**
		 * 1.0 - check if user is not exists
		 */
		let paymentMethodSlug = req.body.paymentMethodSlug

		let paymentMethodData = await PaymentMethod.findOne({
			where: {
				slug: paymentMethodSlug,
				isTopup: true
			},
			attributes: {
				include: ['paymentFunction', 'instantPayment', 'validParams']
			}
		}, {
			transaction: sequelizeTransaction
		})


		if (!paymentMethodData || !paymentMethodData.paymentFunction) {
			sequelizeTransaction.rollback()
			return res.status(400).send({
				status: false,
				message: "Error: Payment Method not Supported"
			})
		}
		let paymentReqData = req.body.paymentData

		let validatePaymentMethodData = generalHelper.validateReqData(paymentReqData && Object.keys(paymentReqData).length ? paymentReqData : {}, paymentMethodData.validParams)
		if (!validatePaymentMethodData) {
			sequelizeTransaction.rollback()
			return res.status(422).send({
				status: false,
				message: 'invalid data'
			})
		}

		/**
		 * 1.1 - check if user is not exists
		 */
		const user = await User.findOne({
			where: {
				id: req.user.id,
				deleteStatus: false,
				// stripeId: {
				//     [Op.not]: null
				// }
			}
		}, { transaction: sequelizeTransaction })


		if (!user) {
			sequelizeTransaction.rollback()
			return res.status(400).send({
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
				return res.status(500).send({
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
				return res.status(500).send({
					message: 'Error: Unable to handle this request.',
				});
			}
		}

		// body data
		let amount = req.body.amount;

		// query data
		let paymentMethodId = paymentMethodData.id
		let userId = user.id

		// default data
		let currentDate = moment().unix()


		/**
		 * 1.4 payment processing based on payment method
		 */
		if (paymentFunctions.includes(paymentMethodData.paymentFunction) && typeof paymentHelper[paymentMethodData.paymentFunction] !== 'function') {
			sequelizeTransaction.rollback()
			return res.status(400).send({
				status: false,
				message: 'Error: payment method is under development'
			})
		}

		let paymentResData = await paymentHelper[paymentMethodData.paymentFunction](paymentReqData, amount, accountBalance, user)
		if (!paymentResData) {
			sequelizeTransaction.rollback();
			return res.status(400).send({
				status: false,
				message: 'Error: payment response is empty'
			})
		}

		let paymentStatus = paymentResData.paymentStatus
		let paymentResponse = paymentResData.paymentResponse

		/**
		 * 3.1 - add payment history
		 */

		let paymentRecordData = await Payment.create({
			userId: userId,
			paymentMethod: paymentMethodId,
			paymentStatus: paymentStatus,
			amount: amount,
			paymentSummery: paymentResponse
		}, {
			transaction: sequelizeTransaction
		})


		if (!paymentMethodData) {
			sequelizeTransaction.rollback();

			return res.status(400).send({
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
			transactionOf: app_constants.TRANSACTION_OF.TOP_UP,
			amount
		}, {
			transaction: sequelizeTransaction
		})

		if (!financialAccountTransactionData) {
			sequelizeTransaction.rollback();

			return res.status(400).send({
				status: false,
				message: 'Error: payment could not be stored for some reason'
			})
		}

		if (!paymentMethodData.instantPayment) {
			sequelizeTransaction.commit()
			return res.send({
				status: true,
				data: {
					...paymentResponse
				}
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

		let storagePath = path.join(__dirname, `../../storage/${folderName}`)
		let storagePathExists = fs.existsSync(storagePath)
		if (!storagePathExists) {
			fs.mkdirSync(storagePath);
		}

		let invoiceHtml = pug.renderFile(path.join(__dirname, '../../views/invoice/index.pug'), {

		})
		let invoiceFilename = `invoice-${currentDate}.pdf`

		pdf.create(invoiceHtml, {
			format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
			orientation: "portrait", // portrait or landscape
			type: "pdf",           // allowed file types: png, jpeg, pdf
			quality: "75",         // only used for types png & jpeg
		}).toFile(path.join(`${storagePath}/${invoiceFilename}`), async function (error, invoiceFileSaved) {
			if (error) {
				sequelizeTransaction.rollback();

				console.log(error)
				return respondWithError(req, res, '', null, 500)
			}
			console.log(invoiceFileSaved)
			try {
				let invoiceId = await invoiceHelper.getInvoiceIdWithConnection(sequelizeTransaction)

				let invoiceSummery = {
					amount: amount,
					user: user,
					transactionOf: app_constants.TRANSACTION_OF.TOP_UP,
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
					sequelizeTransaction.rollback()
					return res.status(400).send({
						status: false,
						message: 'Error: invoice data cannot be saved'
					})
				}

				financialAccountTransactionData.invoiceId = savedInvoiceData.id
				await financialAccountTransactionData.save({
					transaction: sequelizeTransaction
				})

				sequelizeTransaction.commit();

				/**
				 * 5 - send email to user
				 */

				return res.send({
					message: "Account Has Been topped up successfully.",
					balanceAmount: accountBalance.balance
				})
			} catch (error) {
				console.log(error)
				sequelizeTransaction.rollback();
				return respondWithError(req, res, '', null, 500)
			}


		})

	} catch (error) {
		console.log(error)
		await sequelizeTransaction.rollback();
		return respondWithError(req, res, '', null, 500)
	}
}


exports.payCashFromWallet = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();
	try {

		let cash = req.body.cash;

		/**
		 * 1.0 - get user information
		 */
		const user = await User.findOne({
			where: {
				id: req.user.id,
				deleteStatus: false
			}
		}, { transaction: sequelizeTransaction })


		/**
		 * 1.1 - verify user information
		 */
		if (!user) {
			sequelizeTransaction.rollback()
			return respondWithError(req, res, 'User not found', null, 400)
		}


		/**
		 * 1.2 - get existing accountBalance
		 */
		let accountBalance = await user.getAccountBalance({
			include: [{
				model: Currency
			}]
		}, {
			transaction: sequelizeTransaction
		})

		/**
		 * 1.3 create accountBalance if not exists
		 */
		if (!accountBalance) {
			await sequelizeTransaction.rollback();
			return respondWithError(req, res, 'Account balance is not setup', null, 400)
		}

		if (cash > accountBalance.balance) {
			await sequelizeTransaction.rollback();
			return respondWithError(req, res, 'Limit exceeded cash in wallet', null, 400)
		}

		if (cash > accountBalance.cashInHand) {
			await sequelizeTransaction.rollback();
			return respondWithError(req, res, 'Limited cash in hand', null, 400)
		}



		let paymentMethodData = await PaymentMethod.findOne({
			where: {
				slug: 'app_pay',
				isTopup: true
			},
			attributes: {
				include: ['paymentFunction', 'instantPayment', 'validParams']
			}
		}, {
			transaction: sequelizeTransaction
		})


		if (!paymentMethodData) {
			sequelizeTransaction.rollback()
			return res.status(400).send({
				status: false,
				message: "Error: Payment Method not Supported"
			})
		}

		/**
		 * 3.1 - add payment history
		 */

		let paymentRecordData = await Payment.create({
			userId: user.id,
			paymentMethod: paymentMethodData.id,
			paymentStatus: 'completed',
			amount: cash,
			paymentSummery: {
				paymentStatus: 'completed',
				paymentResponse: {
					amount: cash,
					deductedAmount: cash
				}
			}
		}, {
			transaction: sequelizeTransaction
		})


		if (!paymentRecordData) {
			sequelizeTransaction.rollback();

			return res.status(400).send({
				status: false,
				message: 'Error: payment could not be stored for some reason'
			})
		}

		/**
		 * 3.2 create transaction
		 */
		let financialAccountTransactionData = await FinancialAccountTransaction.create({
			userId: user.id,
			paymentId: paymentRecordData.id,
			transactionType: 'debit',
			transactionOf: app_constants.TRANSACTION_OF.CASH_PAID,
			amount: cash
		}, {
			transaction: sequelizeTransaction
		})

		if (!financialAccountTransactionData) {
			sequelizeTransaction.rollback();

			return res.status(400).send({
				status: false,
				message: 'Error: payment could not be stored for some reason'
			})
		}


		accountBalance.balance = accountBalance.balance - cash;
		accountBalance.cashInHand = accountBalance.cashInHand - cash;
		await accountBalance.save()

		sequelizeTransaction.commit()

		return respondWithSuccess(req, res, 'Payment has been made successfully')

	} catch (error) {
		console.log(error)
		await sequelizeTransaction.rollback();
		return respondWithError(req, res, '', null, 500)
	}
}

exports.getPaymentHistory = async function (req, res) {
	try {
		let size = req.query.size ? Number(req.query.size) : 10;
		let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
		let frequency = req.query.frequency ? req.query.frequency : "latest";
		let startDate = req.query.startDate ? req.query.startDate : null;

		let endDate = req.query.endDate
			? req.query.endDate
			: moment().format("YYYY-MM-DD hh:mm:ss");

		if (frequency == 'latest') {
		}
		else if (frequency == '7_days') {

			startDate = moment().subtract(7, 'days').startOf('day')
			// .format("YYYY-MM-DD hh:mm:ss")
			endDate = moment()
			// .format("YYYY-MM-DD hh:mm:ss")

		} else if (frequency == 'last_month') {

			startDate = moment().subtract(1, 'month').startOf('month').startOf('day')
			// .format("YYYY-MM-DD hh:mm:ss")
			endDate = moment().subtract(1, 'month').endOf('month').endOf('day')
			// .format("YYYY-MM-DD hh:mm:ss")

		} else if (frequency == 'this_month') {

			startDate = moment().startOf('month').startOf('day')
			// .format("YYYY-MM-DD hh:mm:ss")
			endDate = moment()
			// .format("YYYY-MM-DD hh:mm:ss")

		} else if (frequency == 'range' && startDate && startDate != '' && endDate && endDate != '') {

			startDate = moment(startDate)
			// .format("YYYY-MM-DD hh:mm:ss")
			endDate = moment(endDate)
			// .format("YYYY-MM-DD hh:mm:ss")

		} else {
			return res.status(422).send({
				message: 'Invalid Data',
			})
		}
		// console.log(startDate, endDate)
		let transactionWhere = { [Op.not]: { transactionOf: "payroll" } };

		let offset = 0;

		let pagination = {};
		if (!Number.isNaN(size)) {
			if (pageNo > 1) {
				offset = size * pageNo - size;
			}
			pagination.limit = size;
			pagination.offset = offset;
			pagination.pageNo = pageNo;
		}

		if (req.user.roles[0].roleName === 'admin') {
			transactionWhere.userId = req.query.userId;
		} else {
			transactionWhere.userId = req.user.id;
		}

		if (frequency != 'latest') {
			transactionWhere.createdAt = {
				[Op.between]: [startDate, endDate],
			};
		} else {
			pagination.order = [['id', 'DESC']]
		}
		// console.log('pagination=>', pagination);
		// console.log('transactionWhere=>', transactionWhere);


		let transactions = await FinancialAccountTransaction.findAll({
			where: {
				...transactionWhere
			},
			include: [{
				model: Payment,
				as: 'payment',
				include: [{
					model: PaymentMethod,
					attributes: ['id', 'name', 'image'],
				}]
			}],
			...pagination,
		})
		// console.log(transactions)
		return res.send({
			data: transactions
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.serviceTransaction = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();
	try {

		/**
		 * 1.0 - check if user is not exists
		 */
		let paymentMethodSlug = req.body.paymentMethodSlug

		let paymentMethodData = await PaymentMethod.findOne({
			where: { slug: paymentMethodSlug },
			attributes: {
				include: ['paymentFunction', 'instantPayment', 'validParams']
			}
		}, {
			transaction: sequelizeTransaction
		})


		if (!paymentMethodData || !paymentMethodData.paymentFunction) {
			sequelizeTransaction.rollback()
			return res.status(400).send({
				status: false,
				message: "Error: Payment Method not Supported"
			})
		}

		let paymentReqData = req.body.paymentData

		let validatePaymentMethodData = generalHelper.validateReqData(paymentReqData && Object.keys(paymentReqData).length ? paymentReqData : {}, paymentMethodData.validParams)
		if (!validatePaymentMethodData) {
			sequelizeTransaction.rollback()
			return res.status(422).send({
				status: false,
				message: 'invalid data'
			})
		}

		/**
		 * 1.1 - check if user is not exists
		 */
		const user = await User.findOne({
			where: {
				id: req.user.id,
				deleteStatus: false,
				stripeId: {
					[Op.not]: null
				}
			}
		}, { transaction: sequelizeTransaction })


		if (!user) {
			sequelizeTransaction.rollback()
			return res.status(400).send({
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
				return res.status(500).send({
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
				return res.status(500).send({
					message: 'Error: Unable to handle this request.',
				});
			}
		}

		// body data
		let amount = req.body.amount;
		let orderId = req.body.orderId

		// query data
		let paymentMethodId = paymentMethodData.id
		let userId = user.id

		// default data
		let currentDate = moment().unix()


		/**
		 * 1.4 payment processing based on payment method
		 */
		if (paymentFunctions.includes(paymentMethodData.paymentFunction) && typeof paymentHelper[paymentMethodData.paymentFunction] !== 'function') {
			sequelizeTransaction.rollback()
			return res.status(400).send({
				status: false,
				message: 'Error: payment method is under development'
			})
		}

		let paymentResData = await paymentHelper[paymentMethodData.paymentFunction](paymentReqData, amount, accountBalance, user)
		if (!paymentResData) {
			sequelizeTransaction.rollback();
			return res.status(400).send({
				status: false,
				message: 'Error: payment response is empty'
			})
		}

		let paymentStatus = paymentResData.paymentStatus
		let paymentResponse = paymentResData.paymentResponse

		/**
		 * 3.1 - add payment history
		 */

		let paymentRecordData = await Payment.create({
			userId: userId,
			paymentMethod: paymentMethodId,
			paymentStatus: paymentStatus,
			amount: amount,
			paymentSummery: JSON.stringify(paymentResponse)
		}, {
			transaction: sequelizeTransaction
		})


		if (!paymentMethodData) {
			sequelizeTransaction.rollback();

			return res.status(400).send({
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
			orderId: orderId,
			transactionType: 'debit',
			transactionOf: app_constants.TRANSACTION_OF.ORDER,
			amount
		}, {
			transaction: sequelizeTransaction
		})

		if (!financialAccountTransactionData) {
			sequelizeTransaction.rollback();

			return res.status(400).send({
				status: false,
				message: 'Error: payment could not be stored for some reason'
			})
		}

		if (!paymentMethodData.instantPayment) {
			sequelizeTransaction.commit()
			return res.send({
				status: true,
				data: {
					...paymentResponse
				}
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

		let storagePath = path.join(__dirname, `../../storage/${folderName}`)
		let storagePathExists = fs.existsSync(storagePath)
		if (!storagePathExists) {
			fs.mkdirSync(storagePath);
		}

		let invoiceHtml = pug.renderFile(path.join(__dirname, '../../views/invoice/index.pug'), {

		})
		let invoiceFilename = `invoice-${currentDate}.pdf`

		pdf.create(invoiceHtml, {
			format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
			orientation: "portrait", // portrait or landscape
			type: "pdf",           // allowed file types: png, jpeg, pdf
			quality: "75",         // only used for types png & jpeg
		}).toFile(path.join(`${storagePath}/${invoiceFilename}`), async function (error, invoiceFileSaved) {
			if (error) {
				sequelizeTransaction.rollback();

				console.log(error)
				return respondWithError(req, res, '', null, 500)
			}

			try {
				let invoiceId = await invoiceHelper.getInvoiceIdWithConnection(sequelizeTransaction)

				let invoiceSummery = {
					amount: amount,
					user: user,
					transactionOf: app_constants.TRANSACTION_OF.TOP_UP,
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
					sequelizeTransaction.rollback()
					return res.status(400).send({
						status: false,
						message: 'Error: invoice data cannot be saved'
					})
				}

				financialAccountTransactionData.invoiceId = savedInvoiceData.id
				await financialAccountTransactionData.save({
					transaction: sequelizeTransaction
				})


				sequelizeTransaction.commit();
				// console.log(invoiceSaved)

				/**
				 * 5 - send email to user
				 */

				return res.send({
					message: "Account Has Been topped up successfully.",
					balanceAmount: accountBalance.balance
				})
			} catch (error) {
				console.log(error)
				sequelizeTransaction.rollback();
				return respondWithError(req, res, '', null, 500)
			}
		})

	} catch (error) {
		console.log(error)
		sequelizeTransaction.rollback();
		return res.status(500).send({
			status: false,
			message: `Error: ${error.message}`
		})
	}
}

exports.getStatements = async function (req, res) {
	try {
		let size = req.query.size ? Number(req.query.size) : 10;
		let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
		let user = req.user;

		// console.log(startDate, endDate)
		let transactionWhere = { transactionOf: "payroll" };

		let agentRoles = await general_helper.getAgentRoles();

		if (user.roleName === 'admin' || user.roleName === 'provider' || agentRoles.includes(user.roleName)) {
			transactionWhere.userId = req.query.userId
		} else {
			transactionWhere.userId = user.id
		}

		let offset = 0;
		let pagination = {};
		if (!Number.isNaN(size)) {
			if (pageNo > 1) {
				offset = size * pageNo - size;
			}
			pagination.limit = size;
			pagination.offset = offset;
			pagination.pageNo = pageNo;
		}
		pagination.order = [['id', 'DESC']]
		// console.log('pagination=>', pagination);
		// console.log('transactionWhere=>', transactionWhere);


		let transactions = await FinancialAccountTransaction.findAll({
			where: transactionWhere,
			// attributes: [],
			...pagination,
			// include: {
			// 	model: Payment,
			// 	as: 'payment',
			// }
		})
		// console.log(transactions)
		return res.send({
			data: transactions
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.getStatementDetail = async function (req, res) {
	try {
		let size = req.query.size ? Number(req.query.size) : 10;
		let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;

		// console.log(startDate, endDate)
		let transactionWhere = { transactionOf: "payroll" };

		let offset = 0;

		let pagination = {};
		if (!Number.isNaN(size)) {
			if (pageNo > 1) {
				offset = size * pageNo - size;
			}
			pagination.limit = size;
			pagination.offset = offset;
			pagination.pageNo = pageNo;
		}

		if (req.user.roles[0].roleName === 'admin') {
			transactionWhere.userId = req.query.userId;
		} else {
			transactionWhere.userId = req.user.id;
		}

		pagination.order = [['id', 'DESC']]
		// console.log('pagination=>', pagination);
		// console.log('transactionWhere=>', transactionWhere);


		let transactions = await FinancialAccountTransaction.findAll({
			where: {
				...transactionWhere
			},
			...pagination,
		})
		// console.log(transactions)
		return res.send({
			data: transactions
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}
