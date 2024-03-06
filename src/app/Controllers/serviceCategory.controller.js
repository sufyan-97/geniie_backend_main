//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

const { Op } = require("sequelize");

const Modal = require("../SqlModels/ServiceCategory");
const constants = require('../Constants/app.constants');
const general_helper = require('../../helpers/general_helper');


exports.getAll = async function (req, res) {

    Modal.findAll({
        where: {
            status: true
        }
    }).then(data => {
        if (data && data.length) {
            return res.status(200).send({ message: "Data fetched successfully", data: data })
        } else {
            return res.status(404).send({ message: "No data found" })
        }
    }).catch(err => {
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getOne = async function (req, res) {
    id = req.params.id;
    Modal.findOne({ where: { id: id } }).then(data => {
        if (data) {
            return res.status(200).send({ message: "Data fetched successfully", data: data })
        } else {
            return res.status(404).send({ message: "No data found" })
        }
    }).catch(err => {
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {
    let validated = req.body.match;
    let postData = new Modal(validated);

    postData.save().then(postedData => {
        return res.send({
            message: 'Service category has been added successfully.',
            data: postedData
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {

    let updateData = req.body.match;
    let id = req.params.id;
    Modal.findOne({
        where: {
            id: id
        }
    }).then(async item => {

        if (req.files && req.files.image) {
            let imageData = await general_helper.uploadImage(req.files.image, 'service')
            if (imageData.status) {
                updateData.image = constants.FILE_PREFIX + imageData.imageName;
            } else {
                return res.status(imageData.statusCode).send({
                    message: imageData.message
                })
            }
        }

        Modal.update(updateData, {
            where: {
                [Op.and]: [
                    {
                        id: id
                    },
                    {
                        status: true
                    }
                ]
            },
        }).then(data => {
            if (data && data[0]) {
                return res.send({
                    message: 'Data has been updated successfully.',
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
    })

}

exports.delete = async function (req, res) {

    let id = req.params.id;
    Modal.update({ deleteStatus: true }, {
        where: {
            id: id,
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Service category has been deleted successfully.',
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