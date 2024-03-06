const { body, param } = require('express-validator');

exports.post = [
    body('businessName').notEmpty().isString(),
    body('serviceDetails').notEmpty().isString(),
    body('serviceId').notEmpty().isInt(),
    body('address').notEmpty().isString(),
    body('cityId').notEmpty().isInt(),
    body('countryId').notEmpty().isInt(),
    body('longitude').optional().isDecimal(),
    body('latitude').optional().isDecimal(),
    body('userServiceId').notEmpty().isInt()
];

exports.update = [
    body('id').notEmpty().isInt(),
    body('businessName').notEmpty().isString(),
    body('serviceDetails').notEmpty().isString(),
    body('serviceId').notEmpty().isInt(),
    body('address').optional().isString(),
    body('cityId').optional().isInt(),
    body('countryId').optional().isInt(),
    body('longitude').optional().isString(),
    body('latitude').optional().isString(),
    body('userServiceId').optional().isInt(),

];
var params = [
    param('id')
        .notEmpty()
        .isString(),
];
exports.getOne = params;

exports.delete = params;