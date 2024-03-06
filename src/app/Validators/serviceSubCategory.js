const { check, body, param } = require('express-validator');

var requestBody = [
    body("name").notEmpty().isString(),
    body('description')
        .notEmpty()
        .isString(),
    body('isMultiple')
        .notEmpty()
        .isBoolean(),
    body('serviceCategoryId').notEmpty().isInt(),

    // body('image').notEmpty(),
    body('status')
        .notEmpty()
        .isBoolean(),
];
var requestParams = [
    param('id')
        .notEmpty()
        .isString(),
];

exports.post = requestBody;
exports.update = requestBody;
exports.getOne = requestParams;
exports.delete = requestParams;