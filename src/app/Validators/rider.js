const { check, body, param, query } = require('express-validator');
const User = require("../SqlModels/User")
const Role = require("../SqlModels/Role")

exports.getOne = [
    check('id').notEmpty().isInt().bail().custom(val => {

        return User.findOne({
            where: { 'id': val },
            attributes: ['id'],

            include: [{
                model: Role,
                attributes: ['id', "roleName"]
            }]
        }).then(item => {
            if (item) {
                if (item.roles[0] && item.roles[0].roleName == 'rider') {
                    // return Promise.reject ("yes its rider");
                } else {
                    return Promise.reject("user is not a rider")
                }
            } else {
                return Promise.reject("Not a user")
            }
        })

    }),
];
