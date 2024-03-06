//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')


// Custom Libraries
// const { sendEmail } = require('../../lib/email');

// Modals
const SystemApp = require('../SqlModels/SystemApp');
// helpers
const constants = require('../Constants/app.constants');
const general_helper = require('../../helpers/general_helper');
const { readFile, readFileSync } = require('fs');

// Constants
// const constants = require('../../../config/constants');
// const { APP_SECRET } = require('../../../config/constants');

exports.getAll = async function (req, res) {

    SystemApp.findAll({
        where: {
            deleteStatus: false
        }
    }).then(apps => {
        return res.send({
            message: 'data fetched successfully',
            data: apps
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.create = async function (req, res) {
    let name = req.body.name
    let slug = req.body.slug
    let packageName = req.body.packageName

    let isAppExist = await SystemApp.findOne({
        where: {
            deleteStatus: false,
            [Op.or]: {
                name,
                slug
            }
        },
        attributes: ['name', 'slug']
    })
    if (isAppExist) {
        if (isAppExist.name == name)
            return res.status(400).send({
                message: 'system app already exist.'
            })
        else
            return res.status(400).send({
                message: 'slug already exist.'
            })
    }

    slug = slug.replace(/\s/g, `-`);

    let systemAppData = new SystemApp({
        name,
        packageName,
        slug,
    })

    if (req.files) {
        if (req.files.image) {
            let imageData = await general_helper.uploadImage(req.files.image, 'systemApp', 'noAuth')
            if (imageData.status) {
                systemAppData.image = constants.NO_AUTH_FILE_PREFIX + imageData.imageName;
            } else {
                return res.status(imageData.statusCode).send({
                    message: imageData.message
                })
            }
        }
        // else {
        //     return res.status(422).send({
        //         message: 'Invalid Data',
        //     })
        // }
        // console.log('req.files.fireBaseKey=>',req.files.fireBaseKey);
        if (req.files.fireBaseKey) {
            systemAppData.fireBaseToken = JSON.stringify(JSON.parse(readFileSync(req.files.fireBaseKey.path, 'utf8')))
        }
        // else {
        //     return res.status(422).send({
        //         message: 'Invalid Data',
        //     })
        // }
    } else {
        return res.status(422).send({
            message: 'Invalid Data',
        })
    }
    systemAppData.save().then(async newFilter => {
        return res.send({
            message: 'System App has been added successfully.',
            data: newFilter
        })

    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {
    let id = req.body.id
    let name = req.body.name
    let packageName = req.body.packageName

    let additionalCheck = {}
    if (req.body.slug)
        additionalCheck.slug = req.body.slug

    let isAppExist = await SystemApp.findOne({
        where: {
            deleteStatus: false,
            [Op.or]: {
                name,
                ...additionalCheck
            },
            [Op.not]: {
                id
            }
        },
        attributes: ['name', 'slug']
    })
    if (isAppExist) {
        if (isAppExist.name == name)
            return res.status(400).send({
                message: 'system app already exist.'
            })
        else
            return res.status(400).send({
                message: 'slug already exist.'
            })
    }

    SystemApp.findOne({
        where: {
            id
        }
    }).then(async data => {
        if (data) {
            data.name = name
            data.packageName = packageName

            if (req.files) {
                if (req.files.image) {
                    let imageData = await general_helper.uploadImage(req.files.image, 'systemApp', 'noAuth')
                    if (imageData.status) {
                        data.image = constants.NO_AUTH_FILE_PREFIX + imageData.imageName;
                    }
                    else {
                        return res.status(imageData.statusCode).send({
                            message: imageData.message
                        })
                    }
                }
                if (req.files.fireBaseKey) {
                    data.fireBaseToken = JSON.stringify(JSON.parse(readFileSync(req.files.fireBaseKey.path, 'utf8')))
                }
            }
            data.save().then(async newFilter => {
                return res.send({
                    message: 'System App has been updated successfully.',
                    data: newFilter
                })

            }).catch(err => {
                console.log(err);
                return respondWithError(req, res, '', null, 500)
            })

        } else {
            return res.status(400).send({
                message: 'System App not found on server.',
            })
        }

    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })

}

exports.delete = async function (req, res) {
    let id = req.params.id
    SystemApp.update({ deleteStatus: true }, {
        where: {
            id: id
        },
    }).then((filterData) => {
        if (filterData && filterData[0]) {
            return res.status(200).send({
                message: 'System App has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'System App not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}