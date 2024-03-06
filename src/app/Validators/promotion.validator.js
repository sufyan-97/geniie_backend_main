const { check, body, param, query, header } = require('express-validator');
// const PromoCode = require('../SqlModels/PromoCode');

exports.getUserSpecificPromotions = [
	query('serviceSlug')
		.notEmpty()
		.isString()
]

exports.create = [

	header('timezone')
		.notEmpty()
		.isString(),

	body('title')
		.notEmpty()
		.isString(),

	body('coverImage')
		.notEmpty()
		.optional()
		.isString(),

	body('heading')
		.notEmpty()
		.isString(),

	body('serviceId').notEmpty().isNumeric(),

	body('categoryIds').notEmpty().isArray(),

	body('termIds').notEmpty().isArray(),

	body('discountType')
		.isIn(["flat", "percentage"]),

	body('discountValue')
		.notEmpty()
		.isInt(),

	body('startDate')
		.notEmpty()
		.isString(),

	body('endDate')
		.notEmpty()
		.isString(),

	// body('status')
	// 	.notEmpty()
	// 	.isString(),

	body('area')
		.isString()
		.notEmpty()
		.isIn(["all", "specific"]),

	body('allowedRegion.countryId')
		.isInt()
		.optional()
		.notEmpty(),

	// body('allowedRegion.stateIds')
	// 	.isArray()
	// 	.optional()
	// 	.notEmpty(),

	body('allowedRegion.cityIds')
		.isArray()
		.optional()
		.notEmpty(),
]

exports.update = [

	header('timezone')
		.notEmpty()
		.isString(),

	body('id')
		.notEmpty()
		.isInt(),

	body('title')
		.notEmpty()
		.isString(),

	body('coverImage')
		.notEmpty()
		.optional()
		.isString(),

	body('heading')
		.notEmpty()
		.isString(),

	body('serviceId').notEmpty().isNumeric(),

	body('categoryIds').notEmpty().isArray(),

	body('termIds').notEmpty().isArray(),

	body('discountType')
		.isIn(["flat", "percentage"]),

	body('discountValue')
		.notEmpty()
		.isInt(),

	body('startDate')
		.notEmpty()
		.isString(),

	body('endDate')
		.notEmpty()
		.isString(),

	// body('status')
	// 	.notEmpty()
	// 	.isString(),

	body('area')
		.isString()
		.notEmpty()
		.isIn(["all", "specific"]),

	body('allowedRegion.countryId')
		.isInt()
		.optional()
		.notEmpty(),

	// body('allowedRegion.stateIds')
	// 	.isArray()
	// 	.optional()
	// 	.notEmpty(),

	body('allowedRegion.cityIds')
		.isArray()
		.optional()
		.notEmpty(),
]

var params = [
	param('id').notEmpty().isInt(),
];
exports.delete = params;
exports.getOne = params;

exports.availability = [
	body('id')
		.notEmpty()
		.isInt(),

	body('status')
		.notEmpty()
		.isBoolean(),
]