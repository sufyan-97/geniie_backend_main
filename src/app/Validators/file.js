const { check, body, param, query } = require('express-validator');

exports.getOne = [
    param('fileName')
        .notEmpty()
        .isString(),
    query('isBase64')
        .notEmpty()
        .isBoolean()
        .optional()
];

