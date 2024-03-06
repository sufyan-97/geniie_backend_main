const { check, body, param, query } = require('express-validator');

exports.post = [
    body('name')
        .notEmpty()
        .isString(),

    // body('image')
    //     .notEmpty(),
    // // .isString(),

    // body('arrowImage')
    //     .notEmpty(),
    // // .isString(),

    body('isWebView')
        .optional()
        .notEmpty()
        .isBoolean(),

    body('login_required')
        .optional()
        .notEmpty()
        .isBoolean(),

    body('isActive')
        .optional()
        .notEmpty()
        .isBoolean(),

    query('app')
        .notEmpty()
        .isString(),
];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),

    body('name')
        .notEmpty()
        .isString(),

    // body('image')
    //     .notEmpty(),

    // body('arrowImage')
    //     .notEmpty(),

    body('isWebView')
        .optional()
        .notEmpty()
        .isBoolean(),

    body('login_required')
        .optional()
        .notEmpty()
        .isBoolean(),

    body('isActive')
        .optional()
        .notEmpty()
        .isBoolean(),

    query('app')
        .notEmpty()
        .isString(),
];

exports.getOne = [
    param('id')
        .notEmpty()
        .isInt(),

    query('app')
        .notEmpty()
        .isString(),
];

exports.getAll = [

    query('app')
        .notEmpty()
        .isString(),
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),

    query('app')
        .notEmpty()
        .isString(),
];