const { Op } = require('sequelize')
//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Modals
var AppControl = require('../SqlModels/AppControl');
var SystemApp = require('../SqlModels/SystemApp');

exports.getAll = async function (req, res) {

    let appName = req.query.app
    
    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    AppControl.findAll({
        where:
        {
            deleteStatus: false,
            appName: appName,
        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'App control data fetched successfully.',
                data: data
            })
        } else {
            return res.send({
                message: 'Unable to fetch app control. App Control not found.',
                data: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
exports.getActive = async function (req, res) {

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    AppControl.findAll({
        where:
        {
            deleteStatus: false,
            appName: appName,
            isActive: true
        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'App control data fetched successfully.',
                appControls: data
            })
        } else {
            return res.send({
                message: 'Unable to fetch app control. App Control not found.',
                appControls: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getOne = async function (req, res) {
    let key = req.params.key
    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let additionalCheck = {}

    if (req.user.roles[0].roleName != 'admin') {
        additionalCheck.isActive = true
    }

    AppControl.findAll({
        where: {
            key: key,
            deleteStatus: false,
            appName: appName,
            ...additionalCheck

        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'App Control data fetched successfully.',
                appControl: data[0]
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch app control item. App Control item not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}


exports.post = async function (req, res) {
    let key = req.body.key
    let value = req.body.value
    let appName = req.query.app
    let description = req.body.description

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    AppControl.findOne({
        where: {
            key: key,
            deleteStatus: false,
            appName: appName
        }
    }).then(item => {
        if (item) {
            return res.status(400).send({
                message: 'App control key is already added. Please update the value of existing key.',
            })
        } else {
            let appControlItem = new AppControl({
                key: key,
                value: value,
                appName: appName,
                description: description,
            })
            if (req.body.isActive == false || req.body.isActive == 0 || req.body.isActive == 'false' || req.body.isActive == '0')
                appControlItem.isActive = false

            appControlItem.save().then(appControlItemData => {
                return res.send({
                    message: 'Menu item has been added successfully.',
                    data: appControlItemData
                })
            }).catch(err => {
                console.log(err);
                return respondWithError(req, res, '', null, 500)
            })
        }
    })
}

exports.update = async function (req, res) {

    let key = req.body.key
    let id = req.body.id
    let appName = req.query.app
    let description = req.body.description
    let isActive = req.body.isActive

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let appControl = await AppControl.findOne({
        where: {
            key: key,
            deleteStatus: false,
            appName: appName,
            [Op.not]: {
                id: id
            }
        }
    })
    if (appControl) {
        return res.status(400).send({
            message: 'Control already exist with that key',
        })
    }

    AppControl.findOne({
        where: {
            deleteStatus: false,
            id: req.body.id,
            appName
        }
    }).then(async appControlData => {
        if (!appControlData) {
            return res.status(400).send({
                message: 'Control Does not exist.',
            })
        }

        let value = req.body.value
        if (isActive == false || isActive) {
            appControlData.isActive = isActive
        }
        appControlData.description = description
        appControlData.key = key
        appControlData.value = value


        appControlData.save().then((appControl) => {
            return res.send({
                message: 'Control has been Updated successfully.',
                data: appControl
            })

        }).catch(err => {
            console.log("err:", err);
            return respondWithError(req, res, '', null, 500)
        })
    }).catch(err => {
        console.log("err:", err);
        return respondWithError(req, res, '', null, 500)
    });
}

exports.delete = async function (req, res) {
    let id = req.params.id
    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    AppControl.update({ deleteStatus: true }, {
        where: {
            [Op.and]: [
                {
                    deleteStatus: false
                },
                {
                    id: id
                },
                {
                    appName: appName
                }
            ]
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'App control has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete app control. App control not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
