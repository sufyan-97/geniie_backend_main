// Libraries
const paypal = require('paypal-rest-sdk');

// constants
const constants = require('../../config/constants');


paypal.configure({
    mode: constants.PAYPAL_MODE, //sandbox or live
    client_id: constants.PAYPAL_CLIENT_ID,
    client_secret: constants.PAYPAL_CLIENT_SECRET
});

// exports.paypal = paypal.pay
module.exports = paypal