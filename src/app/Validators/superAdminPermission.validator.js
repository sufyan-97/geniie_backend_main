const { check, body, param, query } = require('express-validator');

exports.post = [
    body('roleId')
        .isInt()
        .notEmpty(),

    body('routePermissions')
        .optional()
        .isArray()
        .notEmpty(),

    body('actionPermissions')
        .isArray()
        .notEmpty(),
];

exports.update = [
];

exports.delete = [
];

