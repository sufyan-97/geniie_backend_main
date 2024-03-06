const { check, body, param, query } = require('express-validator');

exports.get = [
    query('appName')
        .notEmpty()
        .isString()
        .optional(),
];

exports.getOne = [
    param('id')
        .notEmpty()
        .isString(),
];

exports.post = [
    body('name')
        .notEmpty()
        .isString(),

    body('isActive')
        .notEmpty()
        .isBoolean()
        .optional(),

    query('appName')
        .notEmpty()
        .isString()
        .optional(),
];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),

    body('name')
        .notEmpty()
        .isString()
        .optional(),

    body('isActive')
        .notEmpty()
        .isBoolean()
        .optional(),
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];