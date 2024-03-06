// libraries
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const randomize = require('randomatic');
const moment = require("moment")
const mime = require('mime');
const md5 = require('md5');

const { Op } = require('sequelize')

// Config
// var redisJwt = require('../../../config/jwt');
// const redisClient = require("../../../config/redis");


// Custom Libraries
const { sendEmailV2 } = require('../../lib/email');
const { twilioClient } = require('../../lib/twilio')
const { sequelize_conn } = require("../../../config/database");
const rpcClient = require('../../lib/rpcClient')

// Modals
const User = require('../SqlModels/User');
const UserAuth = require('../SqlModels/UserAuth');
const UserAddress = require('../SqlModels/UserAddress');
const OtpPhoneNumber = require('../SqlModels/OtpPhoneNumber');
const Gender = require('../SqlModels/Gender');
const Device = require('../SqlModels/Device');
const Currency = require('../SqlModels/Currency');
const BankAccount = require('../SqlModels/BankAccount');
const VehicleInformation = require('../SqlModels/VehicleInformation')
const UserMedia = require('../SqlModels/UserMedia');
const Registration = require('../SqlModels/Registration');
const UserAccountBalance = require('../SqlModels/UserAccountBalance');
const Payment = require('../SqlModels/Payment');
const FinancialAccountTransaction = require('../SqlModels/FinancialAccountTransaction');
const Role = require('../SqlModels/Role');
const Notification = require('../SqlModels/Notification');
const UserNotification = require('../SqlModels/UserNotification');
const RewardPointHistory = require('../SqlModels/RewardPointHistory');
const SuperAdminRoutePermission = require('../SqlModels/SuperAdminRoutePermission');
const SuperAdminActionPermission = require('../SqlModels/SuperAdminActionPermission');

// helpers
const general_helpers = require('../../helpers/general_helper')
const authHelpers = require('../../helpers/authHelper')
const { respondWithError, respondWithSuccess } = require('../../helpers/httpHelper');

// Constants
const constants = require('../../../config/constants');
const appConstants = require('../Constants/app.constants');
const socketHelper = require('../../helpers/socketHelper');
const general_helper = require('../../helpers/general_helper');

// ************ Get User All Data ************
exports.user = async function (req, res) {
	try {
		let user = req.user;

		// console.log(user.getUserAccountBalances);
		let accountBalance = await user.getAccountBalance({
			include: [{
				model: Currency,
				attributes: ['currencySymbol']
			}]
		})

		let userData = user.toJSON();

		userData = authHelpers.deleteOtherUserInfo(userData);

		if (userData.genderId) {
			let genderData = await Gender.findOne({ where: { id: userData.genderId } })
			if (genderData) {
				userData.gender = genderData.gender
			}
		}

		if (userData.dob) {
			let dob = moment(userData.dob)
			let dateNow = moment()
			userData.age = dateNow.diff(dob, 'years')
		}
		else {
			userData.age = null
		}


		if (!userData.profileImage) {
			userData.profileImage = 'defaultProfile.png'
		}

		userData.accountBalance = accountBalance

		if (userData.roles[0].isAgent) {

			let role = await Role.findOne({
				where: {
					roleName: userData.roleName
				},
				include: [
					{
						model: SuperAdminRoutePermission,
						required: false,
					},
					{
						model: SuperAdminActionPermission,
						required: false,
					}
				]
			})

			userData.roles = [role]
		}

		return res.send({
			message: "User data fetched Successfully.",
			user: userData,
			isComponentAllowed: true
		});
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			message: 'Error: Internal server error'
		})
	}

}

// ************ Request to Verify Email ************
exports.requestToVerifyEmail = async function (req, res) {
	try {
		let authUser = req.user
		let email = authUser.email
		let username = authUser.username
		let user = await User.findOne({ where: { email: email } })
		if (user) {
			if (user.isEmailVerified) {
				return res.status(400).send({ message: "Email already verified." })
			}
			const emailVerificationCode = generator.generate({
				length: 12,
				numbers: true
			})

			const emailVerificationCodeHash = await bcrypt.hash(`${emailVerificationCode}`, 10);
			user.emailVerificationCode = emailVerificationCodeHash

			const token = jwt.sign({ user: { emailVerificationCode, email } }, constants.APP_SECRET, { expiresIn: '20m' });
			let verificationLink = `${constants.HOST}/auth/verifyEmail?token=${token}`;
			let html = `Hello ${username},<br> Please Click on the link to verify your email.<br><a href=${verificationLink}>Click here to verify</a>`
			console.log(html);

			await sendEmailV2("Please confirm your Email account", html, email)

			await user.save()

			return res.status(200).send({ message: 'Please check your email to verify your account' })

		} else {
			return res.status(400).send({ message: "Unable verify email. User not found." })
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}

// ************ Update Password ************
exports.updatePassword = async function (req, res) {
	try {
		let authUser = req.user
		// let email = authUser.email

		let currentPassword = req.body.currentPassword
		let newPassword = req.body.newPassword

		let user = await User.findOne({ where: { id: authUser.id } })
		if (!user) {
			return res.status(400).send({ message: `Error: Invalid request.` })
		}

		if (!currentPassword && user.password) {
			return res.status(422).send({
				message: 'Error: bad request'
			})
		}
		if (currentPassword == newPassword) {
			return res.status(422).send({
				message: "You can't enter recent password."
			})
		}

		let hashedPassword = await bcrypt.hash(`${newPassword}`, 10);

		if (!user.password) {
			user.password = hashedPassword
		} else {
			let isMatched = await bcrypt.compare(currentPassword, user.password);
			if (!isMatched) {
				return res.status(400).send({ message: `Current password not matched.` })
			}
			user.password = await bcrypt.hash(`${newPassword}`, 10);
		}

		user.firstTimeChangedPass = true

		await user.save()
		try {
			await sendEmailV2("Provider password changed successfully", '', authUser.email, 'user/passwordChanged.pug', {
				title: 'Password Changed',
				userName: `${authUser.firstName} ${authUser.lastName}`
			});
		} catch (error) {
			console.log(error);
		}

		return res.status(200).send({ message: 'Password has been updated successfully.' });
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}

exports.checkAdminAcl = async function (req, res) {
}

exports.updateProfile = async function (req, res) {
	try {
		let authUser = req.user

		let user = await User.findOne({
			where: {
				[Op.and]: [
					{
						id: authUser.id
					},
					{
						deleteStatus: false
					}
				]
			}
		})

		if (!user) {
			return res.status(400).json({ message: `Invalid request.` })
		}

		let newUsername = req.body.username;
		if (newUsername) {
			let checkIfUsernameExists = await User.findAll({
				where: {
					[Op.and]: [
						{
							[Op.not]: { id: authUser.id }
						},
						{
							username: newUsername
						}
					]
				}
			})

			if (checkIfUsernameExists && checkIfUsernameExists.length) {
				return res.status(400).send({
					status: false,
					message: 'Error: Username already exist'
				})
			}
			user.username = newUsername;

		}


		if (req.files && req.files.profileImage) {
			let profileImage = req.files.profileImage;
			let profileImageMimeType = profileImage.type
			if (!appConstants.IMAGE_SUPPORTED_FORMATS.includes(profileImageMimeType.toLowerCase())) {
				return res.status(422).send({
					status: false,
					msg: "Error: one of the uploaded file Extension is not valid.",
				});
			}

			let currentDate = moment().format("YYYYMMDDHHmmss")

			// apk specifications
			let profileImageName = `profile-${currentDate}.png`;
			let profileImageTarget = path.join(__dirname, "../../storage/images/" + profileImageName);
			let moveProfileImageError = await general_helpers.move(profileImage.path, profileImageTarget)
			if (moveProfileImageError) {
				console.log(error)
				return res.status(500).send({
					status: false,
					msg: 'Error: Internal server error'
				})
			}

			let profileImageStats = fs.statSync(profileImageTarget);
			let profileImageByte = profileImageStats.size
			let profileImageSize = general_helpers.formatBytes(profileImageByte);

			user.profileImage = profileImageName;
			user.profileImageByte = profileImageByte;
			user.profileImageSize = profileImageSize
		}

		user.dob = (req.body.dob) ? req.body.dob : user.dob;

		user.gender = (req.body.gender) ? req.body.gender : user.gender;

		user.genderId = (req.body.genderId) ? Number(req.body.genderId) : user.genderId;


		user.fullName = (req.body.fullName) ? req.body.fullName : user.fullName;

		user.firstName = (req.body.firstName) ? req.body.firstName : user.firstName;
		user.lastName = (req.body.lastName) ? req.body.lastName : user.lastName;
		let userAddress;
		if (req.body.postCode || req.body.cityId || req.body.address || req.body.latitude || req.body.longitude || req.body.countryId) {
			userAddress = await UserAddress.findOne({ where: { userId: user.id } })
			console.log("User Address", userAddress)
			if (userAddress) {
				userAddress.postCode = (req.body.postCode) ? req.body.postCode : userAddress.postCode;
				userAddress.address = (req.body.address) ? req.body.address : userAddress.address;
				userAddress.cityId = (req.body.cityId) ? req.body.cityId : userAddress.cityId;
				userAddress.countryIdId = (req.body.countryIdId) ? req.body.countryIdId : userAddress.countryIdId;
				userAddress.latitude = (req.body.latitude) ? req.body.latitude : userAddress.latitude;
				userAddress.longitude = (req.body.longitude) ? req.body.longitude : userAddress.longitude;
				await userAddress.save()
			} else {
				if (req.body.postCode && req.body.cityId && req.body.address && req.body.latitude && req.body.longitude && req.body.countryId) {
					userAddress = await UserAddress.create({
						userId: user.id,
						address: req.body.address,
						postCode: req.body.postCode,
						latitude: req.body.latitude,
						longitude: req.body.longitude,
						cityId: req.body.cityId,
						countryId: req.body.countryId,
					})
				}
			}

		}


		await user.save()
		let userData = authHelpers.deleteOtherUserInfo(user.toJSON())

		if (userData.genderId) {
			let genderData = await Gender.findOne({ where: { id: user.genderId } })
			if (genderData) {
				userData.gender = genderData.gender
			}
		}

		if (userData.dob) {
			let dob = moment(userData.dob)
			let dateNow = moment()
			userData.age = dateNow.diff(dob, 'years')
		}
		else {
			userData.age = null
		}

		if (!userData.profileImage) {
			userData.profileImage = 'defaultProfile.png'
		}
		return res.status(200).json({
			message: 'Profile has been updated successfully.',
			user: userData,
			is_guest_user: false,
			userAddress: userAddress
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}

}

exports.updateBankDetails = async function (req, res) {
	try {
		let authUser = req.user

		let user = await User.findOne({
			where: {
				id: authUser.id,
				deleteStatus: false
			}
		})

		if (!user) {
			return res.status(400).json({ message: `Invalid request.` })
		}

		let bankDetails = await BankAccount.findOne({ where: { userId: user.id } })
		// console.log("User Address", userAddress)
		if (bankDetails) {
			bankDetails.postCode = (req.body.postCode) ? req.body.postCode : bankDetails.postCode;
			bankDetails.street = (req.body.billingAddress) ? req.body.billingAddress : bankDetails.street;
			bankDetails.cityId = (req.body.cityId) ? req.body.cityId : bankDetails.cityId;
			bankDetails.countryId = (req.body.countryId) ? req.body.countryId : bankDetails.countryId;
			bankDetails.sortCode = (req.body.sortCode) ? req.body.sortCode : bankDetails.sortCode;
			bankDetails.name = (req.body.name) ? req.body.name : bankDetails.name;
			bankDetails.holderName = (req.body.holderName) ? req.body.holderName : bankDetails.holderName;
			bankDetails.accountNumber = (req.body.accountNumber) ? req.body.accountNumber : bankDetails.accountNumber;
			await bankDetails.save()
		} else {
			bankDetails = await BankAccount.create({
				userId: user.id,
				street: req.body.billingAddress,
				postCode: req.body.postCode,
				cityId: req.body.cityId,
				countryId: req.body.countryId,
				sortCode: req.body.sortCode,
				name: req.body.name,
				holderName: req.body.holderName,
				accountNumber: req.body.accountNumber,
			})

		}
		return res.status(200).json({
			message: 'Bank details has been updated successfully.',
			data: bankDetails,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}

}

exports.updateVehicleInformation = async function (req, res) {
	try {
		let user = req.user;
		let type = req.body.type;


		let vehicleInformation = await VehicleInformation.findOne({
			where: {
				userId: user.id,
				type: type
			}
		})
		if ((type === 'bike' || type === 'car') && (!req.files.license && !req.files.motorInsurance)) {
			return respondWithError(req, res, 'Invalid Data', null, 422)
		}

		if (!vehicleInformation) {
			vehicleInformation = new VehicleInformation({
				userId: user.id,
				type: type
			})
		}
		if (type == 'bicycle') {

			await VehicleInformation.update({
				isSelected: false
			}, {
				where: {
					userId: user.id,
					type: {
						[Op.ne]: type
					}
				}
			})


			vehicleInformation.isSelected = true

			await vehicleInformation.save()
		}


		let media = {
			license: [],
			motorInsurance: []
		}


		if (req.files && req.files.license) {
			let license = req.files.license;

			let licenseNumberData = await general_helpers.uploadDocs(license, md5(user.id), 'business')

			if (!licenseNumberData || !licenseNumberData.status) {
				return respondWithError(req, res, '', null, 500)
			}

			// await general_helpers.removeOldAndAddNew(UserMedia, {
			// 	userId: user.id,
			// 	mediaType: 'license',
			// 	fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${licenseNumberData.fileName}`
			// }, {
			// 	userId: user.id,
			// 	mediaType: 'license'
			// })

			await UserMedia.update({ deleteStatus: true }, {
				where: {
					userId: req.user.id,
					mediaType: 'license',
					status: { [Op.in]: ['pending', 'rejected'] },
					deleteStatus: false
				}
			})

			await UserMedia.create({
				userId: req.user.id,
				mediaType: 'license',
				fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${licenseNumberData.fileName}`
			})

			media.license.push({
				path: `${appConstants.FILE_PREFIX}${md5(user.id)}/${licenseNumberData.fileName}`,
				expiryDate: null
			})
			// userMedia.license.push(licenseNumberData.fileName)
		}

		if (req.files && req.files.motorInsurance) {
			let motorInsurance = req.files.motorInsurance;

			let motorInsuranceData = await general_helpers.uploadDocs(motorInsurance, md5(user.id), 'business')

			if (!motorInsuranceData || !motorInsuranceData.status) {
				return respondWithError(req, res, '', null, 500)
			}


			// await general_helpers.removeOldAndAddNew(UserMedia, {
			// 	userId: user.id,
			// 	mediaType: 'motorInsurance',
			// 	fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${motorInsuranceData.fileName}`
			// }, {
			// 	userId: user.id,
			// 	mediaType: 'motorInsurance'
			// })

			await UserMedia.update({ deleteStatus: true }, {
				where: {
					userId: req.user.id,
					mediaType: 'motorInsurance',
					status: { [Op.in]: ['pending', 'rejected'] },
					deleteStatus: false
				}
			})

			await UserMedia.create({
				userId: req.user.id,
				mediaType: 'motorInsurance',
				fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${motorInsuranceData.fileName}`
			})

			// await general_helpers.upsert(UserMedia, {
			// 	fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${motorInsuranceData.fileName}`,
			// 	vehicleId: vehicleInformation.id
			// }, {
			// 	where: {
			// 		userId: user.id,
			// 		mediaType: 'motorInsurance'
			// 	}
			// })
			media.motorInsurance.push({
				path: `${appConstants.FILE_PREFIX}${md5(user.id)}/${motorInsuranceData.fileName}`,
				expiryDate: null
			})
			// userMedia.motorInsurance.push(motorInsuranceData.fileName)

		}

		let requestData = {
			media,
		}
		if (type == 'bicycle' && vehicleInformation) {
			requestData.vehicleInformationId = vehicleInformation.id

			await UserMedia.update({ deleteStatus: true }, { where: { userId: req.user.id, mediaType: { [Op.in]: ['license', 'motorInsurance'] }, deleteStatus: false } })
		}

		let registrationData = await Registration.findOne({
			where: {
				userId: user.id
			}
		})

		if (!registrationData) {
			return res.status(400).send({
				message: 'Registration data not found'
			})
		}


		registrationData.registrationData = general_helper.mergeDeep(registrationData.registrationData ? JSON.parse(registrationData.registrationData) : {}, requestData)
		registrationData.isProfileUpdate = true;
		registrationData.status = 'waiting for approval'
		await registrationData.save()

		let adminUser = await User.findOne({ include: { model: Role, where: { roleName: 'admin' } } })

		if (adminUser) {
			let notificationData = await Notification.findOne({
				where: {
					appName: 'super_admin',
					'notificationData.id': registrationData.id
				},
				include: {
					model: UserNotification,
					where: {
						userId: adminUser.id,
						status: 'unread'
					}
				}
			})

			// let subject = "Rider Registration"
			let subject = "Update Rider"
			let description = `${user.firstName} requested for document updates`
			// if (!notificationData) {
			// 	if (rider && rider.email) {
			// 		// let html = `Hello, Your rider registration request with updated details has been sent to Geniie admin. Stay tuned for more details.<br>`
			// 		// sendEmailV2("Rider Registration Sent for Approval", html, rider.email);
			// 		sendEmailV2("Rider Registration Sent for Approval", '', rider.email, 'rider/welcomeSubmit.pug');
			// 	}
			// } else {
			// 	description = `${registrationRecord.registrationData.personalInformation.firstName} requested to update data`
			// }

			try {
				registrationData = registrationData.toJSON()
				registrationData.redirectionLink = '/approval_request/rider_request'
			} catch (error) {
				console.log(error)
			}

			notificationData = await Notification.create({
				subject: subject,
				description: description,
				notificationData: registrationData,
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

		let userMedias = await UserMedia.findAll({
			where: {
				userId: user.id,
				deleteStatus: false
			}
		})

		let responseData = {
			// vehicle_information: vehicleInformation,
			user_medias: userMedias
		}
		if (type != 'bicycle' && vehicleInformation) {
			return respondWithSuccess(req, res, 'Your vehicle information is updated and pending for approval', responseData)
		} else {
			responseData.vehicle_information = vehicleInformation
			return respondWithSuccess(req, res, 'Your vehicle information is updated', responseData)
		}
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.updateDocument = async function (req, res) {
	try {

		let user = req.user;


		let media = {
			bagPhoto: [],
			photoId: [],
			nationalId: [],
			criminalCheck: []
		}
		let userUploadedMedias = []
		// Bag Photo
		if (req.files && req.files.bagPhoto) {
			let bagPhoto = req.files.bagPhoto;

			let bagPhotoData = await general_helpers.uploadDocs(bagPhoto, md5(user.id), 'business')

			if (!bagPhotoData || !bagPhotoData.status) {
				return respondWithError(req, res, '', null, 500)
			}

			media.bagPhoto.push({
				path: `${appConstants.FILE_PREFIX}${md5(user.id)}/${bagPhotoData.fileName}`,
				expiryDate: null
			})
			// userMedia.bagPhoto.push(bagPhotoData.fileName)
			// userUploadedMedias.push({
			// 	userId: req.user.id,
			// 	mediaType: 'bagPhoto',
			// 	fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${bagPhotoData.fileName}`
			// })
			await UserMedia.update({ deleteStatus: true }, {
				where: {
					userId: req.user.id,
					mediaType: 'bagPhoto',
					status: { [Op.in]: ['pending', 'rejected'] },
					deleteStatus: false
				}
			})

			await UserMedia.create({
				userId: req.user.id,
				mediaType: 'bagPhoto',
				fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${bagPhotoData.fileName}`
			})
		}

		// Photo ID
		if (req.files && req.files.photoId) {
			let photoId = req.files.photoId;

			let photoIdData = await general_helpers.uploadDocs(photoId, md5(user.id), 'business')

			if (!photoIdData || !photoIdData.status) {
				return respondWithError(req, res, '', null, 500)
			}

			media.photoId.push({
				path: `${appConstants.FILE_PREFIX}${md5(user.id)}/${photoIdData.fileName}`,
				expiryDate: null
			})
			// userMedia.photoId.push(photoIdData.fileName)
			// userUploadedMedias.push({
			// 	userId: req.user.id,
			// 	mediaType: 'photoId',
			// 	fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${photoIdData.fileName}`
			// })
			await UserMedia.update({ deleteStatus: true }, {
				where: {
					userId: req.user.id,
					mediaType: 'photoId',
					status: { [Op.in]: ['pending', 'rejected'] },
					deleteStatus: false
				}
			})
			await UserMedia.create({
				userId: req.user.id,
				mediaType: 'photoId',
				fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${photoIdData.fileName}`
			})
		}

		// National ID
		if (req.files && req.files.nationalId) {
			let nationalId = req.files.nationalId;

			let nationalIdData = await general_helpers.uploadDocs(nationalId, md5(user.id), 'business')

			if (!nationalIdData || !nationalIdData.status) {
				return respondWithError(req, res, '', null, 500)
			}

			media.nationalId.push({
				path: `${appConstants.FILE_PREFIX}${md5(user.id)}/${nationalIdData.fileName}`,
				expiryDate: null
			})
			// userMedia.nationalId.push(nationalIdData.fileName)
			// userUploadedMedias.push({
			// 	userId: req.user.id,
			// 	mediaType: 'nationalId',
			// 	fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${nationalIdData.fileName}`
			// })
			await UserMedia.update({ deleteStatus: true }, {
				where: {
					userId: req.user.id,
					mediaType: 'nationalId',
					status: { [Op.in]: ['pending', 'rejected'] },
					deleteStatus: false
				}
			})
			await UserMedia.create({
				userId: req.user.id,
				mediaType: 'nationalId',
				fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${nationalIdData.fileName}`
			})
		}

		// criminalCheck
		if (req.files && req.files.criminalCheck) {
			let criminalCheck = req.files.criminalCheck;

			let criminalCheckData = await general_helpers.uploadDocs(criminalCheck, md5(user.id), 'business')

			if (!criminalCheckData || !criminalCheckData.status) {
				return respondWithError(req, res, '', null, 500)
			}
			media.criminalCheck.push({
				path: `${appConstants.FILE_PREFIX}${md5(user.id)}/${criminalCheckData.fileName}`,
				expiryDate: null
			})
			// userMedia.criminalCheck.push(criminalCheckData.fileName)
			// userUploadedMedias.push({
			// 	userId: req.user.id,
			// 	mediaType: 'criminalCheck',
			// 	fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${criminalCheckData.fileName}`
			// })
			await UserMedia.update({ deleteStatus: true }, {
				where: {
					userId: req.user.id,
					mediaType: 'criminalCheck',
					status: { [Op.in]: ['pending', 'rejected'] },
					deleteStatus: false
				}
			})
			await UserMedia.create({
				userId: req.user.id,
				mediaType: 'criminalCheck',
				fileName: `${appConstants.FILE_PREFIX}${md5(user.id)}/${criminalCheckData.fileName}`
			})
		}

		let requestData = {
			media
		}

		let registrationData = await Registration.findOne({
			where: {
				userId: user.id
			}
		})

		if (!registrationData) {
			return res.status(400).send({
				message: 'Registration data not found'
			})
		}


		registrationData.registrationData = general_helper.mergeDeep(registrationData.registrationData ? JSON.parse(registrationData.registrationData) : {}, requestData)
		registrationData.isProfileUpdate = true;
		registrationData.status = 'waiting fro approval'
		await registrationData.save()

		let adminUser = await User.findOne({ include: { model: Role, where: { roleName: 'admin' } } })

		if (adminUser) {
			let notificationData = await Notification.findOne({
				where: {
					appName: 'super_admin',
					'notificationData.id': registrationData.id
				},
				include: {
					model: UserNotification,
					where: {
						userId: adminUser.id,
						status: 'unread'
					}
				}
			})

			// let subject = "Rider Registration"
			let subject = "Update Rider"
			let description = `${user.firstName} requested for document updates`
			// if (!notificationData) {
			// 	if (rider && rider.email) {
			// 		// let html = `Hello, Your rider registration request with updated details has been sent to Geniie admin. Stay tuned for more details.<br>`
			// 		// sendEmailV2("Rider Registration Sent for Approval", html, rider.email);
			// 		sendEmailV2("Rider Registration Sent for Approval", '', rider.email, 'rider/welcomeSubmit.pug');
			// 	}
			// } else {
			// 	description = `${registrationRecord.registrationData.personalInformation.firstName} requested to update data`
			// }

			try {
				registrationData = registrationData.toJSON()
				registrationData.redirectionLink = '/approval_request/rider_request'
			} catch (error) {
				console.log(error)
			}

			notificationData = await Notification.create({
				subject: subject,
				description: description,
				notificationData: registrationData,
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

		let userMedias = await UserMedia.findAll({
			where: {
				userId: user.id,
				deleteStatus: false
			}
		})
		return respondWithSuccess(req, res, 'document media is updated and pending for approval', userMedias)

	} catch (error) {
		return respondWithError(req, res, '', null, 500)
	}
}

exports.updateUserPhoneNumber = async function (req, res) {
	try {
		let authUser = req.user;

		let countryCode = req.body.countryCode
		let pNumber = req.body.number;
		let phoneNumber = `${countryCode}${pNumber}`;
		// TODO: add check for not chang epassword of conusmer
		// console.log('req.body.phoneNumber', req.body.phoneNumber, 'req.body.countryCode', req.body.countryCode, 'req.body.number', )
		let user = await User.findOne({
			where: {
				[Op.and]: {
					phoneNumber: phoneNumber,
					verifyPhoneNumber: true
				}
			}
		})


		// check if the given number and user number are same and verified send response that number is already verified
		if (user) {
			if (user.id === authUser.id) {
				return res.status(400).send({
					status: false,
					message: "Given phone number is already verified"
				})
			} else {
				console.log('phone number is used by another account')
				return res.status(400).send({
					status: false,
					// message: `Phone number couldn't be changed.`
					message: `phone number is used by another account.`
				})
			}
		}

		let ipAddress = req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.header('x-real-ip') ? req.header('x-real-ip') : req.connection.remoteAddress

		let otpData = await OtpPhoneNumber.findOne({
			where: {
				[Op.and]: {
					userId: req.user.id,
					// phoneNumber: phoneNumber,
					// verifyPhoneNumber: false
				}
			}
		})

		let isProduction = req.body.isProduction;

		let otpCode = 7860;

		if (isProduction) {
			otpCode = randomize('0', 4)
		}

		let otpCodeHash = await bcrypt.hash(`${otpCode}`, 10)

		let todayDateTime = moment().format('YYYY-MM-DD hh:mm:ss')
		let todayOnlyDate = moment(todayDateTime).format('YYYY-MM-DD')
		let timeNow = moment(todayDateTime).format("hh:mm:ss")

		let lastAttemptDateTime = null;
		let lastAttemptOnlyDate = null
		let lastTime = null
		if (otpData) {
			// console.log(otpCode)
			lastAttemptDateTime = otpData.lastAttempt
			console.log('lastAttemptDateTime:', lastAttemptDateTime)

			lastAttemptOnlyDate = moment(lastAttemptDateTime).format('YYYY-MM-DD')
			console.log('lastAttemptOnlyDate:', lastAttemptOnlyDate)

			lastTime = moment(lastAttemptDateTime).add(otpData.duration, 'minutes').format("hh:mm:ss")
			console.log('lastTime:', lastTime)
			// lastTime = moment(lastAttemptDateTime).format("hh:mm:ss")
		}


		if (!otpData) {

			// save to OTP modal, send OTP and send response
			otpData = new OtpPhoneNumber()

			otpData.userId = req.user.id

			// otpData.lastAttempt = todayDateTime
			otpData.duration = 1 * 2

			// await otpData.save();

			if (!otpCode) {
				return res.status(400).send({
					status: false,
					message: 'Error: OTP is not created'
				})
			}

			// console.log(otpCreated)

		} else {
			console.log('CASE 1:', todayOnlyDate, lastAttemptOnlyDate, todayOnlyDate > lastAttemptOnlyDate)
			if (todayOnlyDate > lastAttemptOnlyDate) {
				otpData.attempts = 1
				otpData.duration = 1 * 2
			} else {
				console.log('CASE 2:', otpData.attempts, constants.TWILIO_OTP_ATTEMPTS, otpData.attempts >= constants.TWILIO_OTP_ATTEMPTS)
				console.log('CASE 3:', timeNow, lastTime, timeNow < lastTime)
				// if (otpData.attempts >= app_constants.TWILIO_OTP_ATTEMPTS) {
				//     return res.status(400).send({
				//         status: false,
				//         message: 'Error: OTP attempts are exceeded'
				//     })
				// }
				// else if (timeNow < lastTime) {
				//     return res.status(400).send({
				//         status: false,
				//         message: 'Error: OTP attempts time exceeded'
				//     })
				// }
				let newAttempts = otpData.attempts + 1
				otpData.attempts = newAttempts
				otpData.duration = newAttempts * 2
			}
		}

		let message = null

		if (isProduction) {
			message = await twilioClient.messages
				.create({
					body: `<#> Your OTP code is ${otpCode}. NEVER share this with anyone. ${constants.APP_TITLE} will never call or ask for this code. ${constants.OTP_AUTOFILL_CODE}`,
					// from: '+15017122661',
					messagingServiceSid: constants.TWILIO_MESSAGE_SERVICE_ID,
					to: phoneNumber
				})
		}

		console.log('message:', message)

		// authUser.newPhoneNumber = phoneNumber;
		// authUser.newNumber = pNumber;
		// authUser.newCountryCode = countryCode

		authUser.verifyNewPhoneNumber = false;

		otpData.ipAddress = ipAddress
		otpData.otpCode = otpCodeHash

		otpData.lastAttempt = todayDateTime;
		otpData.phoneNumber = phoneNumber;
		otpData.number = pNumber;
		otpData.countryCode = countryCode;
		otpData.verifyPhoneNumber = false
		await otpData.save()
		await authUser.save()

		return res.send({
			status: true,
			message: "OTP sent to phone number successfully"
		})

		// .then(async (message) => {

		// }).catch((error) => {
		//     console.log(error)
		//     return res.status(500).send({
		//         status: false,
		//         message: "Error: Internal server error"
		//     })
		// })
		// ;
		return
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}
exports.updatePhoneNumber = async function (req, res) {
	try {
		let authUser = req.user;

		let countryCode = req.body.countryCode
		let pNumber = req.body.number;
		let phoneNumber = `${countryCode}${pNumber}`;

		// console.log('req.body.phoneNumber', req.body.phoneNumber, 'req.body.countryCode', req.body.countryCode, 'req.body.number', )
		let user = await User.findOne({
			where: {
				[Op.and]: {
					phoneNumber: phoneNumber,
					verifyPhoneNumber: true
				}
			}
		})


		// check if the given number and user number are same and verified send response that number is already verified
		if (user) {
			if (user.id === authUser.id) {
				return res.status(400).send({
					status: false,
					message: "Given phone number is already verified"
				})
			} else {
				console.log('phone number is used by another account')
				return res.status(400).send({
					status: false,
					// message: `Phone number couldn't be changed.`
					message: `phone number is used by another account.`
				})
			}
		}

		let ipAddress = req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.header('x-real-ip') ? req.header('x-real-ip') : req.connection.remoteAddress

		let otpData = await OtpPhoneNumber.findOne({
			where: {
				[Op.and]: {
					userId: req.user.id,
					// phoneNumber: phoneNumber,
					// verifyPhoneNumber: false
				}
			}
		})

		let isProduction = req.body.isProduction;

		let otpCode = 7860;

		if (isProduction) {
			otpCode = randomize('0', 4)
		}

		let otpCodeHash = await bcrypt.hash(`${otpCode}`, 10)

		let todayDateTime = moment().format('YYYY-MM-DD hh:mm:ss')
		let todayOnlyDate = moment(todayDateTime).format('YYYY-MM-DD')
		let timeNow = moment(todayDateTime).format("hh:mm:ss")

		let lastAttemptDateTime = null;
		let lastAttemptOnlyDate = null
		let lastTime = null
		if (otpData) {
			// console.log(otpCode)
			lastAttemptDateTime = otpData.lastAttempt
			console.log('lastAttemptDateTime:', lastAttemptDateTime)

			lastAttemptOnlyDate = moment(lastAttemptDateTime).format('YYYY-MM-DD')
			console.log('lastAttemptOnlyDate:', lastAttemptOnlyDate)

			lastTime = moment(lastAttemptDateTime).add(otpData.duration, 'minutes').format("hh:mm:ss")
			console.log('lastTime:', lastTime)
			// lastTime = moment(lastAttemptDateTime).format("hh:mm:ss")
		}


		if (!otpData) {

			// save to OTP modal, send OTP and send response
			otpData = new OtpPhoneNumber()

			otpData.userId = req.user.id

			// otpData.lastAttempt = todayDateTime
			otpData.duration = 1 * 2

			// await otpData.save();

			if (!otpCode) {
				return res.status(400).send({
					status: false,
					message: 'Error: OTP is not created'
				})
			}

			// console.log(otpCreated)

		} else {
			console.log('CASE 1:', todayOnlyDate, lastAttemptOnlyDate, todayOnlyDate > lastAttemptOnlyDate)
			if (todayOnlyDate > lastAttemptOnlyDate) {
				otpData.attempts = 1
				otpData.duration = 1 * 2
			} else {
				console.log('CASE 2:', otpData.attempts, constants.TWILIO_OTP_ATTEMPTS, otpData.attempts >= constants.TWILIO_OTP_ATTEMPTS)
				console.log('CASE 3:', timeNow, lastTime, timeNow < lastTime)
				// if (otpData.attempts >= app_constants.TWILIO_OTP_ATTEMPTS) {
				//     return res.status(400).send({
				//         status: false,
				//         message: 'Error: OTP attempts are exceeded'
				//     })
				// }
				// else if (timeNow < lastTime) {
				//     return res.status(400).send({
				//         status: false,
				//         message: 'Error: OTP attempts time exceeded'
				//     })
				// }
				let newAttempts = otpData.attempts + 1
				otpData.attempts = newAttempts
				otpData.duration = newAttempts * 2
			}
		}

		let message = null

		if (isProduction) {
			message = await twilioClient.messages
				.create({
					body: `<#> Your OTP code is ${otpCode}. NEVER share this with anyone. ${constants.APP_TITLE} will never call or ask for this code. ${constants.OTP_AUTOFILL_CODE}`,
					// from: '+15017122661',
					messagingServiceSid: constants.TWILIO_MESSAGE_SERVICE_ID,
					to: phoneNumber
				})
		}

		console.log('message:', message)

		// authUser.newPhoneNumber = phoneNumber;
		// authUser.newNumber = pNumber;
		// authUser.newCountryCode = countryCode

		authUser.verifyNewPhoneNumber = false;

		otpData.ipAddress = ipAddress
		otpData.otpCode = otpCodeHash

		otpData.lastAttempt = todayDateTime;
		otpData.phoneNumber = phoneNumber;
		otpData.number = pNumber;
		otpData.countryCode = countryCode;
		otpData.verifyPhoneNumber = false
		await otpData.save()
		await authUser.save()

		return res.send({
			status: true,
			message: "OTP sent to phone number successfully"
		})

		// .then(async (message) => {

		// }).catch((error) => {
		//     console.log(error)
		//     return res.status(500).send({
		//         status: false,
		//         message: "Error: Internal server error"
		//     })
		// })
		// ;
		return
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}

exports.verifyPhoneNumberAlreadyExistOrNot = async function (req, res) {
	try {

		let phoneNumber = req.body.phoneNumber;

		let userExists = await User.findOne({
			where: {
				phoneNumber: phoneNumber,

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
				message: 'Error: User with same phone number already exists.'
			})
		} else {
			return res.status(200).send({
				status: true,
				message: 'Phone number has been verified successfully.'
			})
		}

	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}
exports.verifyEmailAlreadyExistOrNot = async function (req, res) {
	try {

		let email = req.body.email;

		let userExists = await User.findOne({
			where: {
				email: email,

			},
			include: [{
				model: Role,
				where: {
					roleName: {
						[Op.in]: ['restaurant', 'rider']
					}
				}

			}]
		})

		if (userExists) {
			return res.status(400).send({
				status: false,
				message: 'Error: User with same email already exists.'
			})
		} else {
			return res.status(200).send({
				status: true,
				message: 'Email has been verified successfully.'
			})
		}

	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}
exports.verifyPhoneNumber = async function (req, res) {
	try {
		let authUser = req.user;
		let otpCode = req.body.otpCode;

		let otpData = await OtpPhoneNumber.findOne({
			where: {
				// otpCode: otpCode,
				userId: authUser.id,
				verifyPhoneNumber: false
			},
			// order: [
			//     ['id', 'DESC']
			// ],
		});
		// console.log('otpData:', otpData)
		if (!otpData) {
			return res.status(400).send({
				status: false,
				message: 'Error: Invalid otp'
			})
		}

		let isMatched = await bcrypt.compare((otpCode.toString()), otpData.otpCode.toString());

		if (!isMatched) {
			return res.status(400).send({
				status: false,
				message: 'Error: Invalid otp'
			})
		}

		authUser.phoneNumber = otpData.phoneNumber;
		authUser.number = otpData.number;
		authUser.countryCode = otpData.countryCode;
		authUser.verifyPhoneNumber = true
		authUser.verifyNewPhoneNumber = true;
		otpData.verifyPhoneNumber = true

		await otpData.save()
		await authUser.save()

		if (authUser.genderId) {
			let genderData = await Gender.findOne({ where: { id: authUser.genderId } })
			if (genderData) {
				authUser.gender = genderData.gender
			}
		}


		if (!authUser.profileImage) {
			authUser.profileImage = 'defaultProfile.png'
		}

		return res.send({
			status: true,
			message: 'Phone number is changed successfully',
			user: authUser,
			is_guest_user: false
		})
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}

exports.getProfileImage = async function (req, res) {
	try {
		let authUser = req.user
		let fileName = req.params.fileName

		let user = await User.findOne({ where: { id: authUser.id } })
		if (!user) {
			return res.status(400).json({ message: `Invalid request.` })
		}

		if (!user.profileImage && fileName !== 'defaultProfile.png') {
			return res.status(404).send({
				status: false,
				message: 'Error: File not found'
			})
		}

		let profileImagePath = path.join(__dirname, `../../storage/images/${fileName}`)

		if (fs.existsSync(profileImagePath)) {
			// let ip = req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.header('x-real-ip') ? req.header('x-real-ip') : req.connection.remoteAddress
			let fileMimeType = mime.getType(profileImagePath);

			// let user_agent = req.headers["user-agent"]

			if (appConstants.IMAGE_SUPPORTED_FORMATS.includes(fileMimeType.toLowerCase())) {
				return res.sendFile(profileImagePath);
			} else {
				return res.status(404).send({
					status: false,
					message: "Error: file not found"
				})
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}

exports.removeProfileImage = async function (req, res) {
	try {
		let authUser = req.user

		let user = await User.findOne({ where: { id: authUser.id } })
		if (!user) {
			return res.status(400).json({ message: `Invalid request.` })
		}
		user.profileImage = null;
		user.profileImageByte = null;
		user.profileImageSize = null;
		await user.save()
		let userData = authHelpers.deleteOtherUserInfo(user.toJSON())

		if (userData.genderId) {
			let genderData = await Gender.findOne({ where: { id: userData.genderId } })
			if (genderData) {
				userData.gender = genderData.gender
			}
		}

		if (!userData.profileImage) {
			userData.profileImage = 'defaultProfile.png'
		}
		return res.status(200).json({
			message: 'Profile has been removed.',
			user: userData,
			is_guest_user: false
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}

exports.changeEmail = async function (req, res) {
	try {
		let authUser = req.user;
		let newEmail = req.body.email

		let checkIfEmailExists = await User.findAll({
			where: {
				[Op.and]: [
					{
						[Op.not]: { id: authUser.id }
					},
					{
						email: newEmail
					}
				]
			}
		})

		if (checkIfEmailExists && checkIfEmailExists.length) {
			return res.status(400).send({
				status: false,
				message: 'Error: Username already exist'
			})
		}

		const emailVerificationCode = generator.generate({
			length: 12,
			numbers: true
		})

		const emailVerificationCodeHash = await bcrypt.hash(`${emailVerificationCode}`, 10);
		authUser.emailVerificationCode = emailVerificationCodeHash

		const token = jwt.sign({
			user: {
				emailVerificationCode,
				email: authUser.email,
				// newEmail: newEmail
			}
		}, constants.APP_SECRET, { expiresIn: '20m' });

		let verificationLink = `${constants.HOST}/auth/verifyEmail?token=${token}`;
		let html = `Hello ${authUser.username},<br>
        Please Click on the link to verify your email.<br>
        <a href=${verificationLink}>Click here to verify</a>`

		await sendEmailV2("Please confirm your Email account", html, newEmail)

		authUser.newEmail = newEmail;
		// authUser.isEmailVerified = true

		await authUser.save()

		return res.status(200).send({
			message: 'Email has been changed. please verify your email to activate',
			// user: authUser
		})
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: "Error: Internal server error"
		})
	}
}

// ************ Logout ************
exports.logout = async function (req, res) {
	try {
		if (req.user.roleName === "rider") {
			const isRiderHaveActiveOrder = () => {
				return new Promise((resolve, reject) => {
					rpcClient.riderRPC.isRiderHaveActiveOrder({
						riderId: req.user.id
					}, function (error, restaurantRespData) {
						if (error) {
							console.log(error);
							return reject(error)
						}
						return resolve(restaurantRespData)
					})
				})
			}

			let riderRespData = await isRiderHaveActiveOrder()
			console.log(riderRespData)
			if (!riderRespData || riderRespData.status) {
				return res.status(400).send({ status: false, message: "You have active orders. Please complete your active orders before logout from application." });
			}
		}
		req.user.isLogin = false
		req.user.save()
		await authHelpers.expireUserTokens(req.user.id)
		general_helpers.destroyCart(req.user.id)
		Device.update({ userId: null }, { where: { userId: req.user.id } })
		req.logout();
		return res.send({ status: true, message: "Logout Successfully." });

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, 'internal_server_error', null, 500)
	}

}

// ************ Force Logout User************
exports.forceLogoutUser = async function (req, res) {
	if (req.user.roleName !== "admin" && req.user.roleName !== "provider") {
		return res.status(400).send({
			status: false,
			message: "Error: Unauthorized Access."
		});

	}
	let userId = req.body.userId
	let where = { id: userId }

	if (req.user.roleName === "provider") {
		where.parentId = req.user.id
	}

	let userData = await User.findOne({
		where,
		include: Role
	})

	if (!userData) {
		return res.status(400).send({
			status: false,
			message: "Error: User Not found."
		});
	}

	let roleName = userData.roles ? userData.roles[0].roleName : ''


	try {
		if (roleName === "rider") {
			const isRiderHaveActiveOrder = () => {
				return new Promise((resolve, reject) => {
					rpcClient.riderRPC.isRiderHaveActiveOrder({
						riderId: userId
					}, function (error, restaurantRespData) {
						if (error) {
							console.log(error);
							return reject(error)
						}
						return resolve(restaurantRespData)
					})
				})
			}

			let riderRespData = await isRiderHaveActiveOrder()
			if (!riderRespData || riderRespData.status) {
				return res.status(400).send({ status: false, message: "Rider have active orders. Please let rider complete active orders before logout." });
			}
		}
		userData.isLogin = false
		userData.save()
		await authHelpers.expireUserTokens(userData.id)
		general_helpers.destroyCart(userData.id)
		Device.update({ userId: null }, { where: { userId: userData.id } })
		return res.send({ status: true, message: "Logout Successfully." });

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, 'internal_server_error', null, 500)
	}

}

// ************ AdminLogout ************
exports.adminLogout = async function (req, res) {
	let userId = req.user.id
	let accessToken = req.body.accessToken
	UserAuth.destroy({
		where: {
			userId: userId,
			accessToken
		}
	}).then((rowsDeleted) => {
		req.logout();
		return res.send({ status: true, message: "Admin Logout Successfully." });
	}).catch((error) => {
		console.log(error.message);
		return reject(error)
	})
}

exports.redeemRewardPoints = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();
	try {
		let userId = req.user.id

		let userAccountBalance = await UserAccountBalance.findOne({
			where: {
				userId: userId
			},
			attributes: ['id', 'userId', 'balance', 'rewardPoints']
		},
			{ transaction: sequelizeTransaction }
		)

		if (!userAccountBalance || userAccountBalance?.rewardPoints < 100) {
			sequelizeTransaction.rollback();
			return respondWithError(req, res, "you don't have enough reward points to redeem", null, 400)
		}

		const rewardedAmount = userAccountBalance.rewardPoints / 100

		const paymentSummery = {
			points: userAccountBalance.rewardPoints,
			rewardedAmount: rewardedAmount,
		}

		const payment = await Payment.create({
			userId: userId,
			paymentMethod: 6,
			paymentStatus: 'completed',
			amount: rewardedAmount,
			paymentSummery: paymentSummery,
		},
			{ transaction: sequelizeTransaction }
		)

		await FinancialAccountTransaction.create({
			userId: userId,
			paymentId: payment.id,
			transactionType: 'credit',
			transactionOf: 'rewardPoint',
			amount: rewardedAmount,
		},
			{ transaction: sequelizeTransaction }
		)

		userAccountBalance.rewardPoints = 0
		userAccountBalance.balance = Number(userAccountBalance.balance) + rewardedAmount
		await userAccountBalance.save({ transaction: sequelizeTransaction });

		sequelizeTransaction.commit();

		return respondWithSuccess(req, res, 'points redeemed successfully', userAccountBalance)
	} catch (error) {
		console.log(error)
		sequelizeTransaction.rollback();
		return respondWithError(req, res, 'internal_server_error', null, 500)
	}
}

exports.deleteAccount = async function (req, res) {
	try {

		if (req.user.roleName != 'user') {
			return respondWithError(req, res, "invalid user request", null, 405)
		}

		await User.update({ deleteStatus: true },
			{
				where: {
					id: req.user.id
				}
			}
		)

		return respondWithSuccess(req, res, 'account deleted successfully')
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, 'internal_server_error', null, 500)
	}
}

exports.rewardPointHistory = async function (req, res) {
	try {
		let size = req.query.size ? Number(req.query.size) : 10;
		let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
		let offset = 0;

		let pagination = {};
		if (!Number.isNaN(size)) {
			if (pageNo > 1) {
				offset = size * pageNo - size;
			}
			pagination.limit = size;
			pagination.offset = offset;
			pagination.pageNo = pageNo;
		}
		let userId = req.user.id

		RewardPointHistory.findAll({
			where: {
				userId: userId
			},
			order: [["id", "DESC"]],
			attributes: ['id', 'type', 'points', 'data'],
			...pagination
		}).then(data => {
			console.log(data.length)
			return respondWithSuccess(req, res, 'Data Found', data)

		}).catch(err => {
			console.log(err)
			return respondWithError(req, res, "Internal Server Error.", null, 500)

		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, 'internal_server_error', null, 500)
	}
}

