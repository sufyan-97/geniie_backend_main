const { check, body, param, query } = require('express-validator');

exports.post = [

    query('app')
        .notEmpty()
        .isIn(['asaap', 'asaap-restaurant', 'rider']),

    body('type')
        .notEmpty()
        .isIn(['user', 'general']),

    body('subject')
        .notEmpty()
        .isString(),

    body('description')
        .notEmpty()
        .isString(),

    body('userIds')
        .notEmpty()
        .isArray().optional(),

    check('userIds.*')
        .notEmpty()
        .isInt(),
];

exports.getOne = [

    query('app')
        .notEmpty()
        .isIn(['asaap', 'asaap-restaurant', 'rider']),

    param('id')
        .notEmpty()
        .isString(),
];

exports.delete = [

    query('app')
        .notEmpty()
        .isIn(['asaap', 'asaap-restaurant', 'rider']),

    param('id')
        .notEmpty()
        .isInt(),
];
