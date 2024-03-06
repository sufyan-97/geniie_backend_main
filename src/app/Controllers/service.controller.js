//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

const { Op } = require('sequelize')

// Modals
var Modal = require('../SqlModels/Service');
const searchHelper = require('../../helpers/searchHelper')
const constants = require('../Constants/app.constants');
const general_helper = require('../../helpers/general_helper');

const path = require('path');

exports.getAll = async function (req, res) {


    var data = await searchHelper.search(Modal, req, 'name')

    return res.send(data);

}

exports.getOne = async function (req, res) {
    let id = req.params.id
    Modal.findAll({
        where: {
            [Op.and]: [
                {
                    id: id
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
        // console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {

    let data = req.body.match;
    let postData = new Modal(data)

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'service')
        if (imageData.status) {
            postData.image = constants.FILE_PREFIX + imageData.imageName;
        } else {
            return res.status(imageData.statusCode).send({
                message: imageData.message
            })
        }
    }
    else {
        return res.status(422).send({
            message: 'Invalid Data',
        })
    }

    postData.save().then(async postedData => {
        let createdData = await Modal.findOne({
            where: {
                id: postedData.id
            }
        })
        return res.send({
            message: 'Service item has been added successfully.',
            data: createdData
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })

}

exports.update = async function (req, res) {

    let updateData = {
        id: req.body.id,
        name: req.body.name,
        slug: req.body.slug,
        isActive: req.body.isActive,
        isFeatured: req.body.isFeatured
    }

    let id = req.body.id
    Modal.findOne({
        where: {
            slug: req.body.slug,
            [Op.not]: { id: id }
        }
    }).then(async item => {
        if (item) {
            return res.status(400).send({
                message: 'Service with this slug is already added.',
            })
        } else {
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
                            deleteStatus: false
                        }
                    ]
                },
            }).then(async data => {
                if (data && data[0]) {
                    let modal = await Modal.findOne({
                        where: {
                            id: updateData.id
                        }
                    })
                    return res.send({
                        message: 'Data has been updated successfully.',
                        data: modal
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
    Modal.update({ deleteStatus: true }, {
        where: {
            id: id
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Service has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete data. Data not found.',
            })
        }
    }).catch(err => {
        return respondWithError(req, res, '', null, 500)
    })
}