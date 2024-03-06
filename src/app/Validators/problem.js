const { check, body, param, query } = require('express-validator');

exports.post = [
    body('detail')
        .notEmpty()
        .isString()
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];

