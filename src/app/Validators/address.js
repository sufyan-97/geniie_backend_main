const { check, body, param, query } = require('express-validator');

exports.post = [
	body('address')
		.notEmpty()
		.isString(),

	body('longitude')
		.notEmpty()
		.isDecimal(),

	body('latitude')
		.notEmpty()
		.isDecimal(),

	body('addressLabelId')
		.notEmpty()
		.isInt(),

	body('addressLabelName')
		.notEmpty()
		.isString(),

	body('postCode')
		.notEmpty()
		.isString(),
];

exports.update = [
	body('id')
		.notEmpty()
		.isInt(),

	body('address')
		.notEmpty()
		.isString(),

	body('longitude')
		.notEmpty()
		.isDecimal(),

	body('latitude')
		.notEmpty()
		.isDecimal(),

	body('addressLabelId')
		.notEmpty()
		.isInt(),

	body('addressLabelName')
		.notEmpty()
		.isString(),
];

exports.getOne = [
	param('id')
		.notEmpty()
		.isString(),
];

exports.delete = [
	param('id')
		.notEmpty()
		.isInt(),
];

exports.updateActiveAddress = [
	param('id')
		.notEmpty()
		.isInt(),
];
