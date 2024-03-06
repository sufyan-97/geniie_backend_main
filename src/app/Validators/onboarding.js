const { check, body, param, query } = require('express-validator');

exports.getAll = [
    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'rider', 'user']),
];

exports.post = [
    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'rider', 'user']),

    body('heading')
        .notEmpty()
        .isString(),

    body('details')
        .notEmpty()
        .isString()
];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),
    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'rider', 'user']),

    body('heading')
        .notEmpty()
        .isString(),

    body('details')
        .notEmpty()
        .isString()
];

exports.getOne = [
    param('id')
        .notEmpty()
        .isString(),

    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'rider', 'user']),
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),

    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'rider', 'user']),
];
