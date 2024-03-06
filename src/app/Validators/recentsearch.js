const { check, body, param, query } = require('express-validator');

exports.post = [
    body().isArray(),

    body('*.key')
        .notEmpty()
        .isString(),
    body('*.location').optional().isString()
];

exports.delete = [
    param('id')
        .notEmpty()
        .isString(),
];

