// Libraries
const path = require('path');
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const axios = require('axios');

// Custom Libraries
const { sendEmailV2 } = require('../../../lib/email');
const emailQueue = require('../../../../src/lib/emailWorker');

// Configs
const { sequelize_conn } = require('../../../../config/database');

// helpers
const socketHelper = require('../../../helpers/socketHelper');
const general_helper = require('../../../helpers/general_helper');

// Models
const AppControls = require("../../SqlModels/AppControl");
const BankAccount = require("../../SqlModels/BankAccount");
const User = require('../../SqlModels/User');
const Role = require('../../SqlModels/Role');
const UserNotification = require('../../SqlModels/UserNotification');
const Notification = require('../../SqlModels/Notification');
const ActionHistory = require('../../SqlModels/ActionHistory');

// constants
const app_constants = require('../../Constants/app.constants');
const configConstants = require('../../../../config/constants');

const { Op } = require('sequelize');

exports.getAppControls = function (call, callback) {
	AppControls.findAll({
		where: {
			deleteStatus: false,
		}
	}).then(data => {
		if (data && data.length) {
			return callback(null, {

				status: true,
				data: JSON.stringify(data)
			})
		} else {
			return callback(null, {

				status: true,
				data: ''
			})
		}
	}).catch(err => {
		console.log(err);
		return callback({
			message: 'Internal Server Error.',
		})
	})
}

exports.createRestaurantUser = async function (call, callback) {
	const sequelizeTransaction = await sequelize_conn.transaction();
	try {
		let reqData = call.request
		let n = 10;
		let number = reqData.phoneNumber.substring(reqData.phoneNumber.length - n)
		// console.log(reqData)

		let restaurantUser = await User.findOne({
			where: {
				[Op.or]: [
					{
						email: reqData.email,
					},
					{
						number: number
					}
				]
			},
			include: [{
				model: Role,
				where: {
					roleName: {
						[Op.in]: ['provider', 'restaurant', 'rider']
					}
				}
			}]
		})

		if (restaurantUser) {
			sequelizeTransaction.rollback()
			return callback({
				message: 'User already exists'
			})
		}
		let provider = {}
		if (reqData.parentId) {
			provider = await User.findOne({
				where: {
					id: reqData.parentId
				}
			})
			if (!provider) {
				sequelizeTransaction.rollback()
				return callback({
					message: "Provider not found"
				})
			}
		}

		let userRole = await Role.findOne({
			where: {
				roleName: reqData.roleName
			},
			transaction: sequelizeTransaction
		})

		if (!userRole) {
			sequelizeTransaction.rollback()

			return callback({
				message: 'User role not found'
			})
		}

		// how to generate password
		// let password = generator.generate({
		//     length: 10,
		//     numbers: true
		// });
		console.log('provider ::', provider);
		let savedUser = await User.create({
			// firstName: reqData.name,
			firstName: provider.firstName,
			lastName: provider.lastName,
			phoneNumber: reqData.phoneNumber,
			email: reqData.email,
			username: reqData.email,
			// password: bcrypt.hashSync(password, 10),
			parentId: reqData.parentId ? reqData.parentId : null,
			number: number
		}, {
			transaction: sequelizeTransaction
		})

		savedUser.addRole(userRole)
		// console.log('savedUser:', savedUser)


		// send email credentials here
		// let emailTemplate = `Hello, Your Business Restaurant register on ASAP. Your app password is <b>${password}</b>.<br>`
		// sendEmailV2("Restaurant Admin created Successfully", emailTemplate, reqData.email)

		sequelizeTransaction.commit()
		return callback(null, {
			status: true,
			data: JSON.stringify(savedUser)
		})
	} catch (error) {
		sequelizeTransaction.rollback()
		console.log(error)
		return callback({
			message: "Internal Server Error."
		})
	}
}

exports.updateRestaurantUser = async function (call, callback) {
	const sequelizeTransaction = await sequelize_conn.transaction();
	try {

		let reqData = call.request;

		let userData = reqData.userData ? JSON.parse(reqData.userData) : {};
		let restaurantName = reqData.restaurantName ? reqData.restaurantName : '';

		console.log('userData:', userData)

		if (!Object.keys(userData).length && !userData.userId) {
			return callback({
				message: 'Invalid data'
			})
		}

		let user = await User.findOne({
			where: {
				id: userData.userId,
			},
			transaction: sequelizeTransaction
		})

		if (!user) {
			sequelizeTransaction.rollback()
			return callback({
				message: 'User does not exists'
			})
		}

		let password = null
		if (userData.generatePass) {
			password = generator.generate({
				length: 10,
				numbers: true
			});

			user.password = bcrypt.hashSync(password, 10);
		}

		for (var key in userData) {
			user[key] = userData[key]
		}

		await user.save({ transaction: sequelizeTransaction })

		if (userData.generatePass) {

			let provider = await User.findOne({
				where: {
					id: user.parentId,
				},
				transaction: sequelizeTransaction
			})

			let emails = [{
				name: `Restaurant User Approved for Restaurant User`,
				data: {
					subject: "Restaurant Admin created Successfully",
					to: user.email,
					template: 'restaurant/restaurantCreated.pug',
					templateData: {
						password: password
					}
				}
			}, {
				name: `Restaurant User Approved for Provider`,
				data: {
					subject: "Your Restaurant Request Approved Successfully",
					to: provider.email,
					template: 'business/restaurantCreated.pug',
					templateData: {
						restaurantEmail: user.email,
						restaurantName: restaurantName
					}
				}
			}]
			emailQueue.addBulk(emails)

			// let emailResponse = await sendEmailV2('Restaurant Admin created Successfully', '', user.email, 'restaurant/restaurantCreated.pug', {
			// 	password: password
			// })
			// console.log('send Email Response => ', emailResponse)
		}

		sequelizeTransaction.commit()

		return callback(null, {
			status: true,
			data: 'user password generated successfully'//JSON.stringify(user)
		})
	} catch (error) {
		console.log(error);
		sequelizeTransaction.rollback()

		return callback({
			message: 'internal_server_error'
		})
	}
}

exports.broadcastBranchRegistrationNotification = async function (call, callback) {
	try {
		let reqData = call.request
		reqData = JSON.parse(reqData.data)
		console.log('reqData =>', reqData);

		let notificationJsonData = reqData.serviceData
		notificationJsonData.redirectionLink = '/approval_request/restaurant'

		let subject = 'Restaurant Registration', description = `${notificationJsonData.fields.requiredData.name} requested for new restaurant`

		if (reqData.status == 'update') {
			subject = "Update Restaurant"
			description = `${notificationJsonData.fields.requiredData.name} requested to approve updated data`
		}


		let notificationData = await Notification.create({
			subject: subject,
			description: description,
			appName: 'super_admin',
			type: 'user',
			notificationData: notificationJsonData,
		})

		if (notificationData) {
			// console.log(notificationData)
			let adminUser = await User.findOne({ include: { model: Role, where: { roleName: 'admin' } } })
			if (adminUser) {
				let usrNotification = await UserNotification.create({
					notificationId: notificationData.id,
					userId: adminUser.id
				})

				try {
					notificationData = notificationData.toJSON()
					notificationData.status = 'unread'
				} catch (error) {
					console.log(error)
				}

				if (usrNotification) {
					let data = await socketHelper.socketPushDataWithInstanceName('webSocket', app_constants.SOCKET_EVENTS.BROADCAST_ADMIN_NOTIFICATION, notificationData, [adminUser.id])
					console.log('socket data =>', data);
				}
			}
		}
		// callback(null, {
		//     // status: true,
		//     data: JSON.stringify(requestedData)
		// })


	} catch (error) {
		console.log(error)
		return callback({
			message: 'Internal Server Error.',
		})
	}
}

exports.BroadcastBranchAcceptRejectNotification = async function (call, callback) {
	try {
		let reqData = call.request
		// console.log('reqData =>', reqData);
		let data = reqData ? JSON.parse(reqData.data) : null;
		let provider = await User.findOne({
			where: {
				id: data.user.id
			},
		})

		if (!provider) {
			console.log(error)
			return callback({
				message: 'User not found',
			})
		}



		let subject = ''
		let description = ''

		if (data.status == 'accepted') {
			subject = 'Restaurant Approve Notification'
			description = 'Your Restaurant Request Approved Successfully'
		} else {
			subject = 'Restaurant Reject Notification'
			description = 'Your Restaurant Request has been rejected by geniie'
			if (data.rejectedFields.length) {
				description = 'Some of your data rejected with reason'
			}
		}


		let notificationData = await Notification.create({
			subject: subject,
			description: description,
			appName: 'asaap-restaurant',
			type: 'user',
			notificationData: data.rejectedFields.length ? data.rejectedFields : null,
		})

		if (notificationData) {

			let userNotification = await UserNotification.create({
				notificationId: notificationData.id,
				userId: provider.id
			})

			if (userNotification) {
				let userIds = [provider.id]
				let response = socketHelper.socketPushDataWithInstanceName('webSocket', app_constants.SOCKET_EVENTS.BROADCAST_PROVIDER_NOTIFICATION, notificationData, userIds)
				if (response) {
					console.log('Notification Delivered')
				}
			}

		}

		// await sendEmailV2('Restaurant Admin created Successfully', '', provider.email, 'restaurant/restaurantFieldsRejected.pug')

		return callback(null, {
			status: true,
			data: 'data processed successfully'
		})
	} catch (error) {
		console.log(error)
		return callback({
			message: 'Internal Server Error.',
		})
	}
}

exports.SendEmail = async function (call, callback) {
	try {
		let subject = call.request.subject;
		let msg = call.request.msg;
		let to = call.request.to;
		let template = call.request.template;
		let templateData = call.request.templateData ? JSON.parse(call.request.templateData) : {};

		let emailResponse = await sendEmailV2(subject, msg, to, template, templateData)
		console.log('send Email Response => ', emailResponse)
		return callback(null, {
			status: true,
			data: 'Email sent successfully'
		})
	} catch (error) {
		console.log(error)
		return callback({
			message: error.message
		})
	}
}

exports.SendEmailByUserId = async function (call, callback) {
	try {
		let subject = call.request.subject;
		let msg = call.request.msg;
		let userId = call.request.userId;
		let template = call.request.template;
		let templateData = call.request.templateData ? JSON.parse(call.request.templateData) : {};
		let user = await User.findOne({ where: { id: userId, deleteStatus: false } })

		if (user) {
			let to = user.email
			templateData.username = user.fullName ? user.fullName : user.username ? user.username : user.email
			emailQueue.add('Send Email by userId rpc function', {
				subject: subject,
				to: to,
				template: template,
				templateData: templateData
			})
			// let emailResponse = await sendEmailV2(subject, msg, to, template, templateData)
			// console.log('send Email Response => ', emailResponse)
			return callback(null, {
				status: true,
				data: 'Email sent successfully'
			})
		} else {
			return callback(null, {
				status: false,
				data: 'User not found.'
			})
		}
	} catch (error) {
		console.log(error)
		return callback({
			message: error.message
		})
	}
}

exports.GetRoles = async function (call, callback) {
	try {

		let roles = await Role.findAll({
			where: {
				isActive: true
			},
			attributes: ['id', 'roleName', 'isAgent']
		})

		return callback(null, {
			status: true,
			data: JSON.stringify(roles)
		})
	} catch (error) {
		console.log(error)
		return callback({
			message: 'Internal Server Error.',
		})
	}
}

exports.AddBranchBankAccountDetails = async function (call, callback) {
	try {

		let bankDetails = JSON.parse(call.request.data)

		let bankAccountData = await BankAccount.create({
			name: bankDetails.bankName,
			holderName: bankDetails.holderName,
			accountNumber: bankDetails.accountNumber,
			sortCode: bankDetails.sortCode,
			countryId: bankDetails.bankCountryId,
			cityId: bankDetails.bankCityId,
			street: bankDetails.billingAddress,
			postCode: bankDetails.bankPostCode,
			userId: bankDetails.userId,
		})



		return callback(null, {
			status: true,
			data: JSON.stringify(bankAccountData)
		})
	} catch (error) {
		console.log(error)
		return callback({
			message: 'Internal Server Error.',
		})
	}
}

exports.CreateTicket = async function (call, callback) {
	try {
		let data = call.request.data;
		data = JSON.parse(data);

		let supportResponse = await general_helper.createTicket(data.email, data.subject, data.message, data.departmentId)
		let ticketId = supportResponse.data?.ticketId
		return callback(null, {
			status: true,
			ticketId,
			message: 'Ticket Created Successfully'
		})
	} catch (error) {
		console.log(error)
		return callback({
			message: error.message
		})
	}
}

exports.GetDepartments = async function (call, callback) {
	try {
		let supportResponse = await general_helper.getDepartments()
		return callback(null, {
			status: true,
			message: 'departments fetched Successfully',
			data: JSON.stringify(supportResponse.data.data)
		})
	} catch (error) {
		console.log(error)
		return callback({
			message: error.message
		})
	}
}

exports.CreateActionHistory = async function (call, callback) {

	try {
		// console.log(call.request)
		let userId = call.request.userId;
		let action = call.request.action;
		let actionData = JSON.parse(call.request.actionData);
		let ticketId = call.request.ticketId;

		await ActionHistory.create({
			userId,
			action,
			actionData,
			ticketId,
		})

		return callback(null, {
			status: true,
			message: 'action history created successfully'
		})

	} catch (error) {
		console.log(error)
		return callback({
			message: 'Internal Server Error.',
		})
	}
}
