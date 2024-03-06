const { Op } = require('sequelize')
//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Modals
var NotificationSetting = require('../SqlModels/NotificationSetting');
var SystemApp = require('../SqlModels/SystemApp');

exports.getAll = async function (req, res) {

    let appName = req.query.app

    // if (req.user.roles[0].roleName != 'admin') {
    //     return respondWithError(req, res, 'invalid user request', null, 405)
    // }

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return respondWithError(req, res, 'app does not exist in system', null, 400)
    }

    let additionalCheck = {}

    if (req.user.roles[0].roleName != 'admin') {
        additionalCheck.isActive = true
    }

    NotificationSetting.findAll({
        where: {
            deleteStatus: false,
            appName: appName,
            ...additionalCheck,
        }
    }).then(data => {
        if (data && data.length) {
            return respondWithSuccess(req, res, 'data fetched successfully', data)
        } else {
            return respondWithSuccess(req, res, 'Unable to fetch data. data not found', [])
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
        return respondWithError(req, res, 'app does not exist in system', null, 400)
    }

    let additionalCheck = {}

    if (req.user.roles[0].roleName != 'admin') {
        additionalCheck.isActive = true
    }

    NotificationSetting.findOne({
        where: {
            id: id,
            deleteStatus: false,
            appName: appName,
            ...additionalCheck

        }
    }).then(data => {
        if (data && data.length) {
            return respondWithSuccess(req, res, 'data fetched successfully', data)
        } else {
            return respondWithError(req, res, 'Unable to fetch data. data not found', null, 400)
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {
    let name = req.body.name
    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return respondWithError(req, res, 'app does not exist in system', null, 400)
    }

    NotificationSetting.findOne({
        where: {
            name: name,
            deleteStatus: false,
            appName: appName
        }
    }).then(item => {
        if (item) {
            return respondWithError(req, res, 'notification setting already exist', null, 400)
        } else {
            let notificationSetting = new NotificationSetting({
                name: name,
                appName: appName,
            })
            if (req.body.login_required == false || req.body.login_required)
                notificationSetting.login_required = req.body.login_required

            if (req.body.isActive == false || req.body.isActive)
                notificationSetting.isActive = req.body.isActive

            notificationSetting.save().then(data => {
                return respondWithSuccess(req, res, 'notification setting has been added successfully', data)
            }).catch(err => {
                console.log(err);
                return respondWithError(req, res, '', null, 500)
            })
        }
    })
}

exports.update = async function (req, res) {

    let id = req.body.id
    let name = req.body.name
    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return respondWithError(req, res, 'app does not exist in system', null, 400)
    }

    let notificationSetting = await NotificationSetting.findOne({
        where: {
            name: name,
            deleteStatus: false,
            appName: appName,
            [Op.not]: {
                id: id
            }
        }
    })
    if (notificationSetting) {
        return respondWithError(req, res, 'notification setting already exist with that name', null, 400)
    }

    NotificationSetting.findOne({
        where: {
            deleteStatus: false,
            id: req.body.id,
            appName
        }
    }).then(async notificationSettingData => {
        if (!notificationSettingData) {
            return respondWithError(req, res, 'notification setting does not exist.', null, 400)
        }

        notificationSettingData.name = name

        if (req.body.login_required == false || req.body.login_required)
            notificationSettingData.login_required = req.body.login_required

        if (req.body.isActive == false || req.body.isActive)
            notificationSettingData.isActive = req.body.isActive

        notificationSettingData.save().then((data) => {
            return respondWithSuccess(req, res, 'notification setting has been updated successfully', data)
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
        return respondWithError(req, res, 'app does not exist in system', null, 400)
    }

    NotificationSetting.update({ deleteStatus: true }, {
        where: {
            deleteStatus: false,
            id: id,
            appName: appName,
        },
    }).then(data => {
        if (data && data[0]) {
            return respondWithSuccess(req, res, 'item has been deleted successfully')
        } else {
            return respondWithError(req, res, 'Unable to delete item. item not found', null, 400)
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
