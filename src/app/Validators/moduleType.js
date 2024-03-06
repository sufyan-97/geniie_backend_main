const { check, body, param, query } = require('express-validator');

exports.getOne = [
    param('id')
        .notEmpty()
        .isInt(),
];

exports.post = [
    body('type')
        .notEmpty()
        .isString()
];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),
    body('type')
        .notEmpty()
        .isString()
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];

