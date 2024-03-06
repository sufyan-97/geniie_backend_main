const { check, body, param, query } = require('express-validator');

exports.getAll = [
];

exports.post = [
    // query('app')
    //     .notEmpty()
    //     .isString(),
    //     // .isIn(['restaurant', 'rider', 'user']),

    // body('heading')
    //     .notEmpty()
    //     .isString(),

    // body('details')
    //     .notEmpty()
    //     .isString()
];

// exports.update = [
//     body('id')
//         .notEmpty()
//         .isInt(),
//     query('app')
//         .notEmpty()
//         .isString(),
//         // .isIn(['restaurant', 'rider', 'user']),

//     body('heading')
//         .notEmpty()
//         .isString(),

//     body('details')
//         .notEmpty()
//         .isString()
// ];
exports.save = [
    body('templateName')
        .notEmpty()
        .isString(),

    body('templateData')
        .notEmpty(),

];

exports.update = [

    body('id')
        .notEmpty()
        .isInt(),

    body('templateName')
        .notEmpty()
        .isString(),

    body('templateData')
        .notEmpty(),

];

exports.sendMail = [

    body('email')
        .notEmpty()
        .isString(),

    body('subject')
        .notEmpty()
        .isString(),

    body('htmlData')
        .notEmpty(),

];

exports.getOne = [
    param('id')
        .notEmpty()
        .isString(),

    query('app')
        .notEmpty()
        .isString(),
    // .isIn(['restaurant', 'rider', 'user']),
];

exports.delete = [
    param('id')
        .notEmpty()
        .isInt(),
];
