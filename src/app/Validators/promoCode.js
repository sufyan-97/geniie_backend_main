const { check, body, param, query } = require('express-validator');
const PromoCode = require('../SqlModels/PromoCode');

exports.post = [

    check('promoCode').notEmpty().isString().bail().custom((val) => {

        return PromoCode.findOne({
            where: {
                promoCode: val,
                deleteStatus: false
            },
            attributes: ['deleteStatus']
        }).then(el => {
            if (el) {
                return Promise.reject("promoCode already exist")
            }
        })
    }),

    body('type')
        .isIn(["flat", "percentage"]),

    body('name').optional().isString(),
    body('discount').optional().isString(),
    // body('countryId').optional().isString(),
    // body('stateIds').optional(),
    // body('cityIds').optional(),
    // body('allowedRegion').optional().isObject(),
    body('allowedRegion.countryId').optional().isString(),
    body('allowedRegion.stateIds').optional().isArray(),
    body('allowedRegion.cityIds').optional().isArray(),

    body('maxUseLimit')
        .notEmpty()
        .isInt(),

    body('userMaxUseLimit')
        .notEmpty()
        .isInt(),

    body('minOrderLimit')
        .notEmpty()
        .isDecimal(),

    body('maxDiscount')
        .notEmpty()
        .isDecimal(),

    body('expiryDate')
        .optional()
        .isDate(),
]
    ;
exports.apply = [
    body('promoCode')
        .notEmpty()
        .isString(),
];

exports.update = [
    body('id')
        .notEmpty()
        .isInt(),

    body('name')
        .notEmpty()
        .isString(),

    body('discount')
        .notEmpty()
        .isInt(),

    body('promoCode')
        .notEmpty()
        .isString(),

    body('type')
        .isIn(["flat", "percentage"]),

    body('maxUseLimit')
        .notEmpty()
        .isInt(),

    body('userMaxUseLimit')
        .notEmpty()
        .isInt(),

    body('minOrderLimit')
        .notEmpty()
        .isDecimal(),

    body('maxDiscount')
        .notEmpty()
        .isDecimal(),

    body('allowedRegion.countryId')
        .optional()
        .isString(),

    body('allowedRegion.stateIds')
        .optional()
        .isArray(),

    body('allowedRegion.cityIds')
        .optional()
        .isArray(),

    body('expiryDate')
        .optional()
        .isDate(),
];

exports.getOne = [
    param('id')
        .notEmpty()
        .isInt(),
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];

