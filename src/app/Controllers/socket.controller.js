// Libraries
const { Op } = require("sequelize");

// Services
// const MainService = require("../../services/MainService");
const rpcClient = require('../../lib/rpcClient')

// Models
const User = require("../SqlModels/User");
const Role = require("../SqlModels/Role");

// Helpers
const socketHelper = require('../../helpers/socketHelper')
// Constants
const appConstants = require('../Constants/app.constants')

// ************ GET USERS ************ //
exports.webSocketConnection = async function (baseInstance, instance) {
	const user = instance.handshake.user;
	try {
		// Socket stuff here
		await socketHelper.socketConnected(instance, user);

	} catch (error) {
		console.log(error);
		// instance.disconnect()
	}

	instance.on(appConstants.SOCKET_EVENTS.DISCONNECT, async () => {
		try {
			await socketHelper.socketDisconnected(instance, user)

		} catch (error) {
			console.log(error);
		}
	});

	instance.on(appConstants.SOCKET_EVENTS.CONNECT_ERROR, (error) => {
		console.log("connection_error_occurred: " + error);
	});

	instance.on(appConstants.SOCKET_EVENTS.CONNECT_TIMEOUT, (timeout) => {
		console.log("connection_timeout: ", timeout);
	});

	instance.on(appConstants.SOCKET_EVENTS.ERROR, (error) => {
		console.log("error_occurred: ", error);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT, (attemptNumber) => {
		console.log("reconnecting: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_ATTEMPT, (attemptNumber) => {
		console.log("reconnect_attempt: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECTING, (attemptNumber) => {
		console.log("reconnecting: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_ERROR, (error) => {
		console.log("reconnect_error: ", error);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_FAILED, () => {
		console.log("reconnect_failed: ");
	});

	instance.on(appConstants.SOCKET_EVENTS.PING, () => {
		console.log("ping: ");
	});

	instance.on(appConstants.SOCKET_EVENTS.PONG, (latency) => {
		console.log("pong: ", latency);
	});
};

// ************ GET USERS ************ //
exports.consumerSocketConnection = async function (baseInstance, instance) {
	const user = instance.handshake.user;
	try {
		await socketHelper.socketConnected(instance, user, 'consumer');
	} catch (error) {
		console.log(error)
	}

	instance.on(appConstants.SOCKET_EVENTS.DISCONNECT, async () => {
		try {
			await socketHelper.socketDisconnected(instance, user, 'consumer');
		} catch (error) {
			console.log(error);
		}
	});

	instance.on(appConstants.SOCKET_EVENTS.CONNECT_ERROR, (error) => {
		console.log("connection_error_occurred: " + error);
	});

	instance.on(appConstants.SOCKET_EVENTS.CONNECT_TIMEOUT, (timeout) => {
		console.log("connection_timeout: ", timeout);
	});

	instance.on(appConstants.SOCKET_EVENTS.ERROR, (error) => {
		console.log("error_occurred: ", error);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT, (attemptNumber) => {
		console.log("reconnecting: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_ATTEMPT, (attemptNumber) => {
		console.log("reconnect_attempt: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECTING, (attemptNumber) => {
		console.log("reconnecting: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_ERROR, (error) => {
		console.log("reconnect_error: ", error);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_FAILED, () => {
		console.log("reconnect_failed: ");
	});

	instance.on(appConstants.SOCKET_EVENTS.PING, () => {
		console.log("ping: ");
	});

	instance.on(appConstants.SOCKET_EVENTS.PONG, (latency) => {
		console.log("pong: ", latency);
	});
};

exports.riderSocketConnection = async function (baseInstance, instance) {
	const rider = instance.handshake.user;
	// console.log(rider);

	try {
		await socketHelper.socketConnected(instance, rider, 'rider');

		rpcClient.riderRPC.updateOnlineStatus({ status: true, userId: rider.id }, function (err, response) {
			if (err) {
				console.log(err)
			} else {
				// return res.send(response)
				console.log(response)
			}
		})
	} catch (error) {
		console.log(error)
	}


	instance.on(appConstants.SOCKET_EVENTS.UPDATE_LOCATION, (socketPayload) => {
		if (rider.socketId !== instance.id) {
			return;
		}

		console.log('testing:', rider.id, socketPayload.longitude, socketPayload.latitude)
		if (socketPayload.longitude && socketPayload.latitude) {
			rpcClient.riderRPC.updateRiderLocation({ longitude: socketPayload.longitude, latitude: socketPayload.latitude, userId: rider.id }, async function (err, response) {
				if (err) {
					console.log('UPDATE_LOCATION_ERROR', err.message)
					return
				}

				try {
					// console.log(response)

					let orders = JSON.parse(response.data);

					let orderIds = []

					for (let i = 0; i < orders.length; i++) {
						const orderData = orders[i];
						socketHelper.socketPushDataWithInstanceName('consumerSocket', appConstants.SOCKET_EVENTS.RIDER_LOCATION, {
							...socketPayload,
							orderId: orderData.orderId
						}, [orderData.userId]);

						orderIds.push(orderData.orderId)
					}

					// get admin, agent ids
					const userIds = []
					const users = await User.findAll({
						where: {
							deleteStatus: false,
						},
						attributes: ['id'],
						include: [
							{
								model: Role,
								where: {
									roleName: {
										[Op.in]: ['admin']
									},
									isAgent: true,
								},
								attributes: [],
							}
						]
					})

					users.forEach(user => {
						userIds.push(user.id)
					});

					socketHelper.socketPushDataWithInstanceName('webSocket', appConstants.SOCKET_EVENTS.RIDER_LOCATION, {
						...socketPayload,
						orderIds: orderIds
					}, userIds)



				} catch (error) {
					console.log('UPDATE_LOCATION_ERROR', error.message)

				}
			})
		}
	});

	instance.on(appConstants.SOCKET_EVENTS.DISCONNECT, async () => {
		await socketHelper.socketDisconnected(instance, rider, 'rider');
		rpcClient.riderRPC.updateOnlineStatus({ status: false, userId: rider.id }, function (err, response) {
			if (err) {
				console.log(err)
			} else {
				// return res.send(response)
				console.log(response)
			}
		})
	});

	instance.on(appConstants.SOCKET_EVENTS.CONNECT_ERROR, (error) => {
		console.log("connection_error_occurred: " + error);
	});

	instance.on(appConstants.SOCKET_EVENTS.CONNECT_TIMEOUT, (timeout) => {
		console.log("connection_timeout: ", timeout);
	});

	instance.on(appConstants.SOCKET_EVENTS.ERROR, (error) => {
		console.log("error_occurred: ", error);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT, (attemptNumber) => {
		console.log("reconnecting: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_ATTEMPT, (attemptNumber) => {
		console.log("reconnect_attempt: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECTING, (attemptNumber) => {
		console.log("reconnecting: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_ERROR, (error) => {
		console.log("reconnect_error: ", error);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_FAILED, () => {
		console.log("reconnect_failed: ");
	});

	instance.on(appConstants.SOCKET_EVENTS.PING, () => {
		console.log("ping: ");
	});

	instance.on(appConstants.SOCKET_EVENTS.PONG, (latency) => {
		console.log("pong: ", latency);
	});
};

exports.restaurantSocketConnection = async function (baseInstance, instance) {
	const user = instance.handshake.user;
	try {
		// Socket stuff here
		await socketHelper.socketConnected(instance, user, 'Restaurant User')

	} catch (error) {
		console.log(error);
	}

	instance.on(appConstants.SOCKET_EVENTS.DISCONNECT, async () => {
		try {
			await socketHelper.socketDisconnected(instance, user, 'Restaurant User')
		} catch (error) {
			console.log(error);
		}
	});

	instance.on(appConstants.SOCKET_EVENTS.CONNECT_ERROR, (error) => {
		console.log("connection_error_occurred: " + error);
	});

	instance.on(appConstants.SOCKET_EVENTS.CONNECT_TIMEOUT, (timeout) => {
		console.log("connection_timeout: ", timeout);
	});

	instance.on(appConstants.SOCKET_EVENTS.ERROR, (error) => {
		console.log("error_occurred: ", error);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT, (attemptNumber) => {
		console.log("reconnecting: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_ATTEMPT, (attemptNumber) => {
		console.log("reconnect_attempt: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECTING, (attemptNumber) => {
		console.log("reconnecting: ", attemptNumber);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_ERROR, (error) => {
		console.log("reconnect_error: ", error);
	});

	instance.on(appConstants.SOCKET_EVENTS.RECONNECT_FAILED, () => {
		console.log("reconnect_failed: ");
	});

	instance.on(appConstants.SOCKET_EVENTS.PING, () => {
		console.log("ping: ");
	});

	instance.on(appConstants.SOCKET_EVENTS.PONG, (latency) => {
		console.log("pong: ", latency);
	});
};
