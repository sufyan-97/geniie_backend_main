const { check, body, param, query } = require('express-validator');

exports.create = [
	body('detail')
		.notEmpty()
		.isString(),
]

exports.update = [
	body('id')
		.notEmpty()
		.isInt(),

	body('detail')
		.notEmpty()
		.isString(),
]

var params = [
	param('id').notEmpty().isInt(),
];
exports.delete = params;
exports.getOne = params;