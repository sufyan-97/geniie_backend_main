const { check, body, param, query } = require('express-validator');

// libraries
const { Op } = require('sequelize')

const SystemApp = require('../SqlModels/SystemApp');

exports.getAll = [
    // param('fileName')
    //     .notEmpty()
    //     .isString(),
];

exports.create = [
    body('name')
        .notEmpty()
        .isString(),

    body('slug').notEmpty().isString(),//.custom(async (val) => {
    //     const el = await SystemApp.findOne({
    //         where: {
    //             slug: val,
    //             deleteStatus: false
    //         },
    //         attributes: ['id']
    //     });
    //     if (el) {
    //         return Promise.reject("slug already exist")
    //     }
    // }),

    body('packageName')
        .notEmpty()
        .isString(),

    body('fireBaseKey')
        .notEmpty()
        .optional(),

    body('image')
        .notEmpty()
        .optional(),
]

exports.update = [
    body('id')
        .notEmpty()
        .isNumeric(),

    body('name')
        .notEmpty()
        .isString(),

    body('slug').notEmpty().isString(),//.custom((val, { req, location, path }) => {
    //     return SystemApp.findOne({
    //         where: {
    //             slug: val,
    //             deleteStatus: false,
    //             [Op.not]: {
    //                 id: req.body.id
    //             }
    //         },
    //         attributes: ['id']
    //     }).then(el => {
    //         if (el) {
    //             return Promise.reject("slug already exist")
    //         }
    //     })
    // }),

    body('packageName')
        .notEmpty()
        .isString(),

    body('fireBaseKey')
        .notEmpty()
        .optional(),

    body('image')
        .notEmpty()
        .optional(),
]

exports.delete = [
    param('id')
        .notEmpty()
        .isNumeric()
]