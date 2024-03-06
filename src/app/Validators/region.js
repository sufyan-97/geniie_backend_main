// Library
const { check, body, param } = require('express-validator');
const { phone } = require('phone');


exports.addCountry = [
    body('ids')
        .notEmpty()
        .isArray(),

    body('status')
        .notEmpty()
        .isBoolean()
]

exports.addCountryState = [
    body('ids')
        .notEmpty()
		.isArray(),

    body('status')
        .notEmpty()
        .isBoolean(),

    param('countryId')
        .notEmpty()
        .isInt(),
]

exports.addCountryStateCities = [
    body('ids')
        .notEmpty()
        .isArray(),

    body('status')
        .notEmpty()
        .isBoolean(),

    param('countryId')
        .notEmpty()
        .isInt(),

    param('stateId')
        .notEmpty()
        .isInt(),
]
