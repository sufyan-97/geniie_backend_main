
const AclApi = require("../SqlModels/AclApi");
const AclApiToUserRole = require("../SqlModels/AclApiToUserRole");
const { Op } = require("sequelize");


module.exports = async (req, res, next) => {
    let method = req.method
    let pathname = req._parsedUrl.pathname
    let additionalChecks = {}
    let userId = null
    if (req.user && req.user.roles) {
        let userRoles = req.user.roles[0].id
        additionalChecks.roleId = userRoles
        userId = req.user.id
    }
    AclApi.findOne({
        where: {
            endPoint: pathname
        },
        include: [{
            model: AclApiToUserRole,
            where: {
                ...additionalChecks
            },
            required: false
        }]
    }).then(item => {
        // console.log(item);
        if (item) {
            if (item.login_required) {
                if (userId && item.acl_api_to_user_roles && item.acl_api_to_user_roles.length && (item.request_method === 'REST' || item.request_method.toUpperCase() === method)) {
                    next()
                } else {
                    return res.status(404).send({
                        message: 'Page not found.'
                    })
                }
            } else {
                next()
            }
        } else {


            let splits = pathname.split("/")
            let regExp = []
            let condition = []
            splits.map(item => {
                if (item) {
                    let regex = `${regExp.length ? regExp[regExp.length - 1] : ''}/${item}`
                    regExp.push(regex)
                    condition.push({
                        endPoint: {
                            [Op.like]: `${regex}%`,
                        }
                    })
                }
            })

            AclApi.findAll({
                where: {
                    [Op.or]: condition

                },
                include: [{
                    model: AclApiToUserRole,
                    where: {
                        ...additionalChecks
                    },
                    required: false
                }]
            }).then(routes => {

                if (routes && routes.length) {
                    let route = null
                    routes.map(item => {
                        if (item.endPoint.split('/').length === splits.length) {
                            route = item
                        }
                    })
                    if (route && route.login_required) {
                        if (userId && route.acl_api_to_user_roles && route.acl_api_to_user_roles.length && (item.request_method === 'REST' || item.request_method.upperCase() === method)) {
                            next()
                        } else {
                            return res.status(404).send({
                                message: 'Page not found.'
                            })
                        }
                    } else {
                        next()
                    }
                } else {
                    next()
                }
			})
        }
	})
}