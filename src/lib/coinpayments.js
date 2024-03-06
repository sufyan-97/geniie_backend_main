const coinPayments = require('coinpayments');
const constants = require('../../config/constants');

let credentials = {
	key: constants.COIN_PAYMENTS_KEY,
	secret: constants.COIN_PAYMENTS_SECRET
}
exports.coinPaymentsClient = new coinPayments(credentials)