// Libraries
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const generator = require('generate-password');

// Custom Libraries
const { sendEmailV2 } = require('../../lib/email');
const { sequelize_conn } = require('../../../config/database');
const rpcClient = require('../../lib/rpcClient')

// Models
const Role = require('../SqlModels/Role');
const User = require('../SqlModels/User');
const Gender = require('../SqlModels/Gender');
const UserAddress = require('../SqlModels/UserAddress');
const UserAccountBalance = require('../SqlModels/UserAccountBalance');
const Currency = require('../SqlModels/Currency');
const UserLanguage = require('../SqlModels/UserLanguage');
const Language = require('../SqlModels/Language');
const UserMedia = require('../SqlModels/UserMedia');
const UserGeneralInformation = require('../SqlModels/UserGeneralInformation');
const VehicleInformation = require('../SqlModels/VehicleInformation');
const BankAccount = require('../SqlModels/BankAccount');
const RestaurantRider = require('../SqlModels/RestaurantRider');
const UserRiderPrice = require('../SqlModels/UserRiderPrice');
const Registration = require('../SqlModels/Registration');

// Helpers
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')
const socketHelper = require('../../helpers/socketHelper');
const general_helper = require('../../helpers/general_helper');

// Constants
const appConstants = require('../Constants/app.constants');
const configConstants = require('../../../config/constants');
const axios = require('axios');
const FormData = require('form-data');

// ************ GET USERS ************ //
exports.getAll = async function (req, res) {
	try {
		let roles = ['admin', 'guest']
		let data = await User.findAll({
			where: {
				deleteStatus: false
			},
			attributes: appConstants.FIELDS.USER,
			include: [
				{
					model: Role,
					where: {
						isActive: true,
						isAgent: false,
						[Op.not]: {
							roleName: {
								[Op.in]: roles
							}
						}
					},
					through: { attributes: [] },
				},
				{
					model: Gender,
					where: {
						deleteStatus: false
					},
					required: false,
				},
				{
					model: UserAddress,
					where: {
						deleteStatus: false
					},
					required: false,
				},
				{
					model: UserAccountBalance,
					as: 'accountBalance',
					required: false,
					include: [{ model: Currency, required: false, }]
				},
				{
					model: Language,
					required: false,
					// include: [{ model: Language }]
				},
				{
					model: UserMedia,
					where: {
						deleteStatus: false
					},
					required: false,
					order: [['id', 'DESC']],
				},
				{
					model: UserGeneralInformation,
					required: false,
				},
				{
					model: VehicleInformation,
					required: false,
				},
			],
			order: [['id', 'desc']],
		});
		return res.send({
			data: data
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}

}

// ************ GET USER ************ //
exports.getOne = async function (req, res) {
	try {
		let id = req.params.id

		User.findOne({
			where: {
				id,
				deleteStatus: false,
			},
			attributes: [...appConstants.FIELDS.USER, 'genderId', 'geniieCommission', 'isEmailVerified', 'isVerified', 'parentId', 'firstTimeChangedPass', 'verifyPhoneNumber'],
			include: [
				{
					model: BankAccount,
					where: {
						userId: id
					},
					required: false,
				},
				{
					model: Role,
					where: {
						isActive: true,
						[Op.not]: {
							roleName: {
								[Op.in]: ['guest']
							}
						}
					},
					through: { attributes: [] },
				},
				// {
				// 	model: Gender,
				// 	where: {
				// 		deleteStatus: false
				// 	},
				// 	required: false,
				// },
				{
					model: UserAddress,
					where: {
						deleteStatus: false
					},
					order: [['id', 'DESC']],
					required: false,
				},
				{
					model: UserAccountBalance,
					as: 'accountBalance',
					required: false,
					include: [{ model: Currency, required: false, }]
				},
				{
					model: Language,
					required: false,
					// include: [{ model: Language }]
				},
				{
					model: UserMedia,
					// where:{ mediaType : 'photoId'},
					where: {
						deleteStatus: false
					},
					required: false,
					order: [['id', 'DESC']],
					// limit: 1
				},
				{
					model: UserGeneralInformation,
					required: false,
				},
				{
					model: VehicleInformation,
					where: { isSelected: true },
					required: false,
				},
			],
		}).then(async data => {
			if (data) {
				data = data.toJSON()

				data.gender = ''
				if (data.genderId) {
					let genderData = await Gender.findOne({
						where: {
							id: data.genderId
						}
					})

					if (genderData) {
						data.gender = genderData.gender
					}
				}

				data.roleName = data?.roles[0]?.roleName
				delete data.password
				delete data.emailVerificationCode
				delete data.refreshToken
				delete data.roles


				if (data.roleName == 'restaurant') {
					const getRestaurantMedia = (userId) => {
						return new Promise((resolve, reject) => {
							try {
								rpcClient.RestaurantService.getRestaurantMedia({ userId: userId }, function (error, responseData) {
									if (error) return reject(error)
									return resolve(responseData)
								});
							} catch (error) {
								return reject(error)
							}
						})
					}
					try {
						let responseData = await getRestaurantMedia(data.id)
						if (responseData.status) {
							data.user_medias = JSON.parse(responseData.data);
						}

					} catch (error) {
						console.log(error)
					}
				}


				return res.send({
					message: "User data found.",
					user: data
				})
			} else {
				return res.status(400).send({
					message: 'User does not exist.'
				})
			}
		}).catch(err => console.log(err))
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}

}


exports.changePassword = async function (req, res) {
	try {

		// return res.send('test');

		let authUser = req.user
		// let email = authUser.email
		if (authUser.roleName !== 'provider') {
			return respondWithError(req, res, "Action not allowed", null, 405)
		}

		let userId = req.body.userId;

		let user = await User.findOne({ where: { id: userId, parentId: authUser.id } })

		if (!user) {
			return respondWithError(req, res, 'Error: Invalid request.', null, 400)
		}

		let password = req.body.password

		let hashedPassword = await bcrypt.hash(`${password}`, 10);
		bcrypt.compare(req.body.password, user.password, async (err, data) => {
			if (!data) {
				user.password = hashedPassword;
				await user.save()
				try {
					await sendEmailV2("Password changed successfully", '', authUser.email, 'user/passwordChanged.pug', {
						title: 'Password Changed',
						userName: `${authUser.firstName} ${authUser.lastName}`
					});
				} catch (error) {
					console.log(error);
				}
				return respondWithSuccess(req, res, 'Password has been updated successfully.', null, 200)
			} else {
				return respondWithError(req, res, "You can't enter recent password.", null, 400)
			}
		})
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}

// ************ Update Rider Status RPC controller function ************ //
exports.updateRiderStatus = async function (call, callback) {
	try {
		let userIds = call.request.userIds
		let status = call.request.status
		if (userIds && userIds.length && status) {
			await User.update({ status: status }, { where: { id: { [Op.in]: userIds } } })
		}

		let riderOrderDetails = JSON.parse(call.request.data);
		for (const riderId in riderOrderDetails) {
			// if (riderOrderDetails[riderId].suspensionTime && riderOrderDetails[riderId].suspensionLevel) {
			socketHelper.socketPushDataWithInstanceName('riderSocket', appConstants.SOCKET_EVENTS.RESTRICT_RIDER_ON_REJECTION_RATE, {
				...riderOrderDetails[riderId]
			}, [riderId])
			// }
		}

	} catch (error) {
		console.log(error)
		return callback(null, "Internal Server Error.")
	}

}


exports.balanceLimit = async function (req, res) {

	try {
		let authUser = req.user
		// let email = authUser.email
		if (authUser.roleName !== 'admin') {
			return respondWithError(req, res, "Action not allowed", null, 405)
		}

		var balanceLimit = req.body.balanceLimit;
		var userId = req.body.userId;

		let targetUser = await User.findOne({
			where: {
				id: userId,
				status: 'active'
			}
		})

		if (!targetUser) {
			return respondWithError(req, res, 'User not found.', null, 400)
		}

		await UserAccountBalance.update({
			balanceLimit: balanceLimit,
		}, {
			userId: userId
		})
		return respondWithSuccess(req, res, 'User Balance Limit successfully update')
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.getAgents = async function (req, res) {

	try {

		if (req.user.roles[0].roleName != 'admin') {
			return respondWithError(req, res, 'invalid user request', null, 405)
		}

		let data = await User.findAll({
			attributes: appConstants.FIELDS.USER,
			include: [
				{
					model: Role,
					where: {
						isActive: true,
						isAgent: true,
					},
					attributes: ['id', 'roleName'],
					through: { attributes: [] },
				},
			],
			order: [['id', 'desc']],
		});

		return respondWithSuccess(req, res, 'data fetched successfully', data)

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.getProviderRiders = async function (req, res) {
	try {
		// let restaurantId = data.restaurantId;
		let providerId = req.user.id

		if (req.user.roles[0].roleName != 'admin' && req.user.roles[0].roleName != 'provider') {
			return respondWithError(req, res, 'invalid user request', null, 405)
		}

		let data = await User.findAll({
			where: {
				deleteStatus: false,
				parentId: providerId,
				[Op.not]: {
					status: 'suspended',
				}
			},
			attributes: [...appConstants.FIELDS.USER, 'isLogin'],
			include: [
				{
					model: Role,
					where: {
						isActive: true,
						roleName: 'rider',
					},
					attributes: ['id', 'roleName'],
					through: { attributes: [] },
				},
			],
			order: [['id', 'desc']],
		});
		// let ridersData = data.toJSON()
		let riderIds = data.map(data => data.id)
		console.log('riderIds', riderIds);

		let ridersData = await RestaurantRider.findAll({
			where: {
				riderId: {
					[Op.in]: riderIds
				}
			}
		})

		console.log('ridersData', ridersData);

		let restaurantUserIds = ridersData.map(item => item.restaurantUserId)

		console.log('restaurantUserIds', restaurantUserIds);

		const GetRestaurantRespData = () => {
			return new Promise((resolve, reject) => {
				rpcClient.RestaurantService.getAllRestaurant({
					type: 'getAllBranchNameForRidersList',
					id: restaurantUserIds
				}, function (error, restaurantRespData) {
					if (error) {
						console.log(error);
						return reject(error)
					}
					return resolve(restaurantRespData)
				})
			})
		}

		let restaurantRespData = await GetRestaurantRespData()

		let restaurantData = JSON.parse(restaurantRespData.data)

		console.log('restaurant data =>', restaurantData);
		// let branchesList = []
		// ridersData.map(riders => {
		// 	let branch = restaurantData.find(item => item.userId == riders.restaurantUserId)
		// 	console.log('branch',branch);
		// 	branch = branch.toJSON()

		// 	branch.riderId = riders.riderId


		// })
		let riders = data.map(ridersList => {

			let riderData = ridersData.find(item => item.riderId == ridersList.id)

			if (riderData) {
				let branch = restaurantData.find(item => item.userId == riderData.restaurantUserId)

				let riderListJson = ridersList.toJSON()
				riderListJson.branchName = branch.name
				return riderListJson
			}
			return ridersList
		})

		if (!restaurantData && restaurantData.length == 0) {
			return respondWithError(req, res, 'restaurant not found!', null, 400)
		}

		return res.send({
			data: riders
		})

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.getRestaurantRiders = async function (req, res) {
	try {
		let authUser = req.user

		let agentRoles = await general_helper.getAgentRoles();

		if (authUser.roleName !== 'admin' && authUser.roleName !== 'provider' && authUser.roleName !== 'restaurant' && !agentRoles.includes(authUser.roleName)) {
			return respondWithError(req, res, "Action not allowed", null, 405)
		}

		let whereClause = {}
		let userId = 0
		if (authUser.roleName === 'restaurant') {
			userId = authUser.id
			whereClause.status = 'active'
		} else {
			userId = req.query.userId
		}

		let riderIds = await RestaurantRider.findAll({
			where: {
				restaurantUserId: userId
			},
			attributes: ['riderId']
		})

		let ids = [];
		riderIds.forEach(element => {
			ids.push(element.riderId)
		});

		let riders = await User.findAll({
			where: {
				id: {
					[Op.in]: ids
				},
				isLogin: true,
				...whereClause,
				deleteStatus: false
			},
			attributes: appConstants.FIELDS.USER,
			include: [
				{
					model: Role,
					where: {
						isActive: true,
						roleName: 'rider',
					},
					attributes: ['id', 'roleName'],
					through: { attributes: [] },
				},
			],
			order: [['id', 'desc']],
		})
		let newRiders = riders

		if (authUser.roleName === 'restaurant') {
			ids = [];
			riders.forEach(element => {
				ids.push(element.id)
			});

			const getRiderLocation = (ids) => {
				return new Promise((resolve, reject) => {
					try {
						rpcClient.riderRPC.GetRiderLocation({ riderIds: ids },
							function (error, rpcResponseData) {
								if (error) return reject(error)
								return resolve(rpcResponseData)
							})
					} catch (error) {
						return reject(error)
					}
				})
			}

			let riderLocations = []
			try {
				let riderLocationData = await getRiderLocation(ids)
				riderLocations = JSON.parse(riderLocationData.data)
			} catch (error) {
				console.log(error)
				return respondWithError(req, res, 'unable to get rider location', null, 400)
			}

			newRiders = riders.map(item => {
				item = item.toJSON()
				let riderLocation = riderLocations.find(a => a.riderId == item.id)
				item.riderLocation = riderLocation
				delete item.roles
				return item;
			});
		}


		return respondWithSuccess(req, res, 'data fetched successfully', newRiders)
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.createAgent = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();

	try {

		// if (req.user.roles[0].roleName != 'admin') {
		// 	return respondWithError(req, res, 'invalid user request', null, 405)
		// }

		let data = req.body.match;
		let email = data.email;
		data.username = email

		let userExists = await User.findOne({
			where: {
				email: data.email
			},
			include: [{
				model: Role,
				where: {
					roleName: data.role,
					isAgent: true,
				}
			}],
			transaction: sequelizeTransaction
		})

		if (userExists) {
			return res.status(400).send({
				status: false,
				message: 'Error: user already exists'
			})
		}


		let role = await Role.findOne({
			where: {
				roleName: data.role,
				isAgent: true,
			},
			attributes: ['id'],
			transaction: sequelizeTransaction
		})

		if (!role) {
			return res.status(400).send({
				status: false,
				message: "Error: role is not defined"
			})
		}

		let password = generator.generate({
			length: 10,
			numbers: true
		});

		const hash = await bcrypt.hash(password, 10);

		let user = new User({
			...data,
			status: 'active',
			password: hash
		});

		await user.save({ transaction: sequelizeTransaction })

		await user.addRole(role, { transaction: sequelizeTransaction })
		let fmData = new FormData()

		fmData.append('email_address', email);
		fmData.append('first_name', data.first_name ? data.first_name : 'ABC');
		fmData.append('last_name', data.last_name ? data.last_name : 'XYZ');
		fmData.append('password', password);

		// console.log(fmData);
		// return
		let supportResponse = await axios.post(`${configConstants.SUPPORT_BASE_URL}/actions/account/register_agent`, fmData, {
			headers: {
				"Authorization": `Basic ${configConstants.SUPPORT_HASH}`,
				...fmData.getHeaders()
			}
		})


		let html = `Hello, You account has been successfully registered as Agent User. Your app password is <b>${password}</b>.<br>`
		await sendEmailV2("Agent Registration", html, email);

		await sequelizeTransaction.commit()

		user = await User.findOne({
			where: {
				id: user.id,
			},
			attributes: appConstants.FIELDS.USER,
			include: [{
				model: Role,
				attributes: ['id', 'roleName'],
				through: { attributes: [] },
			}]
		})

		return respondWithSuccess(req, res, 'agent registered successfully', user)

	} catch (error) {
		sequelizeTransaction.rollback();
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.saveRestaurantRider = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();

	try {
		let data = req.body.match;
		let email = data.user.email;
		data.user.username = email
		let n = 10;
		let number = data.user.phoneNumber.substring(data.user.phoneNumber.length - n)

		let restaurantId = data.restaurantId;
		let providerId = req.user.id

		if (req.user.roles[0].roleName != 'provider') {
			return respondWithError(req, res, 'invalid user request', null, 405)
		}

		const GetRestaurantRespData = () => {
			return new Promise((resolve, reject) => {
				rpcClient.RestaurantService.getAllRestaurant({
					type: 'restaurant',
					id: [restaurantId]
				}, function (error, restaurantRespData) {
					if (error) {
						console.log(error);
						return reject(error)
					}
					return resolve(restaurantRespData)
				})
			})
		}

		let restaurantRespData = await GetRestaurantRespData()
		let restaurantData = JSON.parse(restaurantRespData.data)

		if (!restaurantData || !restaurantData.length || restaurantData[0].providerId != providerId || !restaurantData[0].userId) {
			return respondWithError(req, res, 'restaurant not found!', null, 400)
		}

		let restaurant = restaurantData[0]

		let userExists = await User.findOne({
			where: {
				[Op.or]: [
					{
						email: data.user.email,
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

		if (userExists) {
			return res.status(400).send({
				status: false,
				message: 'Error: User with same email or phone number already exists'
			})
		}


		let riderRole = await Role.findOne({
			where: {
				roleName: 'rider'
			},
			attributes: ['id']
		})

		if (!riderRole) {
			return res.status(400).send({
				status: false,
				message: "Error: role is not defined"
			})
		}

		let pass = generator.generate({
			length: 10,
			numbers: true
		});

		const hash = await bcrypt.hash(pass, 10);

		let user = new User({
			...data.user,
			parentId: providerId,
			password: hash,
			number: number
		});
		await user.save({ transaction: sequelizeTransaction })

		await user.addRole(riderRole, { transaction: sequelizeTransaction })

		let registrationData = new Registration({
			userId: user.id,
			roleId: riderRole.id,
			// registrationData: req.body.match
		});
		await registrationData.save({ transaction: sequelizeTransaction });

		let restaurantRider = new RestaurantRider({
			restaurantUserId: restaurant.userId,
			riderId: user.id,
		})
		await restaurantRider.save({ transaction: sequelizeTransaction })

		if (email) {
			// let html = `Hello, You are successfully registered on Geniie for rider. Please login to https://rider.geniie.uk. Your app password is <b>${pass}</b>.<br>`
			await sendEmailV2("Rider Registration", '', email, 'rider/welcome.pug', {
				password: pass,
				mainURL: configConstants.RIDER_URL
			});
		}

		await sequelizeTransaction.commit()

		user = await User.findOne({
			where: {
				id: user.id,
			},
			attributes: appConstants.FIELDS.USER,
			include: [{
				model: Role,
				attributes: ['id', 'roleName'],
				through: { attributes: [] },
			}]
		})

		return res.send({
			message: "Your are registered successfully.",
			data: {
				user: user
			}
		});
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			status: false,
			message: `Error: ${error.message}`
		})
	}
}

exports.suspend = async function (req, res) {

	try {

		let agentRoles = await general_helper.getAgentRoles();

		let authUser = req.user
		if (authUser.roleName !== 'admin' && authUser.roleName !== 'provider' && !agentRoles.includes(authUser.roleName)) {
			return respondWithError(req, res, "Action not allowed", null, 405)
		}

		let userId = req.body.userId
		let role = req.body.role
		let reason = req.body.reason

		if (authUser.roleName !== 'provider' && !reason) {
			return respondWithError(req, res, "invalid data", null, 422)
		}

		let user = await User.findOne({
			where: {
				id: userId,
				deleteStatus: false,
				[Op.not]: {
					status: 'suspended',
				}
			},
			attributes: appConstants.FIELDS.USER,
			include: [{
				model: Role,
				where: {
					isActive: true,
					roleName: role
				},
				attributes: ['id', 'roleName'],
				through: { attributes: [] },
			}]
		})

		if (!user) {
			return res.status(400).send({
				status: false,
				message: 'Error: user not found'
			})
		}

		let updatedData = {
			status: 'suspended',
			suspendedBy: 'super_admin',
			suspendSlug: 'suspendByAdmin',
			suspendReason: reason ? reason : '',
		}

		if (user.roles[0].roleName === 'provider') {

			let providerReferenceAccountSuspendData = {
				status: 'suspended',
				suspendedBy: 'super_admin',
				suspendSlug: 'providerSuspended',
				suspendReason: 'account suspended due to provider suspend',
			}

			await general_helper.suspendProviderAndAllItsReferences(user.id, updatedData, providerReferenceAccountSuspendData)

		}
		else if (user.roles[0].roleName === 'restaurant') {
			new Promise((resolve, reject) => {
				try {
					rpcClient.RestaurantService.suspendRestaurants({
						id: user.id,
						role: 'restaurant',
					}, function (error, rpcResponseData) {
						console.log('error, rpcResponseData=>', error, rpcResponseData)
						if (error) return reject(error)
						return resolve(rpcResponseData)
					})
				} catch (error) {
					console.log(error);
					return reject(error)
				}
			})

			await user.update(updatedData)
		}
		else {

			if (authUser.roleName === 'provider') {
				updatedData.suspendedBy = 'provider'
				updatedData.suspendSlug = 'deleteByProvider'
				updatedData.suspendReason = 'account deleted by provider'
			}

			await user.update(updatedData)
		}

		return respondWithSuccess(req, res, 'user suspended successfully', user)

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.updateRiderPrice = async function (req, res) {

	try {

		let authUser = req.user
		if (authUser.roleName !== 'provider') {
			return respondWithError(req, res, "Action not allowed", null, 405)
		}

		let userId = req.user.id
		let price = req.body.price

		let userRiderPrice = await UserRiderPrice.findOne({
			where: {
				userId: userId
			}
		})

		if (userRiderPrice) {

			userRiderPrice.price = price

		}
		else {

			userRiderPrice = new UserRiderPrice({
				userId: userId,
				price: price,
			})

		}

		await userRiderPrice.save()

		return respondWithSuccess(req, res, 'rider price updated successfully')
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.getRiderPrice = async function (req, res) {
	try {

		let authUser = req.user
		if (authUser.roleName !== 'provider') {
			return respondWithError(req, res, "Action not allowed", null, 405)
		}

		let userId = authUser.id

		let userRiderPrice = await UserRiderPrice.findOne({
			where: {
				userId: userId
			},
			attributes: ['currencyCode', 'price']
		})

		if (userRiderPrice) {
			return respondWithSuccess(req, res, 'data fetched successfully', userRiderPrice)
		} else {
			return respondWithSuccess(req, res, 'price not found')
		}

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}