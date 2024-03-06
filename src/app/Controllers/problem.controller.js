//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

var fs = require('fs');
var path = require('path');

const { Op } = require('sequelize')

// Modals
var Modal = require('../SqlModels/Problem');
const general_helper = require('../../helpers/general_helper');
const constants = require('../Constants/app.constants');

exports.post = async function (req, res) {
    let detail = req.body.detail
    let postData = new Modal({
        userId: req.user.id,
        detail,
        images: []
    })

    if (req.files && req.files.image) {

        let images = []
        let imagesNeedToUpload = []
        if (Array.isArray(req.files.image) && req.files.image.length) {
            imagesNeedToUpload = req.files.image
        } else {
            imagesNeedToUpload.push(req.files.image)
        }

        if (imagesNeedToUpload.length) {
            for (let i = 0; i < imagesNeedToUpload.length; i++) {
                let image = imagesNeedToUpload[i]
                let imageData = await general_helper.uploadImage(image, 'problem')
                if (imageData.status) {
                    images.push(constants.FILE_PREFIX + imageData.imageName)
                }
            }
        }
        postData.images = images
    }

    postData.save().then(async postedData => {
        return res.send({
            message: 'Query has been added successfully.',
            // data: postedData
        })

    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}