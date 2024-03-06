//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')

// Config

// Custom Libraries
const { sendEmail } = require('../../lib/email');

// Modals
var ModuleType = require('../SqlModels/ModuleType');

// helpers
const general_helpers = require('../../helpers/general_helper');

// Constants
const constants = require('../../../config/constants');
// const { APP_SECRET } = require('../../../config/constants');

exports.getAll = async function (req, res) {
    // console.log('hello world')
    ModuleType.findAll({
        where: {
            deleteStatus: false,
        },
    }).then(moduleType => {
        if (moduleType && moduleType.length) {
            return res.send({
                message: 'module type fetched successfully.',
                data: moduleType
            })
        } else {
            return res.send({
                message: 'Unable to fetch module type. module type not found.',
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
    ModuleType.findOne({
        where: {
            id,
            deleteStatus: false,
        }
    }).then(data => {
        if (data) {
            return res.send({
                message: 'module type fetched successfully.',
                address: data
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch module type. module type not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {
    let type = req.body.type

    let isModuleTypeExist = await ModuleType.findOne({
        where: {
            type,
        },
        attributes: ['id']
    })
    if (isModuleTypeExist) {
        return res.status(400).send({
            message: 'module type already exist.'
        })
    }

    let moduleType = new ModuleType
    moduleType.type = type

    moduleType.save().then(async data => {
        return res.send({
            message: 'module type has been added successfully.',
            data: data
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {

    let id = req.body.id
    let type = req.body.type

    let isModuleTypeExist = await ModuleType.findOne({
        where: {
            type,
            [Op.not]: {
                id
            }
        },
        attributes: ['id']
    })
    if (isModuleTypeExist) {
        return res.status(400).send({
            message: 'module type already exist.'
        })
    }

    ModuleType.findOne({
        where: {
            deleteStatus: false,
            id
        }
    }).then(data => {
        if (!data) {
            return res.status(400).send({
                message: 'module type Not Found.',
            })
        }

        data.type = type

        data.save().then((moduleType) => {
            return res.send({
                message: 'module type has been Updated successfully.',
                data: moduleType
            })

        }).catch(err => {
            console.log("err:", err);
            return respondWithError(req, res, '', null, 500)
        })
    }).catch(err => {
        console.log("err:", err);
        return respondWithError(req, res, '', null, 500)
    })

}

exports.delete = async function (req, res) {
    let id = req.params.id
    ModuleType.update({ deleteStatus: true }, {
        where: {
            id
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'module type has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete module type. module type not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}