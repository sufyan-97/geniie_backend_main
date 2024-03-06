const { check, body, param, query } = require('express-validator');

exports.paypalSuccessPayment = [
    query('paymentId')
        .notEmpty()
        .isString()
];

exports.paypalCancelPayment = [

]

exports.paypalOrderSuccess = [
    query('paymentId')
        .notEmpty()
        .isString()
];

exports.paypalOrderCancel = [
    
]