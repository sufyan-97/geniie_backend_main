const { check, body, param } = require('express-validator');
const { Promise } = require('mongoose');
const serviceCategory = require('../SqlModels/ServiceCategory')

var requestBody = [
    check('name').notEmpty().isString().bail().custom(val => {
        return serviceCategory.findOne({ where: { 'name': val } }).then((dt) => {
            if (dt) {
                return Promise.reject('Name already taken')
            }
        })
    }),
    body('description')
        .notEmpty()
        .isString(),
    body('isMultiple')
        .notEmpty()
        .isBoolean(),
    body('serviceId').notEmpty().isInt(),
    body('status')
        .notEmpty()
        .isBoolean(),
];
var requestParams = [
    param('id')
        .notEmpty()
        .isString(),
];

exports.post = requestBody;
exports.update = requestBody;
exports.getOne = requestParams;
exports.delete = requestParams;