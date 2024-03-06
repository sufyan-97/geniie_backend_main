//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Libraries
const { Op } = require('sequelize')

// Custom Libraries
const rpcClient = require('../../lib/rpcClient')

// Helpers
const general_helper = require('../../helpers/general_helper');


// Modals
const TermAndCondition = require('../SqlModels/TermAndCondition');


// Constants
// const constants = require('../Constants/app.constants');

exports.getAll = async function (req, res) {

    TermAndCondition.findAll({
        where: {
            deleteStatus: false
        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Data fetched successfully.',
                data: data,
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

exports.create = async function (req, res) {

    let payload = req.body.match;

    if (req.user.roles[0].roleName != 'admin') {
        return res.status(405).send({
            message: 'Error: method not allowed',
        })
    }

    let postData = new TermAndCondition(payload)

    postData.save().then(async postedData => {
        let termAndCondition = await TermAndCondition.findOne({
            where: {
                id: postedData.id,
            },
        })
        return res.status(200).send({
            message: 'Term And Condition has been created successfully.',
            data: termAndCondition
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })

}

exports.update = async function (req, res) {

    let id = req.body.id

    if (req.user.roles[0].roleName != 'admin') {
        return res.status(405).send({
            message: 'Error: method not allowed',
        })
    }

    let updateData = {
        id: id,
        detail: req.body.detail,
    }

    TermAndCondition.findOne({ where: { id: id, deleteStatus: false } }).then(async item => {
        if (!item) {
            return res.status(400).send({
                message: 'Term And Condition not found against given id.',
            })
        } else {
            TermAndCondition.update(updateData, {
                where: {
                    id: id
                }
            }).then(async data => {
                if (data && data[0]) {
                    let updatedData = await TermAndCondition.findOne({ where: { id } })
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
    })
}

exports.delete = async function (req, res) {
    let id = req.params.id

    if (req.user.roles[0].roleName != 'admin') {
        return res.status(405).send({
            message: 'Error: method not allowed',
        })
    }
    
    TermAndCondition.update({ deleteStatus: true }, {
        where: {
            id: id,
            deleteStatus: false
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Term And Condition has been deleted successfully.',
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
