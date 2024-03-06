// Libraries
const moment = require('moment');
const axios = require('axios');
const { Op } = require('sequelize');

// Custom libraries
const rpcClient = require("../../lib/rpcClient");

// Models
const models = require('../MongoModels/Chat');
const conversations = models.conversations;
const messages = models.messages;
const User = require('../SqlModels/User');
const Role = require('../SqlModels/Role');


const sockets = require('../../routes/sockets');

// helpers
const socketHelper = require('../../helpers/socketHelper');
const { respondWithError } = require('../../helpers/httpHelper');
const { sendNotification } = require('../../helpers/notification_helper');
// const { SUB_ADMIN } = require('../../constants/application');

// constants
const constants = require('../../../config/constants');
const events = require('../Constants/chat');

exports.sendMessage = async function (req, res) {
	if (!req.body.receiver || !req.body.message) {
		return res.status(400).send({
			message: 'message is required'
		});
	} else {
		// console.log(req.body);
		let msg = req.body.message;
		let receiverInfo = req.body.receiverInfo;
		let receiver = req.body.receiver;
		let receiverType = receiverInfo.type;
		let orderId = req.body.orderId;
		let sender = req.user.id;
		if (sender == receiver) {
			return res.status(422).send({
				message: 'Error: Invalid Data. You cannot send message to your self.'
			});
		}

		if (msg.length < 1 || msg.trim().length < 1) {
			return res.status(400).send({
				message: 'blank messages are not allowed'
			});
		} else {
			let receiverUserData = await User.findOne({
				where: { id: receiver }, include: [{
					model: Role,
					where: {
						roleName: receiverType,
						isActive: true
					}
				}]
			})
			if (!receiverUserData) {
				return res.status(400).send({
					message: 'Error: Receiver User Data is not found.'
				});
			}

			// Get Order Here
			rpcClient.OrderRPC.VerifyUserOrder({
				orderId: orderId,
				sender: sender,
				receiver: receiver,
			}, (error, respConfirmOrder) => {
				console.log(error, respConfirmOrder)
				if (error) {
					console.log(error)
					return respondWithError(req, res, 'Unable to verify order', null, 500)
				}
				if (!respConfirmOrder.status) {
					return respondWithError(req, res, respConfirmOrder.message, null, 400)

				}

				conversations.findOne({
					is_deleted: false,
					$or: [
						{ $and: [{ sender: sender }, { receiver: receiver }] },
						{ $and: [{ receiver: sender }, { sender: receiver }] },
					],
					orderId: orderId
				}, function (err, conversation) {
					if (err || conversation === null) {
						new conversations({
							sender: sender,
							receiver: receiver,
							orderId: orderId
						}).save(function (e, th) {
							if (e) {
								res.status(400).send({
									message: 'failed to create conversation'
								});
							} else {

								new messages({
									message: msg,
									receiver: receiver,
									sender: sender,
									conversation_id: th._id
								}).save(function (er, message) {
									if (er) {
										res.status(400).send({
											status: false,
											message: 'failed to send message'
										})
									} else {

										if (receiverType === 'user') {
											console.log('rider sent a message')
											if (receiverUserData.isOnline) {
												socketHelper.sendMessage(null, 'consumerSocket', [receiver], { data: { messageData: message, conversation: th } })
											} else {
												let notificationData = {
													title: "New Message Received.",
													body: msg,
													userId: receiverUserData.id,
													data: {
														action: "new_message", messageId: message._id, conversation: th._id, data: {
															id: Number(orderId)
														}
													}
												}
												sendNotification(notificationData, 'asaap')
											}
										} else if (receiverType === 'rider') {
											console.log('user sent a message')

											if (receiverUserData.isOnline) {
												socketHelper.sendMessage(null, 'riderSocket', [receiver], { data: { messageData: message, conversation: th } })
											} else {
												let notificationData = {
													title: "New Message Received.",
													body: msg,
													userId: receiverUserData.id,
													data: {
														action: "new_message", messageId: message._id, conversation: th._id, data: {
															id: Number(orderId)
														}
													}
												}
												sendNotification(notificationData, 'rider')
											}
											// sockets.riderSocket.to(receiver).emit(events.MESSAGE_RECEIVED, { message: message, conversation: data });
										}
										return res.send({
											data: {
												messageData: message,
												conversation: th
											}
										});
									}
								});
							}
						});
					} else {
						if (conversation.isActive) {
							conversations.findByIdAndUpdate({ _id: conversation._id, orderId: orderId }, { is_deleted: false, update_time: new Date() }, { new: true, useFindAndModify: false }, function (err, data) {
								if (err) {
									res.status(400).send({
										status: false,
										message: 'failed to send message'
									});
								} else {
									new messages({
										message: msg,
										receiver: receiver,
										sender: sender,
										conversation_id: conversation._id
									}).save(function (er, message) {
										if (er) {
											res.status(400).send({
												status: false,
												message: 'failed to send message'
											})
										} else {
											if (receiverType === 'user') {
												console.log('rider sent a message')

												if (receiverUserData.isOnline) {
													socketHelper.sendMessage(null, 'consumerSocket', [receiver], { data: { messageData: message, conversation: data } })
												} else {
													let notificationData = {
														title: "New Message Received.",
														body: msg,
														userId: receiverUserData.id,
														data: {
															action: "new_message", messageId: message._id, conversation: data._id, data: {
																id: Number(orderId)
															}
														}
													}
													sendNotification(notificationData, 'asaap')
												}
											} else if (receiverType === 'rider') {
												console.log('user sent a message')

												if (receiverUserData.isOnline) {
													socketHelper.sendMessage(null, 'riderSocket', [receiver], { data: { messageData: message, conversation: data } })
												} else {
													let notificationData = {
														title: "New Message Received.",
														body: msg,
														userId: receiverUserData.id,
														data: {
															action: "new_message", messageId: message._id, conversation: data._id, data: {
																id: Number(orderId)
															}
														}
													}
													sendNotification(notificationData, 'rider')
												}
												// sockets.riderSocket.to(receiver).emit(events.MESSAGE_RECEIVED, { message: message, conversation: data });
											}

											return res.send({
												message: 'Message sent successfully',
												data: {
													messageData: message,
													conversation: conversation
												}
											});
										}
									});
								}
							});
						} else {
							return res.status(400).send({
								message: 'Error: Conversation is INACTIVE. You cannot send message.'
							});
						}
					}
				});
			})



		}
	}
};

exports.getMyConversations = async function (req, res) {
	let user = req.user;
	let size = req.query.size ? Number(req.query.size) : 10;
	let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
	let offset = 0;
	if (pageNo > 1) {
		offset = size * pageNo - size;
	}
	let pagination = {};
	pagination.limit = size;
	pagination.skip = offset;
	pagination.pageNo = pageNo;
	conversations.find({
		is_deleted: false,
		$or: [
			{ sender: user.id },
			{ receiver: user.id }
		]
	}, {}, { ...pagination }).sort('-update_time').then(async (conversations) => {

		let conversationIds = []
		let userIds = []
		conversations.forEach(item => {
			conversationIds.push(item._id)
			if (item.sender !== user.id) {
				userIds.push(item.sender)
			} else {
				userIds.push(item.receiver)
			}
		})
		let lastMessages = await messages.aggregate([
			{ $match: { conversation_id: { $in: conversationIds } } },
			{ $sort: { createdAt: -1 } },
			{
				$group: {
					_id: "$conversation_id",
					message: { $first: "$$ROOT" }
				}
			}
		])

		let users = await User.findAll({ where: { id: { [Op.in]: userIds } }, attributes: ["id", "firstName", "lastName"] })

		let dataToSend = []
		conversations.map(item => {
			let itemData = item.toJSON()
			let user = users.find(userData => itemData.sender === userData.id || itemData.receiver === userData.id)
			let lastMessage = lastMessages.find(messageData => (messageData._id).toString() == (itemData._id).toString())
			itemData.user = user
			itemData.lastMessage = lastMessage.message
			dataToSend.push(itemData)
		})

		res.send({
			status: true,
			data: dataToSend
		});
	}).catch((err) => {
		console.log(err)
		res.status(400).send({
			data: []
		});
	});
};

exports.getMessages = async function (req, res) {
	let user_id = req.user.id
	console.log(user_id);

	let size = req.query.size ? Number(req.query.size) : 10;
	let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
	let offset = 0;

	if (pageNo > 1) {
		offset = size * pageNo - size;
	}

	conversations.findOne({
		is_deleted: false,
		$or: [
			{ $and: [{ sender: user_id }, { orderId: req.query.orderId }] },
			{ $and: [{ receiver: user_id }, { orderId: req.query.orderId }] },
		]
	}, async function (error, conversation) {
		if (error) {
			return res.status(400).send({
				message: 'Error: Internal server error'
			})
		}

		if (conversation) {
			let $filter = {
				conversation_id: conversation._id,
				is_deleted: false
			}

			let oppositeUserCondition = {
				id: conversation.receiver
			}

			if (conversation.receiver === user_id) {
				oppositeUserCondition.id = conversation.sender
			}

			let oppositeUser = await User.findOne({
				where: oppositeUserCondition,
				attributes: ['id', 'firstName', 'lastName', 'username']
			})
			if (req.query.last) {
				$filter._id = { $lt: req.query.last };
			}

			messages.find($filter, {}, {
				limit: size,
				skip: offset,
				pageNo: pageNo,
			}).sort({ '_id': -1 }).then((messages) => {
				return res.send({
					status: true,
					oppositeUser,
					conversation: conversation,
					data: messages
				});
			})

		} else {
			return res.send({
				data: []
			});
		}

	})

}

exports.deleteMessage = async function (req, res) {
	if (!req.body.messageId) {
		res.status(400).send({
			status: false,
			message: 'message is required'
		});
	} else {
		let messageId = req.body.messageId;
		messages.findByIdAndUpdate(messageId, { is_deleted: true }, { new: true, useFindAndModify: false }, function (err, message) {
			if (err) {
				res.status(400).send({
					status: false,
					message: 'failed to delete message'
				});
			} else {
				res.send({
					status: true,
					message: 'deleted successfully',
					messageData: message
				});
			}
		});
	}
}

exports.readMessages = async function (req, res) {
	if (!req.body.conversations || !req.body.conversations.length) {
		return res.status(400).send({
			status: false,
			message: 'conversation is required'
		});
	}

	let conversationsList = req.body.conversations;
	let user = req.user.id;
	messages.updateMany({ conversation_id: { $in: conversationsList }, receiver: user, is_deleted: false }, { is_read: true }, { new: true }, function (er, results) {
		if (er) {
			res.status(400).send({
				status: false,
				message: 'could not modify the conversation'
			});
		} else {
			console.log(results);
			res.send({
				status: true,
				message: 'conversation updated'
			});
		}
	});
}

exports.readMessage = async function (req, res) {
	if (!req.body.conversationId) {
		res.status(400).send({
			status: false,
			message: 'conversation is required'
		});
	} else {
		let conversationId = req.body.conversationId;
		let user = req.user.id;

		let receiverType = req.body.type;


		messages.updateMany({
			conversation_id: conversationId,
			receiver: user,
			is_deleted: false
		}, {
			is_read: true
		}, { new: true }, async function (er, results) {
			if (er) {
				return res.status(400).send({
					status: false,
					message: 'could not modify the conversation'
				});
			}

			let msg = await messages.findOne({
				conversation_id: conversationId,
				receiver: user,
				is_deleted: false
			})
			// here to send socket
			if (msg) {
				if (receiverType === 'user') {
					sockets.consumerSocket.to(msg.sender).emit(events.MESSAGE_READ, {});
				} else if (receiverType === 'rider') {
					sockets.riderSocket.to(msg.sender).emit(events.MESSAGE_READ, {});
				}
			}

			return res.send({
				status: true,
				message: 'conversation updated'
			});
		});
	}
}

exports.deleteMessage = async function (req, res) {
	if (!req.params.msgId) {
		res.status(400).send({
			status: false,
			message: 'message is required'
		});
	} else {
		let messageId = req.params.msgId;
		messages.findByIdAndUpdate(messageId, { is_deleted: true }, { new: true, useFindAndModify: false }, function (err, message) {
			if (err) {
				res.status(400).send({
					status: false,
					message: 'failed to delete message'
				});
			} else {
				sockets.baseIo.to(message.receiver).emit(events.MESSAGE_DELETED, message._id);
				res.send({
					status: true,
					message: 'deleted successfully',
					messageData: message
				});
			}
		});
	}
}

exports.deleteConversation = async function (req, res) {
	if (!req.params.convId) {
		res.status(400).send({
			status: false,
			message: 'conversation is required'
		});
	} else {
		let conversation_id = req.params.convId;
		conversations.findByIdAndUpdate(conversation_id, { is_deleted: true }, { new: true }, function (err, conversation) {
			if (err) {
				res.status(400).send({
					status: false,
					message: 'failed to delete conversation'
				});
			} else {
				messages.updateMany({ conversation_id: conversation_id }, { is_deleted: true }, function (er, message) {
				});
				sockets.baseIo.to(conversation.receiver).emit(events.CONVERSATION_DELETED, conversation._id);
				res.send({
					status: true,
					message: 'conversation deleted successfully',
					conversation: conversation
				});
			}
		})
	}
}

exports.getNotifications = async function (req, res) {
	let user = req.user
	let receiver = user.id;
	messages.aggregate([
		{
			$match: {
				is_deleted: false,
				is_read: false,
				receiver: receiver,
			}
		}
		, {
			$group: {
				"_id": "$sender",
				"conversation_id": { "$first": "$conversation_id" },
				"count": {
					$sum: 1
				}
			}
		}
	]).exec().then(data => {

		return res.send({
			status: true,
			message: 'count successfully',
			count: data
		});

	}).catch(err => {
		console.log(err);
		res.status(400).send({
			status: false,
			message: 'could not count the notifications'
		});
	});
}


exports.deactivateConversation = async function (call, callBack) {
	try {
		console.log(call.request)
		let orderId = call.request.orderId
		if (!orderId) {
			callBack(null, { status: false, message: "Error: Order Id is required" })
		}
		conversations.findOneAndUpdate({ orderId: orderId }, { isActive: false }, { new: true }, function (err, conversation) {
			if (err) {
				callBack(null, { status: false, message: "Error: Internal Server Error." })
			} else {
				callBack(null, { status: true, message: "Success: Conversation deactivated successfully." })
			}
		})
	} catch (error) {
		console.log(error)
		callBack(null, { status: false, message: "Error: Internal Server Error." })
	}

}


exports.bulkDeactivateConversation = async function (call, callBack) {
	try {
		console.log(call.request)
		let orderIds = call.request.orderIds
		if (!orderIds || !orderIds.length) {
			callBack(null, { status: false, message: "Error: Order Id is required" })
		}
		conversations.findOneAndUpdate({ orderId: { $in: orderIds } }, { isActive: false }, { new: true }, function (err, conversation) {
			if (err) {
				callBack(null, { status: false, message: "Error: Internal Server Error." })
			} else {
				callBack(null, { status: true, message: "Success: Conversation deactivated successfully." })
			}
		})
	} catch (error) {
		console.log(error)
		callBack(null, { status: false, message: "Error: Internal Server Error." })
	}

}
