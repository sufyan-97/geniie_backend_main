
const { Op } = require('sequelize');

// Models
const User = require('../../SqlModels/User');
const Role = require('../../SqlModels/Role');
const UserAccountBalance = require('../../SqlModels/UserAccountBalance');
const RewardPointHistory = require('../../SqlModels/RewardPointHistory');
const UserAddress = require('../../SqlModels/UserAddress');

// Helpers

// Constants
const appConstants = require('../../Constants/app.constants');
const BankAccount = require('../../SqlModels/BankAccount');
const { Console } = require('console');
const RestaurantRider = require('../../SqlModels/RestaurantRider');

// ************ GET USERS ************ //
exports.getRiders = async function (call, callback) {
	try {
		User.findAll({
			include: {
				model: Role,
				where: {
					roleName: 'rider'
				}
			}
		}).then(data => {
			// console.log(data)
			callback(null, {
				status: true,
				data: JSON.stringify(data)
			})
			// return res.send({
			//     data: data
			// })
		})
	} catch (error) {
		callback({
			message: 'Interval server error'
		})
	}

}

// ************ GET USERS ************ //
exports.getUsers = async function (call, callback) {
	try {
		let userIds = call.request.ids

		User.findAll({
			where: {
				id: {
					[Op.in]: userIds
				}
			},
			attributes: [...appConstants.FIELDS.USER, 'parentId', 'isLogin'],
			include: [
				{
					model: Role,
					where: {
						isActive: true,
					},
					attributes: ['id', 'roleName'],
					through: { attributes: [] },
				},
				{
					model: BankAccount,
					where: {
						userId: { [Op.in]: userIds }
					},
					required: false
				},
				{
					model: UserAddress,
					where: {
						deleteStatus: false
					},
					order: [['id', 'DESC']],
					required: false,
				},
			]
		}).then(data => {
			if (data && data.length) {
				callback(null, {
					status: true,
					data: JSON.stringify(data)
				})
			} else {
				callback(null, {
					status: true,
					data: JSON.stringify([])
				})
			}
		}).catch(error => {
			console.log(error);
			callback({
				message: 'Interval server error'
			})
		})
	} catch (error) {
		console.log(error);
		callback({
			message: 'Interval server error'
		})
	}

}

exports.getUsersByType = async function (call, callback) {
	try {

		let data = call.request.data

		data = JSON.parse(data)

		let users = []

		if (data.user) {
			let user = await User.findOne({
				where: {
					email: data.user.email,
				},
				attributes: ['id', 'status'],
				include: [
					{
						model: Role,
						where: {
							roleName: 'user',
							isActive: true,
						},
						attributes: ['id', 'roleName'],
						through: { attributes: [] },
					}
				]
			})

			if (user) {
				users.push(user)
			}
		}

		if (data.rider) {
			let user = await User.findOne({
				where: {
					email: data.rider.email,
				},
				attributes: ['id', 'status'],
				include: [
					{
						model: Role,
						where: {
							roleName: 'rider',
							isActive: true,
						},
						attributes: ['id', 'roleName'],
						through: { attributes: [] },
					}
				]
			})

			if (user) {
				users.push(user)
			}
		}

		let rpcResponseData = users

		callback(null, {
			status: true,
			data: JSON.stringify(rpcResponseData),
		})

	} catch (error) {
		console.log(error);
		callback(error)
	}
}

exports.ChangeUserStatus = async function (call, callback) {
	try {

		let id = call.request.userId
		let status = call.request.userStatus
		let reasonData = call.request.reasonData ? JSON.parse(call.request.reasonData) : {}

		if (status === 'suspended') {
			await User.update(
				{
					status: 'suspended',
					...reasonData
				},
				{
					where: {
						id: id,
						deleteStatus: false,
						[Op.not]: {
							status: 'suspended',
						}
					}
				}
			)
		}
		else if (status == 'active') {
			await User.update(
				{
					status: 'active',
					suspendedBy: '',
					suspendSlug: '',
					suspendReason: ''
				},
				{
					where: {
						id: id,
						deleteStatus: false,
						[Op.not]: {
							status: 'active',
						}
					}
				}
			)
		}
		else if (status == 'rejected') {
			await User.update(
				{
					status: 'rejected',
					...reasonData
				},
				{
					where: {
						id: id,
						deleteStatus: false,
						[Op.not]: {
							status: 'rejected',
						}
					}
				}
			)
		}

		callback(null, {
			status: true
		})

	} catch (error) {
		console.log(error);
		callback(error)
	}
}

exports.UpdateUserRewardPoints = async function (call, callback) {

	try {
		// console.log(call.request)
		let userId = call.request.userId
		let relevantId = call.request.relevantId
		let type = call.request.type
		let rewardPoints = call.request.points
		let data = call.request.data

		let userAccountBalance = await UserAccountBalance.findOne({
			where: {
				userId: userId
			}
		})
		if (!userAccountBalance) {
			userAccountBalance = await UserAccountBalance.create({
				userId: userId,
				rewardPoints: rewardPoints
			})
		}
		else {
			userAccountBalance.rewardPoints += rewardPoints
			userAccountBalance.save()
		}

		await RewardPointHistory.create({
			userId: userId,
			relevantId: relevantId,
			type: type,
			points: rewardPoints,
			data: data
		})

		callback(null, {
			status: true,
			message: 'reward point updated successfully'
		})

	} catch (error) {
		console.log(error);
		callback(error)
	}

}

// ************ Verify Restaurant Rider ************ //
exports.verifyRestaurantRider = async function (call, callback) {
	let restaurantUserId = call.request.userId
	let riderId = call.request.riderId
	try {
		RestaurantRider.findOne({
			where: {
				restaurantUserId: restaurantUserId,
				riderId,
			}
		}).then(async data => {
			// console.log(data)
			if (data) {
				let user = await User.findOne({ where: { id: data.riderId, deleteStatus: false, status: "active" } })
				if (user) {
					if (user.isLogin) {
						callback(null, {
							status: true,
							message: "Rider found successfully."

						})
					} else {
						callback(null, {
							status: false,
							message: "Rider is currently logged out. Please make sure your rider in logged in to Geniie rider application."
						})
					}
				} else {
					callback(null, {
						status: false,
						message: "Rider not found."
					})
				}

			} else {
				callback(null, {
					status: false,
					message: "Rider not registered under your restaurant."
				})
			}

		})
	} catch (error) {
		callback({
			message: 'Interval server error'
		})
	}

}
