const { check, body, param, query } = require('express-validator');


exports.markAsRead = [

    param('id')
        .notEmpty(),
];
