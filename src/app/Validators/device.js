const { check, body, param, query } = require('express-validator');

exports.getAll = [
    // param('fileName')
    //     .notEmpty()
    //     .isString(),
];

exports.register = [
    body('uuid')
        .notEmpty()
        .isString(),

    body('appSlug')
        .notEmpty()
        .isString(),

    body('serial')
        .notEmpty()
        .isString()
        .optional(),

    body('mac')
        .notEmpty()
        .isString()
        .optional(),

    body('fireBaseDeviceToken')
        .notEmpty()
        .isString()
]

exports.delete = [
    param('id')
        .notEmpty()
        .isNumeric()
]