const { check, body, param, query } = require('express-validator');
const { default: phone } = require('phone');

exports.signup = [
	body('username')
		.notEmpty()
		.matches(`^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$`),

	body('email')
		.isEmail(),

	body('password')
		.notEmpty()
		.isString(),

	body('deviceId')
		.optional()
		.isString(),

	body('role')
		.optional()
		.isString()
		.not()
		.isIn(['admin'])
	,

	body('longitude')
		.optional()
		.isDecimal(),

	body('latitude')
		.optional()
		.isDecimal(),
];

exports.adminSignUp = [
	body('username')
		.notEmpty()
		.matches(`^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$`),

	body('email')
		.isEmail(),

	body('password')
		.notEmpty()
		.isString()
];

exports.verify = [
	query('token')
		.notEmpty().isString()
];

exports.forgotPassword = [
	body('email')
		.isEmail(),

	body('roleName')
		.notEmpty()
		.isString()
		.optional()
];

exports.getResetPasswordView = [
	query('token')
		.notEmpty()
		.isString()
]

exports.passwordChangedView = [

]

exports.saveResetPassword = [
	query('token')
		.notEmpty()
		.isString(),

	body('password')
		.notEmpty()
		.isString()
];

exports.login = [
	body('username')
		.notEmpty()
		// .isString()
		.custom(value => {
			let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			let usernameRegex = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
			let phoneNumberRegex = /^[+0-9]+$/
			if (!emailRegex.test(value) && !usernameRegex.test(value) && !phoneNumberRegex.test(value)) {
				return Promise.reject();
			} else {
				if (phoneNumberRegex.test(value)) {

					try {

						let phoneNumber = `${value}`;
						// console.log('countryCode:', phoneNumber);

						let phoneNumberValidation = phone(phoneNumber, {
							// country: ''
							validateMobilePrefix: false,
							strictDetection: false
						});
						console.log('phoneNumberValidation', phoneNumberValidation);
						if (!phoneNumberValidation || !phoneNumberValidation.isValid) {
							return false;
						}
						return phoneNumber;
					} catch (error) {
						console.log(error);
						return false;
					}

				} else {
					return Promise.resolve()
				}
			}
		}),
	body('password')
		.notEmpty()
		.isString(),
	body('role')
		.isString()
		.optional()
];

exports.adminLogin = [
	body('username')
		.notEmpty()
		.isString()
		.custom(value => {
			let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			let usernameRegex = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
			if (!emailRegex.test(value) && !usernameRegex.test(value)) {
				console.log("asdasdas");
				return Promise.reject();
			} else {
				return Promise.resolve()
			}
		}),
	body('password')
		.notEmpty()
		.isString()
];

exports.refreshToken = [
	query('accessToken').notEmpty(),
	query('refreshToken').notEmpty()
];