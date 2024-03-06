// Libraries
const { check, body, param, query, matchedData, header } = require("express-validator");
const { phone } = require("phone");

const yup = require('yup')


exports.getTill = [];


const personalInformationSchema = yup.object().shape({
	firstName: yup.string().notRequired(),
	lastName: yup.string().notRequired(),
	dob: yup.string().notRequired(),
	emailAddress: yup.string().notRequired(),
	phoneNumber: yup.string().notRequired(),
})

const aboutYourRestaurantSchema = yup.object().shape({
	restaurantName: yup.string().notRequired(),
	companyName: yup.string().notRequired(),
	emailAddress: yup.string().notRequired(),
	phoneNumber: yup.string().notRequired(),
	restaurantLink: yup.string().notRequired(),
	isRestaurantEmailVerified: yup.boolean().notRequired(),
	isRestaurantPhoneNumberVerified: yup.boolean().notRequired(),
})

const foodHygieneInformationSchema = yup.object().shape({
	fsaStatus: yup.string().notRequired(),
	fsaId: yup.string().notRequired(),
	fsaLink: yup.string().notRequired()
})

const restaurantMetaDataSchema = yup.object().shape({
	dashboardCardIds: yup.array().notRequired(),
	serviceCategories: yup.array().notRequired(),
	deliveryRateViaMiles: yup.array().notRequired(),
	deliveryRateViaOrderPrice: yup.array().notRequired(),
	serviceCategories: yup.array().notRequired(),
	sittingCapacity: yup.string().notRequired(),
	specialInstructions: yup.string().notRequired(),
	deliveryTime: yup.string().notRequired(),
	deliveryCharges: yup.string().notRequired(),
	deliveryRadius: yup.string().notRequired(),
	minDeliveryOrderPrice: yup.string().notRequired(),
	deliveryRatePerMile: yup.string().notRequired(),
	currency: yup.string().notRequired(),
	currencySymbol: yup.string().notRequired(),
	restaurantOnboardAgreement: yup.boolean().notRequired(),
	isVat: yup.boolean().notRequired(),
	vatNumber: yup.string().notRequired(),
	vat: yup.string().notRequired(),
	cityId: yup.string().notRequired(),
	address: yup.string().notRequired(),
	latitude: yup.string().notRequired(),
	longitude: yup.string().notRequired(),
	postcode: yup.string().notRequired(),
	deliveryOption: yup.string().notRequired(),
	branchOwnRiders: yup.boolean().notRequired(),
	branchOwnRidersCod: yup.boolean().notRequired(),
})

const restaurantTimingsSchema = yup.object().shape({
	timing: yup.string().test({}, function (value) {
		try {
			let timing = JSON.parse(value)
			return yup.array().of(yup.object().shape({
				day: yup.string().required(),
				laps: yup.array().of(yup.object().shape({
					startTime: yup.string().required(),
					endTime: yup.string().required()
				}))

			})).validateSync(timing)
		} catch (error) {
			console.log('error', error)
			return false
		}
	}).notRequired()
})

const businessMediaSchema = yup.object().shape({
	license: yup.string().notRequired(),
	menu: yup.string().notRequired(),
	alcoholLicense: yup.string().notRequired(),
	logo: yup.string().notRequired(),
	photoId: yup.string().notRequired(),
	proofOfOwnership: yup.string().notRequired(),
	banner: yup.string().notRequired(),
})

const validateMediaSchema = function (value) {
	try {
		if (!value) {
			return true
		}
		let media = JSON.parse(value)
		return yup.array().of(
			yup.object().shape({
				path: yup.string().required(),
				expiryDate: yup.string().notRequired()
			})
		).validateSync(media)
	} catch (error) {
		console.log('error', error)
		return false
	}
}

const mediaSchema = yup.object().shape({
	license: yup.string().notRequired().test({}, validateMediaSchema),
	menu: yup.string().notRequired().test({}, validateMediaSchema),
	alcoholLicense: yup.string().notRequired().test({}, validateMediaSchema),
	logo: yup.string().notRequired().test({}, validateMediaSchema),
	photoId: yup.string().notRequired().test({}, validateMediaSchema),
	proofOfOwnership: yup.string().notRequired().test({}, validateMediaSchema),
	banner: yup.string().notRequired().test({}, validateMediaSchema),
})

const bankSchema = yup.object().shape({
	name: yup.string().notRequired(),
	holderName: yup.string().notRequired(),
	accountNumber: yup.string().notRequired(),
	sortCode: yup.string().notRequired(),
	cityId: yup.string().notRequired(),
	billingAddress: yup.string().notRequired(),
	postcode: yup.string().notRequired(),
})

const rejectedFieldsSchema = yup.array().of(yup.object().shape({
	key: yup.string().required(),
	reason: yup.string().required(),
	type: yup.string().required(),
	value: yup.string().nullable().notRequired()
}))

exports.saveTill = [
	body('personalInformation').custom((values) => personalInformationSchema.validateSync(values)).optional(),
	body('aboutYourRestaurant').custom((values) => aboutYourRestaurantSchema.validateSync(values)).optional(),
	body('foodHygieneInformation').custom((values) => foodHygieneInformationSchema.validateSync(values)).optional(),
	body('restaurantMetadata').custom((values) => restaurantMetaDataSchema.validateSync(values)).optional(),

	body("restaurantTimings").custom((values) => restaurantTimingsSchema.validateSync(values)).optional(),

	body("businessMedia").custom((values) => businessMediaSchema.validateSync(values)).optional(),

	body("media").custom((values) => mediaSchema.validateSync(values)).optional(),

	body("bank").custom((values) => bankSchema.validateSync(values)).optional(),

	body('rejectedFields').custom((values) => {
		try {
			let rejectedFields = JSON.parse(values)
			return rejectedFieldsSchema.validateSync(rejectedFields)
		} catch (error) {

			return false
		}
	}).optional(),

	body("pageNo").isNumeric(),
	body("finalPage").isBoolean().optional(),
	body("menuLink").optional().isString(),
]

exports.saveProvider = [
	body("user.firstName").notEmpty().isString(),
	body("user.lastName").notEmpty().isString(),
	body("user.email").notEmpty().isEmail(),
	body("user.countryCode").notEmpty().isString(),
	body("user.phoneNumber")
		.notEmpty()
		.customSanitizer((value, { req }) => {
			console.log('value', value);
			value = `${value}`
			try {
				let countryCode = `${req.body.user.countryCode}`;
				if (!countryCode) {
					return false;
				}
				let phoneNumber = `${countryCode}${value}`;
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
		})
		.isString(),

	// body("business.businessName").notEmpty().isString(),
	body("business.serviceId").notEmpty().isInt(),

	body("location.address").notEmpty().isString(),
	body("location.cityId").notEmpty().isInt(),
	body("location.countryId").notEmpty().isInt(),
	body("location.latitude").notEmpty().isDecimal(),
	body("location.longitude").notEmpty().isDecimal(),
	body("location.postCode").notEmpty().isString(),
];

exports.saveRider = [
	body("user.firstName").notEmpty().isString(),
	body("user.lastName").notEmpty().isString(),
	body("user.email").notEmpty().isEmail(),
	body("user.countryCode").notEmpty().isString(),

	body("user.phoneNumber")
		.notEmpty()
		.customSanitizer((value, { req }) => {
			console.log('values', value);
			try {
				let countryCode = `${req.body.user.countryCode}`;
				if (!countryCode) {
					return false;
				}
				let phoneNumber = `${countryCode}${value}`;
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
		})
		.isString(),

	body("location.address").notEmpty().isString(),
	body("location.cityId").notEmpty().isInt(),
	body("location.countryId").notEmpty().isInt(),
	body("location.latitude").notEmpty().isDecimal(),
	body("location.longitude").notEmpty().isDecimal(),
	body("location.postCode").notEmpty().isString(),
];

exports.saveRiderTill = [
	body("personalInformation.firstName").optional().isString(),
	body("personalInformation.lastName").optional().isString(),
	body("personalInformation.emailAddress").optional().isEmail(),
	body("personalInformation.phoneNumber").optional().isString(),
	body("personalInformation.genderId").optional().isString(),
	body("personalInformation.language").optional().isString(),
	body("personalInformation.dob").optional().isString(),
	body("personalInformation.branchName").optional().isString(),

	body("personalInformation.postcode").optional().isString(),
	body("personalInformation.termsAndConditionsAccepted").optional().isBoolean(),


	body("location.address").notEmpty().isString().optional(),
	body("location.latitude").notEmpty().isString().optional(),
	body("location.longitude").notEmpty().isString().optional(),
	body("location.cityId").notEmpty().isInt().optional(),
	body("location.countryId").notEmpty().isInt().optional(),
	body("location.postCode").notEmpty().isString().optional(),
	// body("location.stateId").notEmpty().isInt().optional(),

	body("pageNo").isNumeric(),
	body("finalPage").isBoolean().optional(),
	body("isBranchRider").isBoolean().optional(),

	body("vehicleInformation.type").optional().isString(),
	body("vehicleInformation.criminalCheckAllowed").optional().isBoolean(),
	body("vehicleInformation.agreedCriminalCheck").optional().isString(),
	body("vehicleInformation.licenseNumber").optional().isString(),
	body("vehicleInformation.manufacturer").optional().isString(),
	body("vehicleInformation.year").optional().isString(),
	body("vehicleInformation.licensePlate").optional().isString(),
	body("vehicleInformation.color").optional().isString(),
	body("vehicleInformation.isValidPHL").optional().isString(),
	body("vehicleInformation.PHLNumber").optional().isString(),

	// body("generalInformation.heardAboutUs").optional().isString(),
	body("generalInformation.isDeliveryBagAvailable").optional().isBoolean(),
	body("generalInformation.isBuyKit").optional().isBoolean(),
	body("generalInformation.emergencyContactName").optional().isString(),
	body("generalInformation.emergencyPhoneNumber").optional().isString(),
	body("generalInformation.heardAboutUs").optional().isString(),

	body("riderMedia.profileImage").optional().isString(),
	body("riderMedia.license").optional().isString(),
	body("riderMedia.motorLicense").optional().isString(),
	body("riderMedia.photoId").optional().isString(),
	body("riderMedia.nationalId").optional().isString(),
	body("riderMedia.criminalCheck").optional().isString(),
	body("riderMedia.bagPhoto").optional().isString(),
	body("riderMedia.bankStatement").optional().isString(),

	body("bank.name").optional().isString(),
	body("bank.holderName").optional().isString(),
	body("bank.accountNumber").optional().isString(),
	body("bank.sortCode").optional().isString(),
	body("bank.cityId").optional().isString(),
	body("bank.countryId").optional().isString(),
	body("bank.street").optional().isString(),
	body("bank.postcode").optional().isString(),
	body("bank.postCode").optional().isString(),

	body('rejectedFields').custom((values) => {
		try {
			let rejectedFields = JSON.parse(values)
			return rejectedFieldsSchema.validateSync(rejectedFields)
		} catch (error) {

			return false
		}
	}).optional(),
];

exports.approveBusiness = [];

var updateRejectionRequest = [
	body('id')
		.notEmpty()
		.isInt(),

	body('rejectedFields')
		.isArray(),
];

exports.updateBusinessDocumentExpiry = [
	header('timezone')
		.notEmpty()
		.isString(),

	body('userId')
		.notEmpty()
		.isInt(),

	body('dataType')
		.optional()
		.isString()
		.isIn(['business', 'restaurant', 'rider']),

	body('dataId')
		.optional()
		.isInt(),

	body('serviceDetails')
		.optional()
		.isString(),

	body('path')
		.notEmpty()
		.isString(),

	body('key')
		.notEmpty()
		.isString(),

	body('expiryDate')
		.notEmpty()
		.isString(),
]

exports.updateBusinessRequestRejection = updateRejectionRequest;
exports.updateRegistrationRejection = updateRejectionRequest;