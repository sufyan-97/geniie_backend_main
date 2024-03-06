const { check, body, param, query } = require('express-validator');

exports.update = [
    body('languageId')
        .notEmpty()
        .isString()
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];

