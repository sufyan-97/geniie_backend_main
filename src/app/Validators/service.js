const { check, body, param, query } = require('express-validator');

exports.post = [
    body('name')
        .notEmpty()
        .isString(),
        
    body('isActive')
        .notEmpty()
        .isBoolean(),

    body('isFeatured')
        .notEmpty()
        .isBoolean(),
];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),

    body('name')
        .notEmpty()
        .isString(),

    body('slug')
        .notEmpty()
        .isString(),

    body('isActive')
        .notEmpty()
        .isBoolean(),

    body('isFeatured')
        .notEmpty()
        .isBoolean(),
];
var paramId = [
    param('id')
        .notEmpty()
        .isString(),
];


exports.getOne = paramId;

exports.delete = paramId;

