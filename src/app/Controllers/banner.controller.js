//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries

const { Op } = require('sequelize')

// // Config
// var redisJwt = require('../../../config/jwt');
// const redisClient = require("../../../config/redis");

// // Custom Libraries
// const { sendEmail } = require('../../lib/email');

// Modals
var Banner = require('../SqlModels/banner');
// var { Restaurant } = require('../SqlModels/Restaurant');
var SystemApp = require('../SqlModels/SystemApp');

// helpers
const general_helper = require('../../helpers/general_helper');

// Constants
const constants = require('../Constants/app.constants');
// const app_constants = require('../Constants/app.constants');
// const { APP_SECRET } = require('../../../config/constants');

exports.getAll = async function (req, res) {

    //header Data
    let lngCode = req.headers['language']

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let additionalCheck = {}
    if (req.user.roles[0].roleName != 'admin') {
        additionalCheck.isActive = true
    }
    Banner.findAll({
        where: {
            deleteStatus: false,
            appName: appName,
            ...additionalCheck
        },
        lngCode: lngCode,
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Banners data fetched successfully.',
                banners: data
            })
        } else {
            return res.send({
                message: 'Unable to fetch banner. Banners not found.',
                banners: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getOne = async function (req, res) {
    let id = req.params.id
    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let additionalCheck = {}
    if (req.user.roles[0].roleName != 'admin') {
        additionalCheck.isActive = true
    }
    Banner.findOne({
        where: {
            id: id,
            appName: appName,
            ...additionalCheck
        },
        // include: Restaurant
    }).then(data => {
        // console.log(data);
        if (data) {
            return res.send({
                message: 'Banner data fetched successfully.',
                banner: data
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch banner. Banner not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}


exports.post = async function (req, res) {

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let banner = new Banner({
        heading: req.body.heading ? req.body.heading : '',
        subHeading: req.body.subHeading ? req.body.subHeading : '',
        detail: req.body.detail ? req.body.detail : '',
        termAndCondition: req.body.termAndCondition ? req.body.termAndCondition : '',
        appName: appName,
        // isActive: req.body.isActive ? req.body.isActive : 1
    })
    if (req.body.isActive == false || req.body.isActive == 0 || req.body.isActive == 'false' || req.body.isActive == '0')
        banner.isActive = false

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'banner')
        if (imageData.status) {
            banner.image = constants.FILE_PREFIX + imageData.imageName;
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

    banner.save().then(async bannerData => {
        let createdData = await Banner.findOne({
            where: {
                id: bannerData.id
            }
        })
        return res.send({
            message: 'Banner has been added successfully.',
            banner: createdData
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })


}

exports.update = async function (req, res) {

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let updateData = {
        id: req.body.id,
        appName: appName
    }

    let bodyKeys = Object.keys(req.body)
    if (bodyKeys.length) {
        bodyKeys.map(item => {
            updateData[item] = req.body[item]
        })
    }
    if (req.body.isActive == false || req.body.isActive == 0 || req.body.isActive == 'false' || req.body.isActive == '0')
        updateData.isActive = false
    // if (req.body.isActive == false || req.body.isActive) {
    //     updateData.isActive = req.body.isActive
    // }

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'banner')
        if (imageData.status) {
            updateData.image = constants.FILE_PREFIX + imageData.imageName;
        } else {
            return res.status(imageData.statusCode).send({
                message: imageData.message
            })
        }
    }

    Banner.update(updateData, {
        where: {
            [Op.and]: [
                {
                    id: req.body.id
                },
                {
                    deleteStatus: false
                }
            ]
        },
    }).then(async data => {
        if (data && data[0]) {

            let updatedData = await Banner.findOne({
                where: {
                    id: req.body.id
                }
            })

            return res.send({
                message: 'Banner has been updated successfully.',
                data: updatedData
            })
        } else {
            return res.status(400).send({
                message: 'Unable to update banner. Banner not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.delete = async function (req, res) {
    let id = req.params.id
    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    Banner.update({ deleteStatus: true }, {
        where: {
            deleteStatus: false,
            id: id,
            appName: appName
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Banner has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete banner. Banner not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
