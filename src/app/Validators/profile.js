// Library
const { check, body, param, query, oneOf } = require('express-validator');
const { phone } = require('phone');
const yup = require('yup')

exports.checkAcl = [
	// body('componentName')
	// 	.notEmpty()
	// 	.isString(),
	// body('componentUri')
	// 	.notEmpty()
	// 	.isString()
]

exports.updatePassword = [
	body('currentPassword')
		// .notEmpty()
		.isString()
		.optional(),
	body('newPassword')
		.notEmpty()
		.isString(),
];





exports.getProfileImage = [

]

exports.removeProfileImage = [

];

exports.changeEmail = [
	body('email').isEmail()
]

exports.updateProfile = [
	body('username')
		.notEmpty()
		.optional(),
	body('dob')
		.isDate({ format: 'YYYY-MM-dd' })
		.optional(),
	body('gender')
		.notEmpty()
		.optional(),

	body('genderId')
		.notEmpty()
		.optional(),

	body('fullName')
		.notEmpty()
		.optional(),

	body('postCode')
		.notEmpty()
		.isString()
		.optional(),

	body('cityId')
		.notEmpty()
		.isInt()
		.optional(),

	body('countryId')
		.notEmpty()
		.isInt()
		.optional(),

	body('address')
		.notEmpty()
		.isString()
		.optional(),

	body('latitude')
		.notEmpty()
		.isDecimal()
		.optional(),

	body('longitude')
		.notEmpty()
		.isDecimal()
		.optional()

]


exports.updatePhoneNumber = [
	body('countryCode').notEmpty().isString(),

	body('number').notEmpty().customSanitizer((value, { req }) => {
		try {

			let countryCode = req.body.countryCode;
			if (!countryCode) {
				return false
			}
			let phoneNumber = `${countryCode}${value}`
			console.log('countryCode:', phoneNumber);

			let phoneNumberValidation = phone(phoneNumber, {
				// country: ''
				validateMobilePrefix: false,
				strictDetection: false
			});
			if (!phoneNumberValidation || !phoneNumberValidation.isValid) {
				return false
			}
			return value
		} catch (error) {
			console.log(error)
			return false
		}

	}).isString()
]
exports.updateUserPhoneNumber = [
	body('countryCode').notEmpty().isString(),

	body('number').notEmpty().customSanitizer((value, { req }) => {
		try {

			let countryCode = req.body.countryCode;
			if (!countryCode) {
				return false
			}
			let phoneNumber = `${countryCode}${value}`
			console.log('countryCode:', phoneNumber);

			let phoneNumberValidation = phone(phoneNumber, {
				// country: ''
				validateMobilePrefix: false,
				strictDetection: false
			});
			if (!phoneNumberValidation || !phoneNumberValidation.isValid) {
				return false
			}
			return value
		} catch (error) {
			console.log(error)
			return false
		}

	}).isString()
]

exports.updateVehicleInformation = [
	body('type')
		.isString()
		.notEmpty()
		.optional()
]

exports.updateDocument = [

]
exports.verifyPhoneNumber = [
	body('otpCode')
		.notEmpty()
		.isNumeric()
]
exports.verifyEmailAlreadyExistOrNot = [
	body('email')
		.notEmpty()
		.isString()
]
exports.verifyPhoneNumberAlreadyExistOrNot = [
	body('phoneNumber')
		.notEmpty()
		.isString()
]


const bankSchema = yup.object().shape({
	name: yup.string().required(),
	holderName: yup.string().required(),
	accountNumber: yup.string().required(),
	sortCode: yup.string().required(),
	billingAddress: yup.string().required(),
	postCode: yup.string().required(),
	cityId: yup.string().required(),
	countryId: yup.string().notRequired(),
})

exports.bankDetails = [
	body("").custom((values) => bankSchema.validateSync(values))
]

exports.forceLogoutUser = [
	body('userId')
		.notEmpty()
		.isInt()
]