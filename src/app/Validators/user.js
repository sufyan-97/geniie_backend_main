const { phone } = require("phone");
const { check, body, param, query } = require('express-validator');



exports.changePassword = [
	body('userId')
		.notEmpty()
		.isInt(),
	body('password')
		.notEmpty()
		.isString(),
];


exports.balanceLimit = [
	body('userId')
		.notEmpty()
		.isInt(),

	body('balanceLimit')
		.notEmpty()
		.isInt()
]

exports.createAgent = [
	body('email')
		.notEmpty()
		.isString(),

	body('phoneNumber')
		.notEmpty()
		.isString(),

	body('role')
		.notEmpty()
		.isString(),
]

exports.getRestaurantRiders = [
	query('userId')
		.isInt()
		.optional()
		.notEmpty(),
]

exports.suspend = [
	body('userId')
		.notEmpty()
		.isInt(),

	body('role')
		.notEmpty()
		.isString(),

	body('reason')
		.optional()
		.notEmpty()
		.isString(),
]

exports.updateRiderPrice = [
	body('price')
		.notEmpty()
		.isDecimal(),
]

exports.saveRestaurantRider = [
	body("restaurantId").notEmpty().isInt(),
	body("user.email").notEmpty().isEmail(),
	body("user.countryCode").notEmpty().isString(),
	body("user.phoneNumber")
		.notEmpty()
		.customSanitizer((value, { req }) => {
			try {
				let countryCode = `${req.body.user.countryCode}`;
				if (!countryCode) {
					return false;
				}
				let phoneNumber = `${countryCode}${value}`;

				let phoneNumberValidation = phone('+441234657891', {
					validateMobilePrefix: false,
					strictDetection: false
				});
				if (!phoneNumberValidation || !phoneNumberValidation.isValid) {
					return false;
				}
				return phoneNumber;
			} catch (error) {
				return false;
			}
		})
		.isString(),
];