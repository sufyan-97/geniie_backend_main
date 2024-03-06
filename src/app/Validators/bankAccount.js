const { check, body, param, query } = require('express-validator');

exports.update = [
    body('name').notEmpty().isString(),
    body("holderName").notEmpty().isString(),
    body("accountNumber").notEmpty().isString(),
    body("sortCode").notEmpty().isString(),
    body("cityId").notEmpty().isInt(),
    body("street").notEmpty().isString(),
    body("postCode").notEmpty().isString(),
    body('id').notEmpty().isInt()
];


