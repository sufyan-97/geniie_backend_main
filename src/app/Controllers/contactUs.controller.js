
const { Op } = require('sequelize')
//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Modals
var Modal = require('../SqlModels/ContactUsItem');
const constants = require('../Constants/app.constants');
const general_helper = require('../../helpers/general_helper');

exports.getAll = async function (req, res) {
    Modal.findAll({
        where: {
            deleteStatus: false
        }
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
            [Op.and]: [
                {
                    id: id
                },
                {
                    deleteStatus: false
                }
            ]
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
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {

    let postData = new Modal({
        name: req.body.name,
        slug: req.body.slug
    })

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'contact_us')
        if (imageData.status) {
            postData.image = constants.FILE_PREFIX + imageData.imageName;
        } else {
            return res.status(imageData.statusCode).send({
                message: imageData.message
            })
        }
    } else {
        return res.status(422).send({
            message: 'Invalid Data',
        })
    }

    postData.save().then(postedData => {
        return res.send({
            message: 'Contact Us item has been added successfully.',
            data: postedData
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {

    let updateData = {
        name: req.body.name,
        slug: req.body.slug
    }
    let id = req.body.id

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'contact_us')
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
                    deleteStatus: false
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
}

exports.delete = async function (req, res) {
    let id = req.params.id
    Modal.update({ deleteStatus: true }, {
        where: {
            id: id,
            deleteStatus: false
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Contact Us item has been deleted successfully.',
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