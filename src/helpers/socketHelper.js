// Libraries

const { Op } = require("sequelize");
const { SOCKET_EVENTS } = require("../app/Constants/app.constants");
const User = require("../app/SqlModels/User");

// Helpers

// console.log(webIo, deviceIo, baseIo)
// const device_helpers = require('../helper/device_helpers.js');
// const general_helpers = require('./general_helper.js');

// Constants
// const Constants = require('../constants/Application');

module.exports = {
	socketConnected: async (instance, user, userType = 'user') => {
		try {
			console.log(`${userType} connected:`, user.id, user.email);
			user.isOnline = true
			user.socketId = instance.id
			await user.save()
			return user;
		} catch (error) {
			return reject(error);
		}
	},
	socketDisconnected: async (instance, user, userType = 'user') => {
		try {
			console.log(`${userType} disconnected:`, user.id, user.email);
			if (user.socketId === instance.id) {
				user.socketId = null;
				user.isOnline = false;
				await user.save()
			} else {
				console.log('logged in from another device')
			}

			return user;
		} catch (error) {
			return reject(error);
		}
	},
	socketPushDataWithInstance: async (socketInstance, eventName, payload, userIds = []) => {
		try {
			if (!socketInstance) {
				console.log('instance Not Provided');
				return false
			}

			if (userIds && userIds.length) {
				let users = await User.findAll({
					where: { id: { [Op.in]: userIds }, deleteStatus: false },
				});
				if (users && users.length) {
					users.map((user) => {
						if (user.socketId) {
							socketInstance.to(user.socketId)
								.emit(eventName, payload);
						}
					});
				}
			} else {
				socketInstance.emit(eventName, payload);
			}
			return true
		} catch (error) {
			console.log(error);
			return false;
		}
	},

	socketPushDataWithInstanceName: async (socketInstanceName, eventName, payload, userIds = []) => {
		try {
			let baseSocket = require("../routes/sockets");
			if (!baseSocket || !baseSocket[socketInstanceName]) {
				return false
			}

			if (userIds && userIds.length) {
				let users = await User.findAll({
					where: { id: { [Op.in]: userIds }, deleteStatus: false },
				});
				if (users && users.length) {
					users.map((user) => {
						if (user.socketId) {
							baseSocket[socketInstanceName]
								.to(user.socketId)
								.emit(eventName, payload);
						}
					});
				}
			} else {
				baseSocket[socketInstanceName].emit(eventName, payload);
			}
			return true;
		} catch (error) {
			console.log(error);
			return false
		}
	},

	orderCancelled: async function (io, instanceName, userIds, data) {
		console.log(instanceName, userIds)
		sendSocketDataToApps(
			io,
			SOCKET_EVENTS.ORDER_CANCELLED,
			data,
			userIds,
			instanceName
		);
	},
	bookingCancelled: async function (io, instanceName, userIds, data) {
		console.log(instanceName, userIds)
		sendSocketDataToApps(
			io,
			SOCKET_EVENTS.BOOKING_CANCELLED,
			data,
			userIds,
			instanceName
		);
	},
	sendMessage: async function (io, instanceName, userIds, data) {
		// console.log(instanceName, userIds)
		sendSocketDataToApps(
			io,
			SOCKET_EVENTS.MESSAGE_RECEIVED,
			data,
			userIds,
			instanceName
		);
	},
};

async function sendSocketDataToApps(io, eventName, payload, userIds, instanceName) {
	try {
		if (io) {
			io.emit(eventName, payload);
		} else {
			let baseSocket = require("../routes/sockets");
			if (baseSocket[instanceName]) {
				console.log("device socket instance:", eventName);
				let users = await User.findAll({
					where: { id: { [Op.in]: userIds }, deleteStatus: false },
				});
				if (users && users.length) {
					users.map((user) => {
						if (user.socketId) {
							baseSocket[instanceName]
								.to(user.socketId)
								.emit(eventName, payload);
						}
					});
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}
