const { check, body, param, query, header } = require('express-validator');
const yup = require('yup')


//***************** Languages User Validators **********************//

exports.getLanguageFile = [
    header('language')
        .notEmpty()
		.isString(),

	query('app')
		.notEmpty()
		.isString()
		.optional()
]

//***************** Languages Admin Validators **********************//

exports.addLanguage = [
    body('name')
        .notEmpty()
        .isString(),
    body('languageCode')
        .notEmpty()
        .isString()
];


exports.updateLanguage = [
    param('id')
        .notEmpty()
        .isString(),

    body('name')
        .notEmpty()
        .isString(),

    body('languageCode')
        .notEmpty()
        .isString()
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];

exports.getKeys = [

]

exports.getKeyValues = [
    query('lngKey')
        .notEmpty()
        .isString()
]

// deprecated
exports.createKey = [
    body('lngId')
        .notEmpty()
        .isNumeric(),

    body('lngKey')
        .notEmpty()
        .isString(),

    body('lngValue')
        .notEmpty()
        .isString()
]


const keysSchema = yup.array().of(
	yup.object().shape({
		lngCode: yup.string().required(),
		lngValue: yup.string().required()
	})
)
exports.createKeys = [
    body('lngKey')
        .notEmpty()
		.isString(),
	body('app')
		.notEmpty()
		.optional(),
	body('lngValues').custom(value => keysSchema.isValidSync(value))
]

exports.deleteKeys = [
    query('lngKey')
        .notEmpty()
        .isString()
]

