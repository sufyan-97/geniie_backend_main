const { check, body, param, query } = require('express-validator');

exports.post = [
    body('endPoint')
        .notEmpty()
        .isString(),

    body('request_method')
        .notEmpty()
        .isString(),

    body('login_required')
        .notEmpty()
        .isBoolean(),
];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),
    body('endPoint')
        .notEmpty()
        .isString(),

    body('request_method')
        .notEmpty()
        .isString(),

    body('login_required')
        .notEmpty()
        .isBoolean(),
];

exports.updatePrivilege = [
    body('id')
        .notEmpty()
        .isInt(),

    body('roleId')
        .notEmpty()
        .isString(),

    body('value')
        .notEmpty()
        .isBoolean(),
];

exports.getOne = [
    param('id')
        .notEmpty()
        .isString(),
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];

