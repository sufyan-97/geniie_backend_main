const { check, body, param, query } = require('express-validator');

exports.post = [

    body('heading')
        .notEmpty()
        .isString(),

    body('subHeading')
        .isString().optional(),

    body('detail')
        .isString().optional(),

    body('termAndCondition')
        .isString().optional(),

    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'restaurant_app', 'rider', 'user']),

];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),

    body('heading')
        .notEmpty()
        .isString(),

    body('subHeading')
        .isString().optional(),

    body('detail')
        .isString().optional(),

    body('termAndCondition')
        .isString().optional(),

    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'restaurant_app', 'rider', 'user']),

];

exports.getOne = [
    param('id')
        .notEmpty()
        .isString(),

    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'restaurant_app', 'rider', 'user']),
];
exports.getAll = [

    query('app')
        .notEmpty()
        .isString(),
        // .isIn(['restaurant', 'restaurant_app', 'rider', 'user']),
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
