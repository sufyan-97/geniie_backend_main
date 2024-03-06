const { check, body, param, query } = require('express-validator');

// Internal Billing Validators
exports.createTransaction = [
	body('userId')
		.notEmpty()
		.isNumeric(),

	body('paymentId')
		.notEmpty()
		.isNumeric(),

	body('orderId')
		.notEmpty()
		.isNumeric(), // relatedId

	body('businessId')
		.isNumeric(), //serviceId nullable

	// body('invoiceId'), // mandatory

	body('transactionType')
		.notEmpty()
		.isString(),

	body('transactionOf')
		.notEmpty()
		.isString(),

	body('amount')
		.notEmpty()
		.isDecimal(),

];


// External Billing Validators

// ============= Crypto APIs ============= //
exports.getCryptoCoins = []

// ============= Crypto APIs ============= //
exports.getCards = [

]

exports.addCard = [
	body('cardNumber')
		.notEmpty()
		.isNumeric(),

	body('expiryMonth')
		.notEmpty()
		.isString(),

	body('expiryYear')
		.notEmpty()
		.isString(),

	body('cardHolderName')
		.notEmpty()
		.isString(),

	body('cardCvc')
		.notEmpty()
		.isNumeric()

]

exports.deleteCard = [
	query('cardId')
		.notEmpty()
		.isString()
]

exports.switchCard = [
	body('cardId')
		.notEmpty()
		.isString()
]


// ============= General Billing APIs ============= //

exports.switchPaymentMethod = [
	body('paymentMethodId')
		.notEmpty()
		.isString()
]

exports.topUp = [
	body('amount')
		.notEmpty()
		.isDecimal(),

	body('paymentMethodSlug')
		.notEmpty()
		.isString(),
	body('paymentData')
		.isObject()
]

exports.payCashFromWallet = [
	body('cash')
		.notEmpty()
		.isNumeric()
]

exports.getPaymentHistory = [

]


/**
 * paymentMethodSlug
 * amount
 * orderId
 * cardId
 * coinId
 * paymentData
 */
exports.serviceTransaction = [
	body('amount')
		.notEmpty()
		.isDecimal(),

	body('paymentMethodSlug')
		.notEmpty()
		.isString(),

	body('orderId')
		.notEmpty()
		.isNumeric(),

	body('paymentData')
		.isObject()
]