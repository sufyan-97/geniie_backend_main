//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

const { Op } = require('sequelize')

const constants = require('../Constants/app.constants');
const general_helper = require('../../helpers/general_helper');

// Modals
var Modal = require('../SqlModels/Role');
var SuperAdminRoutePermission = require('../SqlModels/SuperAdminRoutePermission');
var SuperAdminActionPermission = require('../SqlModels/SuperAdminActionPermission');

exports.getAll = async function (req, res) {
    let type = req.query.type
    let where = {
        roleName: { [Op.not]: 'admin' }
    }
    if (type && type === 'all') {
        where = {}
    }

    Modal.findAll({
        where: where,
        include: [
            {
                model: SuperAdminRoutePermission,
                required: false,
            },
            {
                model: SuperAdminActionPermission,
                required: false,
            }
        ]
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Data fetched successfully.',
                data: data
            })
        } else {
            return res.send({
                message: 'No data found.',
                data: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getOne = async function (req, res) {
    let id = req.params.id
    Modal.findAll({
        where: {
            id: id,
            roleName: { [Op.not]: 'admin' }
        },
        include: [
            {
                model: SuperAdminRoutePermission,
                required: false,
            },
            {
                model: SuperAdminActionPermission,
                required: false,
            }
        ]
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
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {

    let postData = new Modal({
        roleName: req.body.roleName,
        // isActive: req.body.isActive,
        // isAgent: req.body.isAgent,
    })

    if (req.body.isActive == false || req.body.isActive) {
        postData.isActive = req.body.isActive
    }

    if (req.body.isAgent == false || req.body.isAgent) {
        postData.isAgent = req.body.isAgent
    }

    postData.save().then(async postedData => {
        let role = await Modal.findOne({
            where: {
                id: postedData.id
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
        return res.send({
            message: 'Role has been added successfully.',
            data: role
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {

    let updateData = {
        roleName: req.body.roleName,
        // isActive: req.body.isActive
    }
    let id = req.body.id

    if (req.body.isActive == false || req.body.isActive) {
        updateData.isActive = req.body.isActive
    }

    if (req.body.isAgent == false || req.body.isAgent) {
        updateData.isAgent = req.body.isAgent
    }

    Modal.update(updateData, {
        where: {
            id: id,
            roleName: { [Op.not]: 'admin' }
        },
    }).then(async data => {
        if (data && data[0]) {
            let updatedData = await Modal.findOne({
                where: {
                    id: id
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
            return res.send({
                message: 'Data has been updated successfully.',
                data: updatedData
            })
        } else {
            return res.status(400).send({
                message: 'Unable to update data. Data not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.delete = async function (req, res) {
    let id = req.params.id
    Modal.destroy({
        where: {
            id: id,
            roleName: { [Op.not]: 'admin' }
        },
    }).then(data => {
        return res.send({
            message: 'Data has been deleted successfully.',
        })
        if (data && data[0]) {
            return res.send({
                message: 'Data has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete data. Data not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
