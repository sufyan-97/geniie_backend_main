
// const { Op } = require('sequelize')
const notification_helper = require("../../../helpers/notification_helper")

// Modals

const Device = require('../../SqlModels/Device')
const SystemApp = require("../../SqlModels/SystemApp")

exports.SendFireBaseNotification = async function (call, callback) {
    try {
        let notificationData = {
            ...call.request
        }
        let userId = notificationData.userId
        notificationData.data = JSON.parse(notificationData.data)
        let isNotificationSent = await notification_helper.sendNotification(notificationData)
        console.log("User Id", userId, "Is notification sent to user", isNotificationSent);
        callback(null, { success: isNotificationSent })
    } catch (error) {
        callback(null, { success: false })
    }
}
