//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Modals
var Onboarding = require('../SqlModels/Onboarding');
var SystemApp = require('../SqlModels/SystemApp');
const general_helper = require('../../helpers/general_helper');
const constants = require('../Constants/app.constants');

exports.getAll = async function (req, res) {

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if(!isAppExist){
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    Onboarding.findAll({
        where:
        {
            deleteStatus: false,
            appName: appName
        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Onboarding data fetched successfully.',
                data: data
            })
        } else {
            return res.send({
                message: 'Unable to fetch Onboarding. Onboarding not found.',
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
    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if(!isAppExist){
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    Onboarding.findOne({
        where: {
            id: id,
            appName: appName,
            deleteStatus: false
        },
    }).then(data => {
        if (data) {
            return res.send({
                message: 'Onboarding data fetched successfully.',
                data: data
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch Onboarding. Onboarding not found.',
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
    if(!isAppExist){
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let onboarding = new Onboarding({
        heading: req.body.heading,
        details: req.body.details,
        appName: appName
    })

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'onboarding', 'noAuth')
        if (imageData.status) {
            onboarding.image = constants.NO_AUTH_FILE_PREFIX + imageData.imageName;
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

    onboarding.save().then(async (onboardingData) => {
        let data = await Onboarding.findOne({ where: { id: onboardingData.id } });
        return res.send({
            message: 'Onboarding has been added successfully.',
            data: data
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {
    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if(!isAppExist){
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let updateData = {
        id: req.body.id,
        heading: req.body.heading,
        details: req.body.details,
    }

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'onboarding', 'noAuth')
        if (imageData.status) {
            updateData.image = constants.NO_AUTH_FILE_PREFIX + imageData.imageName;
        } else {
            return res.status(imageData.statusCode).send({
                message: imageData.message
            })
        }
    }

    Onboarding.update(updateData, {
        where: {
            id: req.body.id,
            appName: appName,
            deleteStatus: false
        },
    }).then(async data => {
        if (data && data[0]) {
            let updatedData = await Onboarding.findOne({ where: { id: req.body.id } })
            return res.send({
                message: 'Onboarding has been updated successfully.',
                data: updatedData
            })
        } else {
            return res.status(400).send({
                message: 'Unable to update Onboarding. Onboarding not found.',
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
    if(!isAppExist){
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    Onboarding.update({ deleteStatus: true }, {
        where: {
            deleteStatus: false,
            id: id,
            appName: appName
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Onboarding has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete Onboarding. Onboarding not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
