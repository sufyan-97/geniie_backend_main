const { check, body, param, query } = require('express-validator');

exports.saveMessage = [
	body('fullName')
		.notEmpty()
		.isString(),

	body('email')
		.notEmpty()
		.isEmail(),

	body('message')
		.notEmpty()
		.isString()
]
exports.subscribe = [

	body('email')
		.notEmpty()
		.isEmail()
];

exports.deleteSubscribe = [

	param('id')
		.notEmpty()
		.isInt()
];

exports.messageToSubscriber = [

	body('message')
		.notEmpty()
		.isString()
];

exports.unsubscribe = [
	query('email')
		.notEmpty()
		.isEmail()
]