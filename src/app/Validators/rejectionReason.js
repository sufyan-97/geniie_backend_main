const { check, body, param, query } = require('express-validator');

exports.getAll = [
    query('moduleType').optional().isString().notEmpty(),
];

exports.post = [
    body('text').notEmpty().isString(),
    body('module_types').notEmpty().isArray()
];

exports.update = [
    body('id').notEmpty().isInt(),
    body('text').notEmpty().isString(),
    body('module_types').notEmpty().isArray()
    // body('module').optional().isString()
];
var params = [
    param('id').notEmpty().isInt(),
];
exports.delete = params;
exports.getOne = params;