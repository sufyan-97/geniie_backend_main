const Device = require('../app/SqlModels/Device');
const Notification = require('../app/SqlModels/Notification');
const SystemApp = require('../app/SqlModels/SystemApp');
const UserNotification = require('../app/SqlModels/UserNotification');

//helper
const socketHelper = require('../helpers/socketHelper')

module.exports = {

	// send firebase notification
	sendNotification: function (notificationData, appName = null) {
		return new Promise(async (resolve, reject) => {
			let userId = notificationData.userId
			// console.log(userId, appName);
			if (userId) {
				let systemAppWhere = {}
				if (appName) {
					systemAppWhere.slug = appName
				}
				// console.log("SYSTEM APP WHERE", systemAppWhere);
				let deviceData = await Device.findOne({ where: { userId: userId }, attributes: ['fireBaseDeviceToken', "isIos"], include: { model: SystemApp, where: systemAppWhere, attributes: ['slug'] } })
				if (deviceData) {
					// console.log("deviceData", JSON.stringify(deviceData));
					notificationData.deviceToken = deviceData.fireBaseDeviceToken
					notificationData.system_app = deviceData.system_app
					notificationData.data = notificationData.data
					let appSlug = deviceData.system_app.slug
					// console.log(appSlug)
					const fireBaseAdmin = await require('../../config/fireBase')
					try {
						let deviceToken = notificationData.deviceToken
						let title = notificationData.title
						let body = notificationData.body
						let data = { data: JSON.stringify({ title, body, ...notificationData.data }) }
						// this.saveNotification(notificationData.title)
						let dataToSend = {
							'data': data
						}
						if (deviceData.isIos) {
							dataToSend.notification = {
								'title': title,
								'body': body,
							}
						}
						// console.log("Notification Data:", dataToSend)


						fireBaseAdmin[appSlug].messaging().sendToDevice(deviceToken, dataToSend, {
							priority: "high",
							timeToLive: 60 * 60 * 24
						})
							.then(response => {
								if (response.results[0]) {
									console.log(response.results[0].error);
								}
								resolve(true)
							})
							.catch(error => {
								console.log(error);
								resolve(false)
							});
					} catch (error) {
						console.log(error);
						resolve(false)
					}
				} else {
					resolve(false)
				}
			} else {
				resolve(false)
			}
		})
	},

	// save single notification
	saveNotification: function (notificationData) {
		try {
			let dataToSave = {
				subject: notificationData.title,
				description: notificationData.body,
				appName: notificationData.system_app.appSlug,
				systemAppId: notificationData.system_app.id,
				type: 'user',
				notificationData: notificationData.data
			}
			Notification.create(dataToSave).then(data => {
				if (data) {
					UserNotification.create({
						userId: notificationData.userId,
						notificationId: data.id
					})
				}
			}).catch(error => console.log(error))
		} catch (error) {
			console.log(error);
		}
	},

	// send and save socket notification
	saveAndSendNotification: async function (socketInstance, socketEventName, userIds = [], subject = '', description = '', appName = 'asaap-restaurant', type = 'user', notificationData = null) {
		try {
			let notification = await Notification.create({
				subject,
				description,
				appName,
				type,
				notificationData
			})

			if (!notification) {
				return false
			}

			let userNotifications = []
			userNotifications = userIds.map((userId) => {
				return {
					userId: userId,
					notificationId: notification.id
				}
			})

			let savedUserNotifications = await UserNotification.bulkCreate(userNotifications)
			// console.log('savedUserNotification', savedUserNotifications)

			if (!savedUserNotifications) {
				return false
			}

			let notificationParsed = notification.toJSON()
			notificationParsed.status = 'unread'


			if (!socketInstance) {
				return false
			}

			if (typeof socketInstance === 'object') {
				await socketHelper.socketPushDataWithInstance(socketInstance, socketEventName, notification, userIds)
			} else {
				await socketHelper.socketPushDataWithInstanceName(socketInstance, socketEventName, notification, userIds)
			}


			return true
		} catch (error) {
			console.log(error)
			return Promise.reject(error)
		}


	},
}
