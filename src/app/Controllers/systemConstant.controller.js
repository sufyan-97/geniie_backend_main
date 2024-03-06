//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')

// Modals
var SystemConstant = require('../SqlModels/SystemConstant');

exports.getAll = async function (req, res) {

    SystemConstant.findAll({
        where: {
            deleteStatus: false,
        },
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'system constants fetched successfully.',
                data
            })
        } else {
            return res.send({
                message: 'Unable to fetch system constants. System constant not found.',
                data: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getActive = async function (req, res) {

    SystemConstant.findAll({
        where: {
            deleteStatus: false,
            isActive: true
        },
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'system constants fetched successfully.',
                data
            })
        } else {
            return res.send({
                message: 'Unable to fetch system constants. System constant not found.',
                data: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getOne = async function (req, res) {
    let key = req.params.key

    SystemConstant.findOne({
        where: {
            key,
            deleteStatus: false,
            isActive: true
        }
    }).then(data => {
        if (data) {
            return res.send({
                message: 'system constant data fetched successfully.',
                data
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch system constant. System constant not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {

    let isSystemConstant = await SystemConstant.findOne({ where: { key: req.body.key, deleteStatus: false } });
    if (isSystemConstant) {
        return res.status(400).send({ message: 'system Constant key already exist' })
    }

    let systemConstant = new SystemConstant({
        key: req.body.key,
        value: req.body.value,
        description: req.body.description ? req.body.description : null,
    })
    if (req.body.isActive == false || req.body.isActive == 0)
        systemConstant.isActive = req.body.isActive

    systemConstant.save().then(async (systemConstantData) => {
        return res.send({
            message: 'system Constant has been added successfully.',
            data: systemConstantData
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {

    let isSystemConstant = await SystemConstant.findOne({ where: { key: req.body.key, deleteStatus: false, [Op.not]: { id: req.body.id } } });
    if (isSystemConstant) {
        return res.status(400).send({ message: 'system Constant key already exist' })
    }

    let updateData = {
        id: req.body.id,
        key: req.body.key,
        value: req.body.value,
        description: req.body.description ? req.body.description : null,
    }
    if (req.body.isActive == false || req.body.isActive == 0)
        updateData.isActive = req.body.isActive

    SystemConstant.update(updateData, {
        where: {
            id: req.body.id,
            deleteStatus: false
        },
    }).then(async data => {
        if (data && data[0]) {
            let systemConstant = await SystemConstant.findOne({ where: { id: req.body.id } });
            return res.send({
                message: 'system Constant has been updated successfully.',
                data: systemConstant
            })
        } else {
            return res.status(400).send({
                message: 'Unable to update system constant. System Constant not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.delete = async function (req, res) {
    let id = req.params.id

    SystemConstant.update({ deleteStatus: true }, {
        where: {
            deleteStatus: false,
            id: id,
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'system constant has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete system constant. system constant not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
