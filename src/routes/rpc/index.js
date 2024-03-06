// Libraries
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Constants
const constants = require("../../../config/constants");

// Controller
const billingRpc = require("../../app/Controllers/rpc/billing.rpc.js");
const notificationRpc = require("../../app/Controllers/rpc/notification.rpc.js");
const userRpc = require("../../app/Controllers/rpc/user.rpc.js");
const recentSearchController = require("../../app/Controllers/recentSearch.controller");
const mainRpc = require("../../app/Controllers/rpc/main.rpc");
const socketRpc = require("../../app/Controllers/rpc/socket.rpc");
const promotionRpc = require("../../app/Controllers/rpc/promotion.rpc");
const userController = require("../../app/Controllers/user.controller");
const chatController = require("../../app/Controllers/chat.controller");

// Definitions
const notificationDefinition = protoLoader.loadSync(
	path.join(__dirname, "../../protos/notification.proto"),
	{
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	}
);

const billingDefinition = protoLoader.loadSync(
	path.join(__dirname, "../../protos/billing.proto"),
	{
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	}
);

const userDefinition = protoLoader.loadSync(
	path.join(__dirname, "../../protos/user.proto"),
	{
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	}
);

const recentSearchDefinition = protoLoader.loadSync(
	path.join(__dirname, "../../protos/recentSearch.proto"),
	{
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	}
);

const mainDefinition = protoLoader.loadSync(
	path.join(__dirname, "../../protos/mainService.proto"),
	{
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	}
);

const socketRpcDefinition = protoLoader.loadSync(
	path.join(__dirname, "../../protos/socket.proto"),
	{
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	}
);

const promotionRpcDefinition = protoLoader.loadSync(
	path.join(__dirname, "../../protos/promotion.proto"),
	{
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	}
);

const riderDefinition = protoLoader.loadSync(path.join(__dirname, '../../protos/riderMain.proto'), {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
});

const chatRPCDefinition = protoLoader.loadSync(path.join(__dirname, '../../protos/chat.proto'), {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
});



// Load Service
const notificationPackage = grpc.loadPackageDefinition(notificationDefinition);
const billingPackage = grpc.loadPackageDefinition(billingDefinition);
const userPackage = grpc.loadPackageDefinition(userDefinition);
const recentSearchPackage = grpc.loadPackageDefinition(recentSearchDefinition);
const mainServicePackage = grpc.loadPackageDefinition(mainDefinition);
const SocketRpcPackage = grpc.loadPackageDefinition(socketRpcDefinition);
const promotionRpcPackage = grpc.loadPackageDefinition(promotionRpcDefinition);
const riderAppPackage = grpc.loadPackageDefinition(riderDefinition);
const chatRPCPackage = grpc.loadPackageDefinition(chatRPCDefinition);
// Create Server
const server = new grpc.Server();

server.bindAsync(
	`${constants.RPC_HOST}:${constants.RPC_PORT}`,
	grpc.ServerCredentials.createInsecure(),
	function (error) {
		if (error) {
			console.log(error);
			return process.exit(1);
		}

		console.log(
			`RPC-server is listening on port: ${constants.RPC_HOST}:${constants.RPC_PORT}`
		);

		// Services
		server.addService(notificationPackage.NotificationService.service, {
			SendNotification: notificationRpc.SendFireBaseNotification,
		});

		server.addService(billingPackage.BillingService.service, {
			ServiceTransaction: billingRpc.serviceTransaction,
			GetPaymentMethods: billingRpc.getPaymentMethods,
			CheckPromoAvailability: billingRpc.checkPromoAvailability,
			AddPromoHistory: billingRpc.addPromoHistory,
			refundToWallet: billingRpc.refundToWallet,
		});

		server.addService(userPackage.UserService.service, {
			GetRiders: userRpc.getRiders,
			GetUsers: userRpc.getUsers,
			GetUsersByType: userRpc.getUsersByType,
			ChangeUserStatus: userRpc.ChangeUserStatus,
			UpdateUserRewardPoints: userRpc.UpdateUserRewardPoints,
			verifyRestaurantRider: userRpc.verifyRestaurantRider,
		});

		server.addService(recentSearchPackage.RecentSearhService.service, {
			SaveRecentSearch: recentSearchController.saveRecentSearchRpc,
		});

		server.addService(mainServicePackage.MainService.service, {
			GetAppControls: mainRpc.getAppControls,
			CreateUser: mainRpc.createRestaurantUser,
			UpdateUser: mainRpc.updateRestaurantUser,
			BroadcastBranchRegistrationNotification: mainRpc.broadcastBranchRegistrationNotification,
			BroadcastBranchAcceptRejectNotification: mainRpc.BroadcastBranchAcceptRejectNotification,
			SendEmail: mainRpc.SendEmail,
			SendEmailByUserId: mainRpc.SendEmailByUserId,
			GetRoles: mainRpc.GetRoles,
			AddBranchBankAccountDetails: mainRpc.AddBranchBankAccountDetails,
			CreateTicket: mainRpc.CreateTicket,
			GetDepartments: mainRpc.GetDepartments,
			CreateActionHistory: mainRpc.CreateActionHistory,
		});

		server.addService(SocketRpcPackage.SocketRPC.service, {
			SendEvent: socketRpc.sendEvent,
			SendAndSaveNotification: socketRpc.SendAndSaveNotification
		});

		server.addService(promotionRpcPackage.PromotionService.service, {
			getPromotionList: promotionRpc.getPromotionList,
			getPromotion: promotionRpc.getPromotion
		})

		server.addService(riderAppPackage.riderRPCMain.service, {
			updateRiderStatus: userController.updateRiderStatus
		});

		server.addService(chatRPCPackage.ChatRPC.service, {
			deactivateConversation: chatController.deactivateConversation,
			bulkDeactivateConversation: chatController.bulkDeactivateConversation
		});

		// Start Server
		server.start();
	}
);
