const { body, param } = require('express-validator');

exports.addWaitingList = [
    body('firstName').notEmpty().isString().isLength({ min: 2 }),
    body('lastName').notEmpty().isString().isLength({ min: 2 }),
    body('email').notEmpty().isEmail(),
    body('mobileNumber').notEmpty().isString().isLength({ min: 10, max: 10 }),
    body('whatsappNumber').optional().notEmpty().isString().isLength({ min: 10, max: 10 }),
    body('showUpdates').optional().notEmpty().isBoolean(),
];