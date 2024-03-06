//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')

// Modals
var NotificationSetting = require('../SqlModels/NotificationSetting');
var UserNotificationSetting = require('../SqlModels/UserNotificationSetting');

exports.getAll = async function (req, res) {

    let additionalCheck = {}
    if (req.user.is_guest_user) {
        additionalCheck.login_required = 0
    }

    NotificationSetting.findAll({
        where:
        {
            deleteStatus: false,
            ...additionalCheck
        },
        include: [
            {
                model: UserNotificationSetting,
                where: {
                    userId: req.user.id
                },
                required: false
            }
        ]
    }).then(data => {
        if (data && data.length) {
            let requiredData = []
            data.map(item => {
                let itemData = {
                    id: item.id,
                    name: item.name,
                    value: false
                }
                if (item.user_notification_setting) {
                    itemData.value = item.user_notification_setting.value
                }
                requiredData.push(itemData)
            })

            return respondWithSuccess(req, res, 'Notification Settings data fetched successfully', requiredData, 200, 'notificationSettings')

        } else {
            return respondWithSuccess(req, res, 'Unable to fetch notification setting. Notification Settings not found.', [], 200, 'notificationSettings')
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500);
    })
}

exports.update = async function (req, res) {

    NotificationSetting.findOne({
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
        include: [
            {
                model: UserNotificationSetting,
                where: {
                    userId: req.user.id
                },
                required: false
            }
        ]
    }).then(async data => {
        if (data) {
            if (data.user_notification_setting) {
                data.user_notification_setting.value = req.body.value
                data.user_notification_setting.save()
                // UserNotificationSetting.update({ value: req.body.value })
            } else {
                let userNotificationSetting = new UserNotificationSetting({
                    notificationId: req.body.id,
                    userId: req.user.id,
                    value: req.body.value
                })
                await userNotificationSetting.save()
            }

            return respondWithError(req, res, 'Notification Settings has been updated successfully', null, 400)

        } else {
            return respondWithError(req, res, 'Unable to fetch notification setting. Notification Settings not found', null, 400)
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500);
    })
}
