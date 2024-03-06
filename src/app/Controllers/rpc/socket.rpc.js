// Libraries

// Custom Libraries
const socketBase = require("../../../routes/sockets");

// Helpers
const socketHelper = require("../../../helpers/socketHelper");
const notificationHelper = require("../../../helpers/notification_helper");



exports.sendEvent = function (call, callback) {
	console.log(call.request);
	let instanceName = call.request.instanceName;
	if (instanceName) {
		let instanceSocket = socketBase[instanceName];
		if (instanceSocket) {
			let socketEventName = call.request.socketEventName;
			let data = call.request.data ? JSON.parse(call.request.data) : {};
			let socketHelperFunction = socketHelper[socketEventName];
			if (socketHelperFunction) {
				let userIds = call.request.userIds;
				socketHelperFunction(null, instanceName, userIds, data);
			}
		}
	}
	callback();
};

exports.SendAndSaveNotification = async function (call, callback) {
	try {
		console.log(call.request);
		let socketInstance = call.request.socketInstance;
		if (!socketInstance) {
			callback({
				message: 'Instance not defined'
			})
		}

		let socketEventName = call.request.socketEventName;
		let userIds = (call.request.userIds && call.request.userIds.length) ? call.request.userIds : []
		let subject = call.request.subject
		let description = call.request.description
		let appName = call.request.appName
		let type = call.request.type
		let notificationData = call.request.notificationData ? JSON.parse(call.request.notificationData) : {};
		await notificationHelper.saveAndSendNotification(socketInstance, socketEventName, userIds, subject, description, appName, type, notificationData)

		callback(null, {});
	} catch (error) {
		callback(error)
	}
}