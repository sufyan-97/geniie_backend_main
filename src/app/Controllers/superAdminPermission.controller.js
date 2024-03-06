//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')

// Custom Libraries
const { sendEmail } = require('../../lib/email');

// Modals
const SuperAdminRoutePermission = require('../SqlModels/SuperAdminRoutePermission');
const SuperAdminActionPermission = require('../SqlModels/SuperAdminActionPermission');
const Role = require('../SqlModels/Role');

// helpers
// const general_helpers = require('../../helpers/general_helper');

exports.post = async function (req, res) {
    try {
        if (req.user.roleName !== 'admin') {
            return respondWithError(req, res, 'action not allowed', null, 405)
        }
        let role = await Role.findOne({
            where: {
                id: req.body.roleId,
                isActive: true,
                isAgent: true
            }
        })
        if (!role) {
            return respondWithError(req, res, 'role not found', null, 400)
        }

        let routePermissions = req.body.routePermissions
        let actionPermissions = req.body.actionPermissions

        await SuperAdminRoutePermission.destroy({ where: { roleId: req.body.roleId } })
        await SuperAdminActionPermission.destroy({ where: { roleId: req.body.roleId } })

        await SuperAdminRoutePermission.bulkCreate(routePermissions);

        if (actionPermissions && Array.isArray(actionPermissions)) {
            await SuperAdminActionPermission.bulkCreate(actionPermissions);
        }

        role = await Role.findOne({
            where: {
                id: req.body.roleId
            },
            include:[
                {
                    model: SuperAdminRoutePermission,
                    required:false,
                },
                {
                    model: SuperAdminActionPermission,
                    required:false,
                }
            ]
        }) 

        return respondWithSuccess(req, res, 'permissions updated successfully', role)
    } catch (error) {
        console.log(error)
        return respondWithError(req, res, '', null, 500)
    }
}