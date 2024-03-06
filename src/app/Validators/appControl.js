const { check, body, param, query } = require('express-validator');

exports.post = [
    body('key')
        .notEmpty()
        .isString(),

    body('value')
        .notEmpty()
        .isString(),

    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'rider', 'user']),
];

exports.update = [

    body('key')
        .notEmpty()
        .isString(),

    body('value')
        .notEmpty()
        .isString(),

    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'rider', 'user']),

];

exports.getAll = [

    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'rider', 'user']),
];

exports.getOne = [
    param('key')
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
