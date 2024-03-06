const { check, body, param, query } = require('express-validator');

exports.post = [
    body('key')
        .notEmpty()
        .isString(),

    body('value')
        .notEmpty()
        .isString(),

    body('description')
        .notEmpty()
        .optional()
        .isString(),

    body('isActive')
        .notEmpty()
        .optional()
        .isBoolean(),
];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),

    body('key')
        .notEmpty()
        .isString(),

    body('value')
        .notEmpty()
        .isString(),

    body('description')
        .notEmpty()
        .optional()
        .isString(),

    body('isActive')
        .notEmpty()
        .optional()
        .isBoolean(),
];

exports.getOne = [
    param('key')
        .notEmpty()
        .isString(),
];

exports.getAll = [
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];