const { check, body, param, query } = require('express-validator');

exports.post = [
    body('gender')
        .notEmpty()
        .isString()
];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),
    body('gender')
        .notEmpty()
        .isString()
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];

