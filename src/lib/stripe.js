
const constants = require('../../config/constants');

exports.stripe = require("stripe")(constants.STRIPE_SECRET_KEY);