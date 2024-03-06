
// Libraries
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const md5 = require('md5');
const moment = require("moment");
const emailQueue = require('../../../src/lib/emailWorker');

const { Op, where } = require('sequelize')
const fs = require('fs')
// Custom Libraries
const { sendEmailV2 } = require('../../lib/email');
const { sequelize_conn } = require('../../../config/database');
const rpcClient = require('../../lib/rpcClient')


//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')
const notification_helper = require('../../helpers/notification_helper');
const general_helper = require('../../helpers/general_helper');
const socketHelper = require('../../helpers/socketHelper')

// Modals
var User = require("../SqlModels/User")
var UserNotification = require("../SqlModels/UserNotification")
var Notification = require("../SqlModels/Notification")

var RestaurantRider = require("../SqlModels/RestaurantRider")
var VehicleInformation = require("../SqlModels/VehicleInformation")

var Role = require("../SqlModels/Role");
var serviceAddress = require("../SqlModels/ServiceAddress");
var UserService = require("../SqlModels/UserService");
var UserMedia = require("../SqlModels/UserMedia");

const Service = require('../SqlModels/Service');
const City = require('../SqlModels/City');
const Country = require('../SqlModels/Country');
const UserAddress = require('../SqlModels/UserAddress');
const Registration = require('../SqlModels/Registration');
const State = require('../SqlModels/State');

// Constants
const appConstants = require('../Constants/app.constants');
const constants = require('../../../config/constants');
const businessHelper = require('../../helpers/businessHelper');
const path = require('path');


/**
 * Global APIs
 */
exports.related = async function (req, res) {
	try {

		let data = {};
		data.services = await Service.findAll({

			where: {
				deleteStatus: false
			},
			attributes: ['id', 'name']
		})

		data.countries = await Country.findAll({
			where: {
				status: true
			},
			include: [{
				model: State,

				attributes: ['id', 'name'],
				include: [{
					model: City,
					attributes: ['id', 'name'],
					where: {
						status: true
					},
					required: false
				}],
			}],
			attributes: ['id', 'countryName', 'countryCode'],
		})

		res.status(200).send({ data: data })
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			status: false,
			message: `Error: ${error.message}`
		})
	}
}

/**
 * Restaurant Registration APIs
 */


exports.getBusinessRequest = async function (req, res) {
	let user = req.user;

	let agentRoles = await general_helper.getAgentRoles();

	if (user.roleName !== "provider" && user.roleName !== "admin" && !agentRoles.includes(user.roleName)) {
		return respondWithError(req, res, 'invalid user request', null, 405)
	}
	let requestWhere = {}
	if (user.roles[0].roleName === 'provider') {
		requestWhere.userId = user.id
	}

	UserService.findAll({
		where: {
			deleteStatus: false,
			...requestWhere,
			status: 'request_for_approval',
		},
		include: [
			{
				model: User,
				attributes: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName']
			},
			{
				model: Service,
				attributes: ['id', 'name', 'image', 'slug', 'isActive', 'isFeatured']
			}
		],
		order: [['id', 'desc']],
	}).then(data => {
		if (!data || !data.length)
			return res.send({
				message: 'unable to fetched data. data not found',
				data: []
			})

		return respondWithSuccess(req, res, 'data fetched successfully', data)
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})

}

exports.updateBusinessRequestRejection = async function (req, res) {
	try {
		let payload = req.body.match
		// console.log('webSocketEvent=>', req.app.get('webSocket'));

		let user = req.user;

		let agentRoles = await general_helper.getAgentRoles();

		if (user.roleName !== "admin" && !agentRoles.includes(user.roleName)) {
			return respondWithError(req, res, 'invalid user request', null, 405)
		}

		let userService = await UserService.findOne({ where: { id: payload.id, status: 'request_for_approval', deleteStatus: false } });
		if (!userService)
			return respondWithError(req, res, 'business request not found', null, 400)

		let provider = await User.findOne({
			where: {
				id: userService.userId
			}
		})

		if (!provider) {
			return res.status(400).send({
				status: true,
				message: 'Error: provider not found'
			})
		}

		userService.rejectedFields = payload.rejectedFields//JSON.stringify(payload.rejectedFields);
		userService.save();

		// Notification Work
		if (payload.rejectedFields && payload.rejectedFields.length > 0) {
			let socketInstance = req.app.get('webSocket')
			let socketEventName = appConstants.SOCKET_EVENTS.BROADCAST_PROVIDER_NOTIFICATION
			let subject = 'Business Rejection Notification'
			let description = 'Your Business Request has been rejected by geniie'
			let appName = 'asaap-restaurant'
			let type = 'user'
			let notificationData = userService.rejectedFields
			await notification_helper.saveAndSendNotification(socketInstance, socketEventName, [provider.id], subject, description, appName, type, notificationData)

			console.log(userService.serviceDetails)

			if (provider && provider.email) {
				let html = `Hello, Some data of your Business registration request has been rejected by Geniie admin. Please contact geniie support for more details.<br>`

				// Field Rejection

				await sendEmailV2("Your Application has an issue", '', provider.email, 'business/approvalFieldRejected.pug', {
					title: 'Your Application has an issue',
					userName: `${provider.firstName} ${provider.lastName}`
				});

			}
		}

		return respondWithSuccess(req, res, 'business rejections updated successfully', null)

	} catch (err) {
		console.log(err);
		return respondWithError(req, res, '', null)
	}

}

exports.saveProvider = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();

	try {
		let data = req.body.match;
		let email = data.user.email;
		data.user.username = email
		let n = 10;
		let number = data.user.phoneNumber.substring(data.user.phoneNumber.length - n)
		// data.user.username = data.user.email

		let serviceExist = await Service.findOne({
			where: {
				id: data.business.serviceId
			}
		});

		if (!serviceExist) {
			return res.status(400).send({
				status: false,
				message: "Error: related service not found"
			})
		}

		let country = await Country.findOne({
			where: {
				id: data.location.countryId
			}
		});

		if (!country) {
			return res.status(400).send({
				status: false,
				message: "Error: related country not found"
			})
		}

		let city = await City.findOne({
			where: {
				id: data.location.cityId,
			}
		});

		if (!city) {
			return res.status(400).send({
				status: false,
				message: "Error: related city not found"
			})
		}

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


		let providerRole = await Role.findOne({
			where: {
				roleName: 'provider'
			},
			attributes: ['id']
		})

		if (!providerRole) {
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
			password: hash,
			number: number
		});
		await user.save({ transaction: sequelizeTransaction })

		await user.addRole(providerRole, { transaction: sequelizeTransaction })

		let serviceDetails = new UserService({
			...data.business,
			serviceCategoryId: data.business.serviceCategoryId,
			userId: user.id
		});
		await serviceDetails.save({ transaction: sequelizeTransaction });

		let location = new serviceAddress({
			...data.location,
			userServiceId: serviceDetails.id
		});
		let loc = await location.save({ transaction: sequelizeTransaction });

		let userAddress = new UserAddress({
			...data.location,
			userId: user.id
		});

		await userAddress.save({ transaction: sequelizeTransaction });

		let emails = [data.user.email, ...constants.SUPPORT_EMAILS];

		await sendEmailV2("Business Register Successfully", '', emails.join(), 'business/welcome.pug', {
			host: constants.HOST,
			title: 'Business Welcome',
			mainURL: constants.PROVIDER_URL,
			password: pass,
			email: data.user.email,
			userName: `${data.user.firstName} ${data.user.lastName}`
		});


		sequelizeTransaction.commit()

		return respondWithSuccess(req, res, 'Provider registered successfully', {
			user: user,
			business: serviceDetails,
			address: loc
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			status: false,
			message: `Error: ${error.message}`
		})
	}
}

exports.getTill = async function (req, res) {

	UserService.findOne({
		where: [
			{ userId: req.user.id },
		],
	}).then(tillPages => {
		return res.send({
			status: true,
			message: "data found",
			data: tillPages
		})
	}).catch((error) => {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	})
}

exports.saveTill = async function (req, res) {
	try {
		let provider = req.user;
		let uid = req.user.id;

		let userRoles = await provider.getRoles()

		let isProvider = userRoles.find((userRole) => userRole.roleName === 'provider')
		if (!isProvider) {
			return res.send({
				status: false,
				message: "Error: user not found"
			})
		}

		let reqData = req.body.match;
		// console.log('reqData',reqData)

		if (reqData?.restaurantTimings?.timing) {
			reqData.restaurantTimings.timing = JSON.parse(reqData.restaurantTimings.timing)
		}

		if (!reqData?.businessMedia) {
			reqData.businessMedia = {}
		}

		let files = req.files

		const checkAndUploadFile = (checkFiles, file) => {
			return new Promise(async (resolve, reject) => {
				let alreadyUploaded = checkFiles.findIndex((checkFile) => checkFile.includes(file.originalFilename))

				// console.log('file already updated?', (alreadyUploaded < 0) ? 'No' : 'Yes');

				if (alreadyUploaded >= 0) {
					return resolve(false)
				}

				if (!file || !file.name) {
					return reject(false)
				}

				let fileData = await general_helper.uploadDocs(file, md5(provider.id), 'business')
				if (fileData.status) {
					return resolve(`${appConstants.FILE_PREFIX}${md5(provider.id)}/${fileData.fileName}`);

				} else {
					return reject(fileData)

				}
			})
		}

		let fileUploadError = [];
		for (const businessMediaKey in reqData.businessMedia) {
			try {
				reqData.businessMedia[businessMediaKey] = reqData.businessMedia[businessMediaKey] ? JSON.parse(reqData.businessMedia[businessMediaKey]) : []
			} catch (error) {
				fileUploadError.push(error.message)
			}
		}

		if (fileUploadError && fileUploadError.length) {
			return res.status(422).send({
				message: `Files couldn't be updated`,
				errors: fileUploadError
			})
		}

		if (files && Object.keys(files).length) {
			for (const fileKey in files) {
				try {
					reqData.businessMedia[fileKey] = reqData.businessMedia[fileKey] ? reqData.businessMedia[fileKey] : []
				} catch (error) {
					console.log(error)
					fileUploadError.push(error.message)
				}

				if (files[fileKey].length > 1) {
					console.log("Save business Multiple files:")

					for (let file = 0; file < files[fileKey].length; file++) {
						try {
							let fileData = await checkAndUploadFile(reqData.businessMedia[fileKey], files[fileKey][file])
							if (fileData) {
								reqData.businessMedia[fileKey].push(fileData)
							}
						} catch (error) {
							fileUploadError.push(files[fileKey][file])
							break
						}
					}

					if (fileUploadError && fileUploadError.length) {
						break
					}

				} else {
					// console.log("Save business Single file:")

					try {
						let fileData = await checkAndUploadFile(reqData.businessMedia[fileKey], files[fileKey])
						if (fileData) {
							reqData.businessMedia[fileKey].push(fileData)
						}
					} catch (error) {
						fileUploadError.push(files[fileKey])
						break
					}
				}
			}
		}

		if (fileUploadError && fileUploadError.length) {
			return res.status(422).send({
				message: `Files couldn't be updated`,
				errors: fileUploadError
			})
		}

		// console.log('businessMedia:', reqData.businessMedia)

		let formattedMedia = {}

		for (const media in reqData?.businessMedia) {
			// console.log('key', media)
			formattedMedia[media] = reqData?.businessMedia[media]?.map(mediaItem => {
				if (!reqData?.media || !reqData?.media[media]) {
					return {
						path: mediaItem,
						expiryDate: null
					}
				}
				try {

					let fmParsedMedia = JSON.parse(reqData.media[media])
					let obj = fmParsedMedia.find((item) => item.path === mediaItem)
					if (!obj) {
						return {
							path: mediaItem,
							expiryDate: null
						}
					}
					return obj
				} catch (error) {
					return {
						path: mediaItem,
						expiryDate: null
					}
				}
			})

		}

		reqData.media = formattedMedia

		let userService = await UserService.findOne({
			where: {
				userId: uid
			}
		})

		if (!userService) {
			return res.status(400).send({
				status: false,
				message: 'Error: User service data not found'
			})
		}

		userService.serviceDetails = general_helper.mergeDeep(userService.serviceDetails ? JSON.parse(userService.serviceDetails) : {}, reqData)

		if (reqData.rejectedFields) {
			userService.rejectedFields = reqData.rejectedFields ? JSON.parse(reqData.rejectedFields) : [];
		}

		if (reqData.finalPage) {
			let serviceDetailResponse = await businessHelper.businessRegistration(provider, userService)

			console.log('serviceDetailResponse', serviceDetailResponse);
			userService.serviceDetails = general_helper.mergeDeep(userService.serviceDetails, serviceDetailResponse)
			userService.status = 'request_for_approval';

			let adminUser = await User.findOne({ include: { model: Role, where: { roleName: 'admin' } } })

			if (adminUser) {
				let notificationData = await Notification.findOne({
					where: {
						appName: 'super_admin',
						'notificationData.id': userService.id
					},
					include: {
						model: UserNotification,
						where: {
							userId: adminUser.id,
							status: 'unread'
						}
					}
				})

				let subject = "Business Registration"
				let description = `${userService.serviceDetails.personalInformation.firstName} requested for new business`
				if (!notificationData) {
					if (provider && provider.email) {
						// let html = `Hello, Your business registration request with updated details has been sent to Geniie admin. Stay tuned for more details.<br>`
						// sendEmailV2("Business Registration Sent for Approval", html, provider.email);
						await sendEmailV2("Business Register Successfully", '', provider.email, 'business/welcomeSubmit.pug', {
							title: 'Business Welcome'
						});
					}
				} else {
					subject = "Update Business"
					description = `${userService.serviceDetails.personalInformation.firstName} requested to approve updated data`
				}


				let notificationUserService = userService
				try {
					notificationUserService = notificationUserService.toJSON()
					notificationUserService.redirectionLink = '/approval_request/business'
				} catch (error) {
					console.log(error)
				}

				notificationData = await Notification.create({
					subject: subject,
					description: description,
					notificationData: notificationUserService,
					appName: 'super_admin',
					type: 'user'
				})

				await UserNotification.create({
					notificationId: notificationData.id,
					userId: adminUser.id
				})

				try {
					notificationData = notificationData.toJSON()
					notificationData.status = 'unread'
				} catch (error) {
					console.log(error)
				}
				socketHelper.socketPushDataWithInstance(req.app.get('webSocket'), appConstants.SOCKET_EVENTS.BROADCAST_ADMIN_NOTIFICATION, notificationData, [adminUser.id])
			}

		}
		await userService.save()

		return res.send({
			status: true,
			data: userService
		})

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}

}


exports.approveBusiness = async function (req, res) {

	try {

		let user = req.user;

		let agentRoles = await general_helper.getAgentRoles();

		if (user.roleName !== "admin" && !agentRoles.includes(user.roleName)) {
			return respondWithError(req, res, 'Error: Action not allowed', null, 405)
		}

		let userServiceId = req.params.id;

		let userService = await UserService.findOne({
			where: {
				id: userServiceId,
				status: 'request_for_approval'
			}
		})

		if (!userService || !userService.serviceDetails) {
			return res.status(400).send({
				status: false,
				message: 'Error: related pending business not found'
			})
		}

		let serviceDetails = JSON.parse(userService.serviceDetails);

		if (!serviceDetails.aboutYourRestaurant || !serviceDetails.aboutYourRestaurant.restaurantName) {
			return res.status(400).send({
				status: false,
				message: 'Error: Restaurant not found'
			})
		}

		let provider = await User.findOne({
			where: {
				id: userService.userId
			},
			include: [
				{
					model: Role,
					where: {
						roleName: 'provider'
					}
				}
			]
		})

		if (!provider) {
			return res.status(400).send({
				status: true,
				message: 'Error: provider not found'
			})
		}

		rpcClient.RestaurantService.changeApprovedStatus({
			status: 'active',
			providerId: provider.id,
			restaurantName: serviceDetails.aboutYourRestaurant.restaurantName
		}, async (err, response) => {
			if (err) {
				console.log(err)
				return respondWithError(req, res, '', null, 500)
			}

			console.log(response)

			provider.isVerified = true;
			provider.status = 'active'
			await provider.save()

			User.update({ status: 'active' }, {
				where: {
					parentId: provider.id,
					status: 'pending',
				},
			})

			userService.status = 'approved'
			await userService.save()

			// Notification Work
			let socketInstance = req.app.get('webSocket')
			let socketEventName = appConstants.SOCKET_EVENTS.BROADCAST_PROVIDER_NOTIFICATION
			let subject = 'Business Approve Notification'
			let description = 'Your Business Request Approved Successfully'
			let appName = 'asaap-restaurant'
			let type = 'user'
			let notificationData = null

			await notification_helper.saveAndSendNotification(socketInstance, socketEventName, [provider.id], subject, description, appName, type, notificationData)

			if (provider && provider.email) {
				let html = `Hello, Your Business registration request has been approved by Geniie admin. Please login to https://provider.geniie.uk for more details.<br>`
				// sendEmailV2("Business Registration Approved Successfully", html, provider.email);

				await sendEmailV2("Business Approval", '', provider.email, 'business/accountApproved.pug', {
					title: 'Business Approval',
					userName: `${provider.firstName} ${provider.lastName}`
				});
			}

			let restaurantUser = await User.findOne({
				where: {
					email: serviceDetails.aboutYourRestaurant.emailAddress
				},
				include: {
					model: Role,
					where: { roleName: "restaurant" }
				}
			})

			console.log("Restaurant User:", restaurantUser)

			if (restaurantUser) {
				let password = generator.generate({
					length: 10,
					numbers: true
				});

				restaurantUser.password = await bcrypt.hash(password, 10);
				await restaurantUser.save()
				await sendEmailV2('Restaurant Admin created Successfully', '', restaurantUser.email, 'restaurant/restaurantCreated.pug', {
					password: password
				})
			}


			return respondWithSuccess(req, res, 'business approved successfully')

		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}

}

exports.rejectBusiness = async function (req, res) {
	try {

		let user = req.user;

		let agentRoles = await general_helper.getAgentRoles();

		if (user.roleName !== "admin" && !agentRoles.includes(user.roleName)) {
			return respondWithError(req, res, 'Error: Action not allowed', null, 405)
		}

		let userServiceId = req.params.id;

		let userService = await UserService.findOne({
			where: {
				id: userServiceId,
				status: 'request_for_approval'
			}
		})

		if (!userService || !userService.serviceDetails) {
			return res.status(400).send({
				status: false,
				message: 'Error: related pending business not found'
			})
		}

		// console.log('serviceDetails', userService)
		let serviceDetails = JSON.parse(userService.serviceDetails);
		if (!serviceDetails.aboutYourRestaurant || !serviceDetails.aboutYourRestaurant.restaurantName) {
			return res.status(400).send({
				status: false,
				message: 'Error: Restaurant not found'
			})
		}

		let provider = await User.findOne({
			where: {
				id: userService.userId
			},
			include: [
				{
					model: Role,
					where: {
						roleName: 'provider'
					}
				}
			]
		})

		if (!provider) {
			return res.status(400).send({
				status: true,
				message: 'Error: provider not found'
			})
		}

		rpcClient.RestaurantService.changeApprovedStatus({
			status: 'rejected',
			providerId: provider.id,
			restaurantName: serviceDetails.aboutYourRestaurant.restaurantName
		}, async (err, response) => {
			if (err) {
				console.log('rpcError=>', err)
				return respondWithError(req, res, '', null, 500)
			}

			// console.log(response)

			// provider.isVerified = false;
			provider.status = 'rejected'
			await provider.save()

			User.update({ status: 'rejected' }, {
				where: {
					parentId: provider.id,
					status: 'pending',
				},
			})

			if (provider && provider.email) {
				let html = `Hello, Your Business registration request has been rejected by Geniie admin. Please contact geniie support for more details.<br>`
				// sendEmailV2("Business Registration Rejected Successfully", html, provider.email);
				await sendEmailV2("Business Rejected", '', provider.email, 'business/approvalFailed.pug', {
					title: 'Business Approval',
					userName: `${provider.firstName} ${provider.lastName}`
				});
			}

			userService.status = 'rejected'
			await userService.save()

			// Notification Work
			let socketInstance = req.app.get('webSocket')
			let socketEventName = appConstants.SOCKET_EVENTS.BROADCAST_PROVIDER_NOTIFICATION
			let subject = 'Business Rejection Notification'
			let description = 'Your Business Request has been rejected by geniie'
			let appName = 'asaap-restaurant'
			let type = 'user'
			let notificationData = null
			await notification_helper.saveAndSendNotification(socketInstance, socketEventName, [provider.id], subject, description, appName, type, notificationData)

			return res.send({
				status: true,
				message: 'business rejected successfully'
			})
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}

}

exports.updateDocumentExpiryDate = async function (req, res) {
	try {
		let payload = req.body.match
		let expiryDate = payload.expiryDate
		let timezone = req.header('timezone');

		let user = req.user;

		let agentRoles = await general_helper.getAgentRoles();

		if (user.roleName !== "admin" && !agentRoles.includes(user.roleName)) {
			return respondWithError(req, res, 'invalid user request', null, 405)
		}
		let requestedData = null;

		if (payload.dataType === 'business' && payload.dataId) {

			requestedData = await UserService.findOne({ where: { id: payload.dataId, status: 'request_for_approval' } })
			if (!requestedData) {
				return respondWithError(req, res, 'business request not found', null, 400)
			}
			if (!payload.serviceDetails) {
				return respondWithError(req, res, 'invalid data!', null, 422)
			}
			requestedData.serviceDetails = JSON.parse(payload.serviceDetails);

		}

		else if (payload.dataType === 'rider' && payload.dataId) {

			requestedData = await Registration.findOne({ where: { id: payload.dataId, status: 'waiting for approval' } })
			if (!requestedData) {
				return respondWithError(req, res, 'registration request not found', null, 400)
			}
			if (!payload.serviceDetails) {
				return respondWithError(req, res, 'invalid data!', null, 422)
			}
			requestedData.registrationData = JSON.parse(payload.serviceDetails);

		}

		else if (payload.dataType === 'restaurant' && payload.dataId) {
			if (!payload.serviceDetails) {
				return respondWithError(req, res, 'invalid data!', null, 422)
			}
		}

		expiryDate = moment(expiryDate).format(constants.TIMESTAMP_FORMAT);
		// console.log('expiryDate=>',expiryDate)
		expiryDate = moment.tz(expiryDate, timezone).tz('UTC').format(constants.DATE_FORMAT);

		// console.log('expiryDate=>',expiryDate)
		// console.log('payload=>',payload)
		let userMedia = await UserMedia.findOne({ where: { userId: payload.userId, mediaType: payload.key, fileName: payload.path } })

		if (userMedia) {

			userMedia.expiryDate = expiryDate
			await userMedia.save();

		} else {

			let data = {
				dataType: payload.dataType,
				dataId: payload.dataId,
				serviceDetails: payload.serviceDetails,
				userId: payload.userId,
				mediaType: payload.key,
				fileName: payload.path,
				expiryDate,
			}
			console.log('data=>', data)


			const restaurantMediaExpiryResponse = () => {
				return new Promise((resolve, reject) => {
					try {
						rpcClient.RestaurantService.changeRestaurantMediaExpiry({
							status: true,
							data: JSON.stringify(data),
						}, function (error, rpcResponseData) {
							if (error) return reject(error)
							return resolve(rpcResponseData)
						})
					} catch (error) {
						console.log(error);
						return reject(error)
					}
				})
			}

			let restaurantMediaExpiryResponseData = await restaurantMediaExpiryResponse()
			if (restaurantMediaExpiryResponseData.status === false) {
				return respondWithError(req, res, restaurantMediaExpiryResponseData.data, null, 400)
			}
		}

		if (payload.dataType === 'business' && payload.dataId) {

			await requestedData.save();

		}
		else if (payload.dataType === 'rider' && payload.dataId) {

			await requestedData.save();

		}

		return respondWithSuccess(req, res, 'document expiry updated successfully', null)

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null)
	}
}

/**
 * Rider Registration APIs
 */

exports.getRegistrations = async function (req, res) {
	let user = req.user;
	let type = req.query.type;

	let agentRoles = await general_helper.getAgentRoles();

	if (user.roles[0].roleName != 'rider' && user.roleName !== "admin" && !agentRoles.includes(user.roleName)) {
		return respondWithError(req, res, 'invalid user request', null, 405)
	}
	let requestWhere = {}
	if (user.roles[0].roleName === 'rider') {
		requestWhere.userId = user.id
	}

	Registration.findAll({
		where: {
			deleteStatus: false,
			...requestWhere,
			status: 'waiting for approval',
		},
		include: [
			{
				model: User,
				where: {
					deleteStatus: false,
				},
				attributes: appConstants.FIELDS.USER,
				include: {
					model: Role,
					where: {
						roleName: type
					},
					attributes: ['roleName', "id"],
				},
				required: true
			}
		],
		order: [['id', 'desc']],
	}).then(data => {
		if (!data || !data.length)
			return res.send({
				message: 'unable to fetched data. data not found',
				data: []
			})

		return res.send({
			message: 'data fetched successfully.',
			data: data
		})
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})

}

exports.updateRegistrationRejection = async function (req, res) {
	let payload = req.body.match

	let user = req.user;

	let agentRoles = await general_helper.getAgentRoles();

	if (user.roleName !== "admin" && !agentRoles.includes(user.roleName)) {
		return respondWithError(req, res, 'invalid user request', null, 405)
	}

	try {
		let registrationRecord = await Registration.findOne({ where: { id: payload.id, status: 'waiting for approval', deleteStatus: false } });
		if (!registrationRecord)
			return respondWithError(req, res, 'rider request not found', null, 400)

		let rider = await User.findOne({
			where: {
				id: registrationRecord.userId
			}
		})

		if (!rider) {
			return res.status(400).send({
				status: true,
				message: 'Error: rider not found'
			})
		}
		registrationRecord.rejectedFields = payload.rejectedFields

		let docs = payload.rejectedFields.filter(a => a.type == 'file')
		if (docs && docs.length > 0) {
			let docPaths = []
			docs.forEach(element => {
				docPaths.push(element.value)
			});

			if (!registrationRecord.isProfileUpdated) {
				// await UserMedia.update(
				// 	{ status: 'rejected' },
				// 	{
				// 		where: {
				// 			userId: registrationRecord.userId,
				// 			deleteStatus: false,
				// 			status: 'pending',
				// 			fileName: {
				// 				[Op.in]: docPaths,
				// 			},
				// 		}
				// 	}
				// )
			}
			else {

				let userMedias = await UserMedia.findAll({
					where: {
						userId: registrationRecord.userId,
						deleteStatus: false,
						fileName: {
							[Op.in]: docPaths,
						},
						[Op.not]: {
							status: 'active',
						}
					}
				})
				userMedias.map(async item => {
					let doc = payload.rejectedFields.find(a => a.value == item.fileName)
					item.rejectionReason = doc.reason
					item.status = 'rejected'
					await item.save()
				})
				await UserMedia.update(
					{ status: 'pending' },
					{
						where: {
							userId: registrationRecord.userId,
							deleteStatus: false,
							status: 'rejected',
							[Op.not]: {
								fileName: {
									[Op.in]: docPaths,
								},
							}
						}
					}
				)
			}

		}

		registrationRecord.save();

		// Notification Work
		if (payload.rejectedFields && payload.rejectedFields.length > 0) {
			let socketInstance = req.app.get('webSocket')
			let socketEventName = appConstants.SOCKET_EVENTS.BROADCAST_RIDER_NOTIFICATION
			let subject = 'Rider Approve Notification'
			let description = 'Your Rider Request has been rejected by geniie'
			let appName = 'asaap-rider'
			let type = 'user'
			let notificationData = registrationRecord.rejectedFields
			await notification_helper.saveAndSendNotification(socketInstance, socketEventName, [rider.id], subject, description, appName, type, notificationData)

			if (rider && rider.email) {
				// await sendEmailV2("Rider has been rejected", '', rider.email, 'rider/fieldRejected.pug', {
				// 	userName: rider.firstName
				// });
				emailQueue.add('Rider Update Rejection', {
					subject: "Rider has been Rejected",
					to: rider.email,
					template: 'rider/fieldRejected.pug',
					templateData: {
						userName: rider.firstName
					}
				})

			}
		}

		return respondWithSuccess(req, res, 'rider rejections updated successfully', null)

	} catch (err) {
		console.log(err);
		return respondWithError(req, res, '', null)
	}

}

exports.approveRegistration = async function (req, res) {

	try {

		let user = req.user;

		let agentRoles = await general_helper.getAgentRoles();

		if (user.roleName !== "admin" && !agentRoles.includes(user.roleName)) {
			return respondWithError(req, res, 'invalid user request', null, 405)
		}

		let registrationId = req.params.id;

		let registrationRecord = await Registration.findOne({
			where: {
				id: registrationId,
				status: 'waiting for approval'
			}
		})

		if (!registrationRecord) {
			return res.status(400).send({
				status: false,
				message: 'Error: Registration Data not found.'
			})
		}

		let rider = await User.findOne({
			where: {
				id: registrationRecord.userId
			},
			include: [
				{
					model: Role,
					where: {
						roleName: 'rider'
					}
				}
			]
		})

		if (!rider) {
			return res.status(400).send({
				status: true,
				message: 'Error: rider not found'
			})
		}
		rider.isVerified = true
		rider.status = "active"
		rider.save()

		// Notification Work
		let socketInstance = req.app.get('webSocket')
		let socketEventName = appConstants.SOCKET_EVENTS.BROADCAST_RIDER_NOTIFICATION
		let subject = 'Rider Approve Notification'
		let description = 'Your Rider Request Approved Successfully'
		let appName = 'asaap-rider'
		let type = 'user'
		let notificationData = null
		await notification_helper.saveAndSendNotification(socketInstance, socketEventName, [rider.id], subject, description, appName, type, notificationData)

		registrationRecord.status = "approved"
		registrationRecord.rejectedFields = null

		await UserMedia.update(
			{ status: 'active' },
			{
				where: {
					userId: registrationRecord.userId,
					deleteStatus: false
				}
			}
		)

		let registrationData = JSON.parse(registrationRecord.registrationData)
		if (registrationData.vehicleInformationId && registrationRecord.isProfileUpdated) {
			let vehicleId = Number(registrationData.vehicleInformationId)
			await VehicleInformation.update({ isSelected: false },
				{
					where: {
						userId: registrationRecord.userId,
						isSelected: true,
						[Op.not]: {
							id: vehicleId
						}
					}
				}
			)
			await VehicleInformation.update({ isSelected: true },
				{
					where: {
						id: vehicleId,
						isSelected: false
					}
				}
			)
		}

		registrationRecord.save()

		let restaurantRidersData = await RestaurantRider.findOne({ where: { riderId: rider.id }, attributes: ['restaurantUserId'] })

		if (restaurantRidersData) {
			rpcClient.riderRPC.AddUser({ userId: rider.id, restaurantUserId: restaurantRidersData.restaurantUserId }, function (err, response) {
				if (err) {
					console.log(err)
				} else {
					// return res.send(response)
					console.log(response)
				}
			})
		}


		if (rider && rider.email) {
			await sendEmailV2("Rider Registration Approved Successfully", '', rider.email, 'rider/approved.pug', {
				userName: rider.firstName
			});
		}
		return res.send({
			status: true,
			message: 'Registration request has been approved successfully.'
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}

}

exports.rejectRegistration = async function (req, res) {
	try {

		let user = req.user;

		let agentRoles = await general_helper.getAgentRoles();

		if (user.roleName !== "admin" && !agentRoles.includes(user.roleName)) {
			return respondWithError(req, res, 'invalid user request', null, 405)
		}

		let registrationId = req.params.id;

		let registrationRecord = await Registration.findOne({
			where: {
				id: registrationId,
				status: 'waiting for approval'
			}
		})

		if (!registrationRecord) {
			return res.status(400).send({
				status: false,
				message: 'Error: Registration Data not found.'
			})
		}

		let rider = await User.findOne({
			where: {
				id: registrationRecord.userId
			},
			include: [
				{
					model: Role,
					where: {
						roleName: 'rider'
					}
				}
			]
		})

		if (!rider) {
			return res.status(400).send({
				status: true,
				message: 'Error: rider not found'
			})
		}

		await UserMedia.update(
			{ status: 'rejected' },
			{
				where: {
					userId: registrationRecord.userId,
				}
			}
		)

		registrationRecord.status = "rejected"
		registrationRecord.save()

		rider.status = 'rejected'
		rider.save()

		// Notification Work
		let socketInstance = req.app.get('webSocket')
		let socketEventName = appConstants.SOCKET_EVENTS.BROADCAST_RIDER_NOTIFICATION
		let subject = 'Rider Rejection Notification'
		let description = 'Your Rider Request has been rejected by geniie'
		let appName = 'asaap-rider'
		let type = 'user'
		let notificationData = null
		await notification_helper.saveAndSendNotification(socketInstance, socketEventName, [rider.id], subject, description, appName, type, notificationData)

		if (rider && rider.email) {
			let html = `Hello, Your rider registration request has been rejected by Geniie admin. Please contact geniie support for more details.<br>`
			// sendEmailV2("Rider Registration Rejected Successfully", html, rider.email);
			await sendEmailV2("Rider Registration Rejected Successfully", '', rider.email, 'rider/approvalFailed.pug', {
				userName: rider.firstName
			});
		}
		return res.send({
			status: true,
			message: 'Registration request has been rejected.'
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}

}

exports.getRiderTill = async function (req, res) {

	Registration.findOne({
		where: [
			{ userId: req.user.id },
		],
	}).then(tillPages => {
		return res.send({
			status: true,
			message: "data found",
			data: tillPages
		})
	}).catch((error) => {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	})
}

exports.saveRiderTill = async function (req, res) {
	// res.setHeader('Content-Type', 'multipart/form-data');
	let rider = req.user;
	let uid = req.user.id;

	let userRoles = await rider.getRoles()

	let isRider = userRoles.find((userRole) => userRole.roleName === 'rider')
	if (!isRider) {
		return res.send({
			status: false,
			message: "Error: user not found"
		})
	}

	let reqData = req.body.match;
	// console.log(reqData)
	// return res.send(reqData)
	if (!reqData?.riderMedia) {
		reqData.riderMedia = {}
		reqData.media = {}
	}

	let files = req.files

	const checkAndUploadFile = (checkFiles, file) => {
		return new Promise(async (resolve, reject) => {
			let alreadyUploaded = checkFiles.findIndex((checkFile) => checkFile.includes(file.originalFilename))

			// console.log('file already updated?', (alreadyUploaded < 0) ? 'No' : 'Yes', checkFiles, file.originalFilename);

			if (alreadyUploaded >= 0) {
				return resolve(false)
			}
			let fileData = await general_helper.uploadDocs(file, md5(rider.id), 'business')
			if (fileData.status) {
				return resolve(`${appConstants.FILE_PREFIX}${md5(rider.id)}/${fileData.fileName}`);
			} else {
				return reject(fileData)
			}
		})
	}

	let fileUploadError = [];
	for (const riderMediaKey in reqData.riderMedia) {
		try {
			reqData.riderMedia[riderMediaKey] = reqData.riderMedia[riderMediaKey] ? JSON.parse(reqData.riderMedia[riderMediaKey]) : []
			reqData.media[riderMediaKey] = reqData.media[riderMediaKey] ? JSON.parse(reqData.media[riderMediaKey]) : []
		} catch (error) {
			console.log(error)
			fileUploadError.push(error.message)
		}
	}

	if (fileUploadError && fileUploadError.length) {
		return res.status(422).send({
			message: `Files couldn't be updated`,
			errors: fileUploadError
		})
	}

	if (files && Object.keys(files).length) {
		for (const fileKey in files) {
			try {
				reqData.riderMedia[fileKey] = reqData.riderMedia[fileKey] ? reqData.riderMedia[fileKey] : []
				reqData.media[fileKey] = reqData.media[fileKey] ? reqData.media[fileKey] : []
			} catch (error) {
				console.log(error)
				fileUploadError.push(error.message)
			}

			if (files[fileKey].length > 1) {
				console.log("Save Rider Multiple files:")

				for (let file = 0; file < files[fileKey].length; file++) {
					try {
						let fileData = await checkAndUploadFile(reqData.riderMedia[fileKey], files[fileKey][file])
						if (fileData) {
							reqData.riderMedia[fileKey].push(fileData)
							reqData.media[fileKey].push({
								path: fileData,
								expiryDate: null,
							})
						}
					} catch (error) {
						fileUploadError.push(files[fileKey][file])
						break
					}
				}

				if (fileUploadError && fileUploadError.length) {
					break
				}

			} else {
				console.log("Save rider Single file:", reqData.riderMedia, fileKey)

				try {
					let fileData = await checkAndUploadFile(reqData.riderMedia[fileKey], files[fileKey])
					if (fileData) {
						reqData.riderMedia[fileKey].push(fileData)
						if (!reqData.media[fileKey]) {
							reqData.media[fileKey] = [{
								path: fileData,
								expiryDate: null,
							}]
						} else {
							reqData.media[fileKey].push({
								path: fileData,
								expiryDate: null,
							})
						}
					}
				} catch (error) {
					fileUploadError.push(files[fileKey])
					break
				}
			}
		}
	}

	if (fileUploadError && fileUploadError.length) {
		return res.status(422).send({
			message: `Files couldn't be updated`,
			errors: fileUploadError
		})
	}

	Registration.findOne({
		where: {
			userId: uid
		}
	}).then(async registrationRecord => {
		if (!registrationRecord) {
			return res.status(400).send({
				status: false,
				message: 'Error: User service data not found'
			})
		}

		try {

			registrationRecord.registrationData = general_helper.mergeDeep(registrationRecord.registrationData ? JSON.parse(registrationRecord.registrationData) : {}, reqData)
			registrationRecord.rejectedFields = reqData.rejectedFields

			let isJson = general_helper.IsValidJSONString(reqData.rejectedFields)
			if (isJson) {
				registrationRecord.rejectedFields = JSON.parse(reqData.rejectedFields)
			}
			await registrationRecord.save()

			if (reqData.finalPage) {
				await businessHelper.riderRegistration(rider, registrationRecord)
				let adminUser = await User.findOne({ include: { model: Role, where: { roleName: 'admin' } } })

				if (adminUser) {
					let notificationData = await Notification.findOne({
						where: {
							appName: 'super_admin',
							'notificationData.id': registrationRecord.id
						},
						include: {
							model: UserNotification,
							where: {
								userId: adminUser.id,
								status: 'unread'
							}
						}
					})

					let subject = "Rider Registration"
					let description = `${registrationRecord.registrationData.personalInformation.firstName} requested as new rider`
					if (!notificationData) {
						if (rider && rider.email) {
							// let html = `Hello, Your rider registration request with updated details has been sent to Geniie admin. Stay tuned for more details.<br>`
							// sendEmailV2("Rider Registration Sent for Approval", html, rider.email);
							await sendEmailV2("Rider Registration Sent for Approval", '', rider.email, 'rider/welcomeSubmit.pug');
						}
					} else {
						subject = "Update Rider"
						description = `${registrationRecord.registrationData.personalInformation.firstName} requested to update data`
					}


					let notificationUserService = registrationRecord
					try {
						notificationUserService = notificationUserService.toJSON()
						notificationUserService.redirectionLink = '/approval_request/rider'
					} catch (error) {
						console.log(error)
					}

					notificationData = await Notification.create({
						subject: subject,
						description: description,
						notificationData: notificationUserService,
						appName: 'super_admin',
						type: 'user'
					})

					await UserNotification.create({
						notificationId: notificationData.id,
						userId: adminUser.id
					})

					try {
						notificationData = notificationData.toJSON()
						notificationData.status = 'unread'
					} catch (error) {
						console.log(error)
					}
					socketHelper.socketPushDataWithInstance(req.app.get('webSocket'), appConstants.SOCKET_EVENTS.BROADCAST_ADMIN_NOTIFICATION, notificationData, [adminUser.id])
				}

			}
			return res.send({
				status: true,
				data: registrationRecord
			})
		} catch (error) {
			console.log(error)
			return respondWithError(req, res, '', null, 500)
		}

	}).catch(err => {
		console.log(err)
		return respondWithError(req, res, '', null, 500)
	})

}

exports.saveRider = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();

	try {
		let data = req.body.match;
		let email = data.user.email;
		data.user.username = email
		let n = 10;
		let number = data.user.phoneNumber.substring(data.user.phoneNumber.length - n)

		let country = await Country.findOne({
			where: {
				id: data.location.countryId
			}
		});

		if (!country) {
			return res.status(400).send({
				status: false,
				message: "Error: related country not found"
			})
		}

		let city = await City.findOne({
			where: {
				id: data.location.cityId,
			}
		});

		if (!city) {
			return res.status(400).send({
				status: false,
				message: "Error: related city not found"
			})
		}

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
		console.log('userExists', userExists);
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
			password: hash,
			number: number
		});
		await user.save({ transaction: sequelizeTransaction })

		await user.addRole(riderRole, { transaction: sequelizeTransaction })

		let registrationData = new Registration({
			userId: user.id,
			roleId: riderRole.id,
			registrationData: req.body.match
		});
		await registrationData.save({ transaction: sequelizeTransaction });

		let userAddress = new UserAddress({
			...data.location,
			userId: user.id
		});

		await userAddress.save({ transaction: sequelizeTransaction });

		// let html = `Hello, You are successfully registered on Geniie for rider. Please login to https://rider.geniie.uk. Your app password is <b>${pass}</b>.<br>`
		await sendEmailV2("Rider Registration", '', email, 'rider/welcome.pug', {
			password: pass,
			mainURL: constants.RIDER_URL
		});

		sequelizeTransaction.commit()

		return res.send({
			message: "Your are registered successfully.", data: {
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