//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

var Modal = require('../SqlModels/Notification');
var UserNotification = require('../SqlModels/UserNotification');
const general_helper = require('../../helpers/general_helper');
const notification_helper = require('../../helpers/notification_helper');
const constants = require('../Constants/app.constants');
const User = require('../SqlModels/User');

exports.getAll = async function (req, res) {

    let appName = req.query.app
    let where = {
        deleteStatus: false,
    }
    if (appName) {
        where.appName = appName
    }

    Modal.findAll({
        where: where,
        include: [{ model: UserNotification, required: false, include: [{ model: User, attributes: ['username', 'fullName', 'profileImage'] }] }]
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Data fetched successfully.',
                data: data
            })
        } else {
            return res.send({
                message: 'Unable to fetch data. Notification not found.',
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
    Modal.findOne({
        where: {
            id: id,
            appName: appName,
            deleteStatus: false
        },
    }).then(data => {
        if (data) {
            return res.send({
                message: 'Data fetched successfully.',
                data: data
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch Data. Data not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {
    let appName = req.query.app
    let type = req.body.type
    let userIds = req.body.userIds
    let subject = req.body.subject
    let description = req.body.description
    let postData = new Modal({
        subject: subject,
        description: description,
        appName: appName,
        type: type,
        category: 'super_admin',
    })

    if (type === 'user') {
        if (!userIds || userIds.length === 0) {
            return res.status(422).send({
                message: 'Error: User list is empty.',
            })
        }
    }

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'notification')
        if (imageData.status) {
            postData.image = constants.FILE_PREFIX + imageData.imageName;
        } else {
            return res.status(imageData.statusCode).send({
                message: imageData.message
            })
        }
    }

    postData.save().then(async postedData => {
        let notification = postedData.toJSON()
        if (type === 'user') {
            let bulkUserNotificationData = []
            userIds.map(item => {
                bulkUserNotificationData.push({ userId: item, notificationId: postedData.id })
                let notificationData = {
                    title: subject,
                    body: description,
                    userId: item,
                    data: {}
                }
                notification_helper.sendNotification(notificationData, appName)
            })
            await UserNotification.bulkCreate(bulkUserNotificationData)
            Modal.findOne({
                where: { id: notification.id },
                include: [{ model: UserNotification, required: false, include: [{ model: User, attributes: ['username', 'fullName', 'profileImage'] }] }]
            }).then(data => {
                if (data) {
                    return res.send({
                        message: 'Data fetched successfully.',
                        data: data
                    })
                } else {
                    return res.send({
                        message: 'Unable to fetch data. Notification not found.',
                        data: {}
                    })
                }
            }).catch(err => {
                console.log(err);
                return respondWithError(req, res, '', null, 500)
            })
        } else {
            return res.send({
                message: 'Notification has been added successfully.',
                data: notification
            })
        }

    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {
    let appName = req.query.app
    let updateData = {
        id: req.body.id,
        subject: req.body.subject,
        description: req.body.description,
        type: req.body.type
    }

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'notification')
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
            id: req.body.id,
            appName: appName,
            deleteStatus: false
        },
    }).then(async data => {
        if (data && data[0]) {
            let updatedData = await Modal.findOne({ where: { id: req.body.id } })
            return res.send({
                message: 'Notification has been updated successfully.',
                data: updatedData
            })
        } else {
            return res.status(400).send({
                message: 'Unable to update Modal. Notification not found.',
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

    Modal.update({ deleteStatus: true }, {
        where: {
            deleteStatus: false,
            id: id,
            appName: appName
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Notification has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete Modal. Notification not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
