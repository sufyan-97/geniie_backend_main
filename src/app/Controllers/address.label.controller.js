
const { Op } = require('sequelize')

// Helpers
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper');

// Modals
var AddressLabel = require('../SqlModels/AddressLabel');
const constants = require('../Constants/app.constants');
const general_helper = require('../../helpers/general_helper');

exports.getAll = async function (req, res) {
    AddressLabel.findAll({
        where: {
            deleteStatus: false
        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Address Labels data fetched successfully.',
                labels: data
            })
        } else {
            return res.send({
                message: 'Unable to fetch Labels. Labels not found.',
                labels: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getOne = async function (req, res) {
    let id = req.params.id
    AddressLabel.findAll({
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
                message: 'Label data fetched successfully.',
                label: data[0]
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch Label. Label not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {


    let addressLabel = new AddressLabel({
        name: req.body.name,
        // slug: req.body.slug
    })

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'label')
        if (imageData.status) {
            addressLabel.image = constants.FILE_PREFIX + imageData.imageName;
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

    if (req.files && req.files.selectedImage) {
        let imageData = await general_helper.uploadImage(req.files.selectedImage, 'selected-label')
        if (imageData.status) {
            addressLabel.selectedImage = constants.FILE_PREFIX + imageData.imageName;
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

    // addressLabel.slug = addressLabel.name.replace(/\s/g,`-`);
    // return res.send(addressLabel);

    addressLabel.save().then(async addressLabelData => {
        let createdData = await AddressLabel.findOne({
            where: {
                id: addressLabelData.id
            }
        })
        return res.send({
            message: 'Address has been added successfully.',
            label: createdData
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
        slug: req.body.slug
    }
    let id = req.body.id

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'label')
        if (imageData.status) {
            updateData.image = constants.FILE_PREFIX + imageData.imageName;
        } else {
            return res.status(imageData.statusCode).send({
                message: imageData.message
            })
        }
    }

    if (req.files && req.files.selectedImage) {
        let imageData = await general_helper.uploadImage(req.files.selectedImage, 'selected-label')
        if (imageData.status) {
            updateData.selectedImage = constants.FILE_PREFIX + imageData.imageName;
        } else {
            return res.status(imageData.statusCode).send({
                message: imageData.message
            })
        }
    }

    AddressLabel.update(updateData, {
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
            let addressLabel = await AddressLabel.findOne({
                where: {
                    id: updateData.id
                }
            })
            return res.send({
                message: 'Label has been updated successfully.',
                data: addressLabel
            })
        } else {
            return res.status(400).send({
                message: 'Unable to update label. Label not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.delete = async function (req, res) {
    let id = req.params.id
    AddressLabel.update({ deleteStatus: true }, {
        where: {
            id: id,
            deleteStatus: false
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Label has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete Label. Label not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
