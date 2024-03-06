const { check, body, param, query, header } = require('express-validator');


exports.getAll = [
]

exports.save = [
    body('openingTimeType')
        .notEmpty()
        .isIn(['minutes', 'hours', 'days', 'weeks', 'rest_of_the_day', 'indefinitely', 'other']).custom((item, { req, location, path }) => {
            try {
                if (item != 'rest_of_the_day' && item != 'indefinitely' && item != 'other' && (!req.body?.openingTime || req.body?.openingTime < 1)) {
                    return Promise.reject('opening time must be greater than 0.');
                } else {
                    return Promise.resolve(item)
                }

            } catch (error) {
                return Promise.reject();
            }
        }),
    body('openingTime')
        .isInt()
        .optional()
]

exports.update = [
]

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
]