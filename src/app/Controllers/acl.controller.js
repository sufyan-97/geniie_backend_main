
const { Op } = require('sequelize')

// Modals
var Modal = require('../SqlModels/AclApi');
const constants = require('../Constants/app.constants');
const general_helper = require('../../helpers/general_helper');
const Role = require('../SqlModels/Role');
const AclApiToUserRole = require('../SqlModels/AclApiToUserRole');

exports.getAll = async function (req, res) {
    Modal.findAll({
        include: AclApiToUserRole
    }).then(async data => {
        if (data && data.length) {

            let roles = await Role.findAll({
                attributes: ['id', 'roleName']
            })
            let dataToSend = []
            data.map(item => {
                item = item.toJSON()
                let addedRoles = []
                let roleToAdd = []

                if (item.acl_api_to_user_roles.length) {
                    item.acl_api_to_user_roles.map(aclItem => {
                        addedRoles.push(aclItem.roleId)
                    })
                }
                roles.map(roleItem => {
                    roleItem = roleItem.toJSON()
                    if (addedRoles.includes(roleItem.id)) {
                        roleItem.added = true
                    } else {
                        roleItem.added = false
                    }
                    roleToAdd.push(roleItem)
                })
                item.roles = roleToAdd
                delete item.acl_api_to_user_roles
                dataToSend.push(item)
            })

            return res.send({
                message: 'Data fetched successfully.',
                data: dataToSend
            })
        } else {
            return res.send({
                message: 'No data found.',
                data: []
            })
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).send({
            message: 'Internal Server Error.',
        })
    })
}

exports.getOne = async function (req, res) {
    let id = req.params.id
    Modal.findAll({
        where: {
            id: id
        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Data fetched successfully.',
                data: data[0]
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch item.',
            })
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).send({
            message: 'Internal Server Error.',
        })
    })
}

exports.post = async function (req, res) {
    let endPoint = req.body.endPoint
    let request_method = req.body.request_method
    let login_required = req.body.login_required
    let roleIds = req.body.roleIds

    let postData = new Modal({
        endPoint,
        request_method,
        login_required
    })

    Modal.findOne({ where: { endPoint, request_method } }).then(async item => {
        if (item) {
            return res.status(400).send({
                message: 'Api with this name is already added.',
            })
        } else {
            postData.save().then(postedData => {
                roleIds.map(item => {
                    AclApiToUserRole.create({
                        roleId: item,
                        apiId: postedData.id
                    })
                })
                return res.send({
                    message: 'Api is added to acl list successfully.',
                    data: postedData
                })
            }).catch(err => {
                console.log(err);
                return res.status(500).send({
                    message: 'Internal Server Error.',
                })
            })
        }
    })



}

exports.update = async function (req, res) {

    let endPoint = req.body.endPoint
    let request_method = req.body.request_method
    let login_required = req.body.login_required

    let updateData = {
        endPoint,
        request_method,
        login_required
    }

    let id = req.body.id
    Modal.findOne({
        where: {
            endPoint,
            request_method,
            [Op.not]: { id: id }
        }
    }).then(async item => {
        if (item) {
            return res.status(400).send({
                message: 'Api with this name is already added.',
            })
        } else {
            Modal.update(updateData, {
                where: {
                    id: id
                },
            }).then(async data => {
                if (data && data[0]) {
                    let data = await Modal.findOne({ where: { id: id } })
                    return res.send({
                        message: 'Data has been updated successfully.',
                        data: data
                    })
                } else {
                    return res.status(400).send({
                        message: 'Unable to update data. Data not found.',
                    })
                }
            }).catch(err => {
                console.log(err);
                return res.status(500).send({
                    message: 'Internal Server Error.',
                })
            })
        }
    })
}

exports.updatePrivilege = async function (req, res) {

    let id = req.body.id
    let roleId = req.body.roleId
    let value = JSON.parse(req.body.value)
    Modal.findOne({
        where: { id: id }
    }).then(async item => {

        if (item) {
            AclApiToUserRole.findOne({
                where: {
                    apiId: id,
                    roleId
                }
            }).then(data => {
                if (data) {
                    if (!value) {
                        data.destroy()
                        return res.send({
                            message: 'Data has been updated successfully.',
                        })
                    } else {
                        return res.send({
                            message: 'Data has been updated successfully.',
                        })
                    }
                } else if (value) {
                    AclApiToUserRole.create({
                        roleId: roleId,
                        apiId: id
                    })
                    return res.send({
                        message: 'Data has been updated successfully.',
                    })
                } else {
                    return res.send({
                        message: 'Data has been updated successfully.',
                    })
                }
            }).catch(err => {
                console.log(err);
                return res.status(500).send({
                    message: 'Internal Server Error.',
                })
            })
        } else {
            return res.status(400).send({
                message: 'Item not found',
            })
        }
    })
}

exports.delete = async function (req, res) {
    let id = req.params.id
    Modal.destroy({
        where: {
            id: id,
        }
    }).then(data => {
        if (data) {
            return res.send({
                message: 'Acl Api has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete data. Data not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).send({
            message: 'Internal Server Error.',
        })
    })
}