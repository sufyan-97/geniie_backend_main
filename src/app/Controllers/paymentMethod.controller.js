//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Libraries
const { Op } = require('sequelize')


// Modals
var Modal = require('../SqlModels/PaymentMethod');
const User = require('../SqlModels/User');

// Helpers
const general_helper = require('../../helpers/general_helper');

// Custom Libraries
const { stripe } = require('../../lib/stripe')

// Constants
const constants = require('../Constants/app.constants');

exports.getAll = async function (req, res) {
    try {

        const user = await User.findOne({
            where: {
                id: req.user.id,
                deleteStatus: false,

            }
        })

        if (!user) {
            return res.status(400).send({
                status: false,
                message: "Error: User not found"
            })
        }

        let additionalCheck = {}
        if (req.user.roles[0].roleName != 'admin')
            additionalCheck.isActive = true

        // console.log(additionalCheck)

        Modal.findAll({
            where: {
                deleteStatus: false,
                ...additionalCheck,
            }
        }).then(async paymentMethods => {

            let stripeCard = null

            let cardData = null
            if (user.stripeId && user.selectedCardId) {
                try {
                    cardData = await stripe.customers.retrieveSource(user.stripeId, user.selectedCardId)
                    if (cardData) {
                        stripeCard = {
                            id: cardData.id,
                            brand: cardData.brand,
                            exp_month: cardData.exp_month,
                            exp_year: cardData.exp_month,
                            last4: cardData.last4
                        }
                    }

                } catch (error) {
                    console.log(error);
                }
            }

            return res.send({
                message: 'Data fetched successfully.',
                data: paymentMethods,
                stripe: stripeCard
            })
        }).catch(err => {
            console.log(err);
            return respondWithError(req, res, '', null, 500)
        })
    } catch (error) {
        console.log(error)
        return respondWithError(req, res, '', null, 500)
    }
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
        slug: req.body.slug,
        isActive: (typeof req.body.isActive === 'undefined' || req.body.isActive === undefined) ? true : req.body.isActive,
        isTopup: (typeof req.body.isTopup === 'undefined' || req.body.isTopup === undefined) ? false : req.body.isTopup,
        isService: (typeof req.body.isService === 'undefined' || req.body.isService === undefined) ? true : req.body.isService,
    })
    Modal.findOne({ where: { slug: req.body.slug, deleteStatus: false } }).then(async item => {
        if (item) {
            return res.status(400).send({
                message: 'Payment Method with this slug is already added.',
            })
        } else {

            if (req.files && req.files.image) {
                let imageData = await general_helper.uploadImage(req.files.image, 'payment_method')
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
    })



}

exports.update = async function (req, res) {

    let updateData = {
        id: req.body.id,
        name: req.body.name,
        // slug: req.body.slug,
    }

    if (req.body.isActive == 0 || req.body.isActive == 'false' || req.body.isActive == 1 || req.body.isActive == 'true') {
        updateData.isActive = req.body.isActive
    }

    if (req.body.isTopup == 0 || req.body.isTopup == 'false' || req.body.isTopup == 1 || req.body.isTopup == 'true') {
        updateData.isTopup = req.body.isTopup
    }

    if (req.body.isService == 0 || req.body.isService == 'false' || req.body.isService == 1 || req.body.isService == 'true') {
        updateData.isService = req.body.isService
    }


    let id = req.body.id
    Modal.findOne({
        where: {
            slug: req.body.slug,
            deleteStatus: false,
            [Op.not]: { id: id }
        }
    }).then(async item => {
        if (item) {
            return res.status(400).send({
                message: 'Payment Method with this slug is already added.',
            })
        } else {
            if (req.files && req.files.image) {
                let imageData = await general_helper.uploadImage(req.files.image, 'payment_method')
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
                        data: updateData
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
            id: id,
            deleteStatus: false
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Payment method has been deleted successfully.',
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