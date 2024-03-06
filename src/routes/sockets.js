// Libraries
const Socket = require("socket.io");

// Providers
const webSocketProvider = require("../app/SocketProviders/webSocket.provider");
const consumerSocketProvider = require("../app/SocketProviders/consumerSocket.provider");
const riderSocketProvider = require("../app/SocketProviders/riderSocket.provider");
const restaurantSocketProvider = require("../app/SocketProviders/restaurantSocket.provider");

// Controllers
const socketController = require("../app/Controllers/socket.controller");

const socketSetting = (
	app,
	socketKey,
	socketIo,
	controllerCallback,
	authCallback = null
) => {
	app.set(socketKey, socketIo);

	if (authCallback) {
		socketIo.use(authCallback);
	}

	socketIo.on("connection", (instance) =>
		controllerCallback(socketIo, instance)
	);
};

module.exports = {
	webSocket: null,
	restaurantSocket: null,
	riderSocket: null,
	consumerSocket: null,
	connect: function (httpServer, app) {
		// websocket
		this.webSocket = new Socket.Server(httpServer, {
			path: "/webSocket",
		});

		socketSetting(app, "webSocket", this.webSocket, socketController.webSocketConnection, webSocketProvider);

		// consumerSocket
		this.consumerSocket = new Socket.Server(httpServer, {
			path: "/consumerSocket",
		});

		socketSetting(app, "consumerSocket", this.consumerSocket, socketController.consumerSocketConnection, consumerSocketProvider);


		// riderSocket
		this.riderSocket = new Socket.Server(httpServer, {
			path: "/riderSocket",
		});

		socketSetting(app, "riderSocket", this.riderSocket, socketController.riderSocketConnection, riderSocketProvider);

		// riderSocket
		this.restaurantSocket = new Socket.Server(httpServer, {
			path: "/restaurantSocket",
		});

		socketSetting(app, "restaurantSocket", this.restaurantSocket, socketController.restaurantSocketConnection, restaurantSocketProvider);
	},
};
