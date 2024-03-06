//helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Libraries
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const moment = require("moment")
const { Op } = require('sequelize')
const rpcClient = require('../../lib/rpcClient')

// Custom Libraries
const sliderCaptcha = require('../../lib/sliderCaptcha')
const { sendEmailV2 } = require('../../lib/email');
const { geocoder } = require('../../lib/geocoder')

// Config
const { sequelize_conn } = require('../../../config/database');

// Models
const User = require('../SqlModels/User');
const UserAuth = require('../SqlModels/UserAuth');
const Gender = require('../SqlModels/Gender');
const Role = require('../SqlModels/Role');
const UserRole = require('../SqlModels/UserRole');

const Country = require('../SqlModels/Country')
const Currency = require('../SqlModels/Currency')
const Device = require('../SqlModels/Device');
const SystemApp = require('../SqlModels/SystemApp');

// Helpers
const general_helpers = require('../../helpers/general_helper');
const authHelper = require('../../helpers/authHelper')

// Constants
const constants = require('../../../config/constants');
const RestaurantRider = require('../SqlModels/RestaurantRider');


// ************ Create Captcha ************ //
exports.createCaptcha = async function (req, res) {
	try {

		let files = fs.readdirSync(path.join(__dirname, '../../assets/captcha'))

		let chosenFile = files[Math.floor(Math.random() * files.length)]

		sliderCaptcha.create({
			image: path.join(__dirname, `../../assets/captcha/${chosenFile}`),
			fill: '#000',
			stroke: '#000',
			rotate: true,
			strokeWidth: '.4',
			opacity: '0.9',
			distort: true
		}).then(function ({ data, solution }) {
			req.session.captcha = solution;
			req.session.save();
			return res.status(200).send(data);
		});
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}

}

// ************ Verify Captcha ************ //
exports.verifyCaptcha = async function (req, res) {

	sliderCaptcha.verify(req.session.captcha, req.body)
		.then(function (verification) {
			if (verification.result === 'success') {
				req.session.token = verification.token;
				req.session.save();
			}
			return res.status(200).send(verification);
		});
}

// ************ Sign Up ************ //
exports.signup = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();
	try {

		let username = req.body.username
		let email = req.body.email;
		let userPassword = req.body.password
		let firstName = req.body.firstName ? req.body.firstName : ""
		let lastName = req.body.lastName ? req.body.lastName : ""
		let deviceId = req.deviceId ? req.deviceId : null

		let userRole = await Role.findOne({
			where: {
				roleName: 'user'
			}
		})

		if (!userRole) {
			return res.status(400).send({
				status: false,
				message: 'Role not found'
			})
		}

		let longitude = req.body.longitude;
		let latitude = req.body.latitude;

		let ipAddress = req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.header('x-real-ip') ? req.header('x-real-ip') : req.connection.remoteAddress


		const hash = await bcrypt.hash(userPassword, 10);
		const emailVerificationCode = generator.generate({
			length: 12,
			numbers: true
		})

		const emailVerificationCodeHash = await bcrypt.hash(`${emailVerificationCode}`, 10);


		let userExist = await User.findOne({
			where: {
				[Op.or]: [
					{
						username: username
					},
					{
						email: email
					}
				],
			},
			include: {
				model: Role,
				where: {
					id: userRole.id
				}
			}

		})

		if (userExist && userExist.id) {
			if (userExist.username === username) {
				return res.status(400).send({
					message: "username already exist."
				})
			} else {
				return res.status(400).send({
					message: "Email already exist."
				})
			}
		}

		const user = await User.create({
			username,
			email,
			firstName,
			lastName,
			password: hash,
			emailVerificationCode: emailVerificationCodeHash,
			deviceId: deviceId,
			status: 'active'
		}, { transaction: sequelizeTransaction });


		if (!user) {
			return res.status(500).send({
				message: 'Unable to handle this request.',
			});
		}

		let userData = user.toJSON();

		if (deviceId) {
			Device.update({ userId: user.id }, { where: { uuid: deviceId }, transaction: sequelizeTransaction })
		}

		userData = authHelper.deleteOtherUserInfo(userData);

		let loginInfo = await authHelper.generateLoginInfo(userData);


		user.refreshToken = loginInfo.refreshToken;


		let countryCode = constants.DEFAULT_COUNTRY

		// if (longitude && latitude) {
		// 	let latLongData = await geocoder.reverse({ lat: latitude, lon: longitude });
		// 	if (latLongData.length) {
		// 		countryCode = latLongData[0].countryCode
		// 	}

		// } else {
		// 	let ipInfo = await general_helpers.getIpInformation(ipAddress)
		// 	countryCode = ipInfo?.country ? ipInfo?.country : countryCode
		// }

		// Country
		let countryData = await Country.findOne({
			where: {
				countryCode: countryCode
			}
		})

		if (!countryData || !countryData.currencyId) {
			return res.status(500).send({
				status: false,
				message: 'Error: country or currency not found'
			})
		}

		// add user Account Balance here
		let userAccBalance = await user.createAccountBalance({
			// userId: user.id,
			countryId: countryData.id,
			currencyId: countryData.currencyId,
			balance: 0
		}, { transaction: sequelizeTransaction })

		if (!userAccBalance) {
			return res.status(500).send({
				message: 'Unable to handle this request.',
			});
		}

		// user.userAccountBalanceId = userAccBalance.id


		await user.save({ transaction: sequelizeTransaction });

		await user.addRole(userRole, { through: { selfGranted: false } }, { transaction: sequelizeTransaction })

		await sequelizeTransaction.commit();

		userData.accountBalance = null;

		let getAccBalance = await user.getAccountBalance({
			include: [{
				model: Currency,
				attributes: ['currencySymbol']
			}],
		})


		if (getAccBalance) {
			userData.accountBalance = getAccBalance
		}

		let genderData = await user.getGender()

		if (genderData) {
			userData.gender = genderData.gender
		}

		if (!userData.profileImage) {
			userData.profileImage = 'defaultProfile.png'
		}

		sendEmailV2("Account Registered Successfully", '', email, 'user/welcome.pug', {
			username: firstName + ' ' + lastName,
		});

		return res.send({
			message: 'Signup successful',
			user: userData,
			token: loginInfo.accessToken,
			refreshToken: loginInfo.refreshToken,
			is_guest_user: false
		});
	} catch (error) {
		console.log(error);
		await sequelizeTransaction.rollback();
		return respondWithError(req, res, '', null, 500);
	}

}

// ************ Verify Email ************
exports.verify = function (req, res) {

	let { token } = req.query

	jwt.verify(token, constants.APP_SECRET, async function (err, data) {
		if (err || !data) {
			return res.status(401).json({
				message: 'Unauthorized Access.'
			})
		}

		let authUser = data.user
		let email = authUser.email
		let emailVerificationCode = authUser.emailVerificationCode

		let user = await User.findOne({ where: { email: email } })
		if (user) {
			let isMatched = await bcrypt.compare(emailVerificationCode, user.emailVerificationCode);

			if (isMatched) {

				if (user.newEmail) {
					user.email = user.newEmail;
				}
				user.newEmail = null;

				user.isEmailVerified = 1
				user.emailVerificationCode = null
				await user.save()

				return res.send({ message: "Email has been verified successfully." })
			} else {
				return res.status(400).send({ message: "Unable verify email. User not found." })
			}
		} else {
			return res.status(400).send({ message: "Unable verify email. User not found." })
		}
	})
}

// ************ Login ************ //
exports.login = async function (req, res) {

	try {
		let password = req.body.password
		let username = req.body.username
		let roleName = req.body.role ? req.body.role : 'user'
		let deviceId = req.deviceId ? req.deviceId : ''
		let phoneNumberRegex = /^[+0-9]+$/

		if (phoneNumberRegex.test(username)) {
			let n = 10
			username = username.substring(username.length - n)
		}

		if (roleName === 'admin') {
			return res.status(400).send({
				message: `Invalid Username Or password`
			})
		}

		const user = await User.findOne({
			where: {
				[Op.or]: [
					{
						username: username
					},
					{
						email: username
					},
					{
						number: username
					}
				]
			},
			include: [{
				model: Role,
				where: {
					roleName,
					isActive: true
				}
			}]
		})

		if (!user) {
			return res.status(400).send({
				message: `Invalid Username Or password`
			})
		}

		if (!user.password) {
			console.log('user does not set the password logged in via social media')
			return res.status(400).send({
				message: 'Invalid Username Or Password'
			})
		}

		let isMatched = await bcrypt.compare(password, user.password);
		if (!isMatched) {
			return res.status(400).send({
				message: `Invalid Username Or password`
			})
		}

		if (user.deleteStatus) {
			return res.status(400).json({ message: `User no longer exits.` })
		}

		user.deviceId = deviceId
		await user.save()

		if (deviceId) {
			let appSlug = ''
			if (roleName === 'restaurant') {
				appSlug = 'asaap-restaurant'
			} else if (roleName === 'user') {
				appSlug = 'asaap'
			}
			else if (roleName === 'rider') {
				appSlug = 'rider'
			}
			if (appSlug) {
				let systemApp = await SystemApp.findOne({ where: { slug: appSlug } })
				if (systemApp && Object.keys(systemApp).length) {
					Device.update({ userId: user.id }, { where: { uuid: deviceId, systemAppId: systemApp.id } }).catch((error) => console.log)
					Device.update({ userId: null }, { where: { userId: user.id, uuid: { [Op.not]: deviceId }, systemAppId: systemApp.id } }).catch((error) => console.log)
				}
			}
		}

		let userData = user.toJSON();



		userData = authHelper.deleteOtherUserInfo(userData);

		if (roleName !== 'provider') {
			await authHelper.expireUserTokens(userData.id);
		}

		let loginInfo = await authHelper.generateLoginInfo(userData);

		user.refreshToken = loginInfo.refreshToken;
		user.isLogin = true
		await user.save();

		let accountBalance = await user.getAccountBalance({
			include: [{
				model: Currency,
				attributes: ['currencySymbol']
			}]
		})

		if (!accountBalance) {

			// add user Account Balance here.
			let countryCode = constants.DEFAULT_COUNTRY;

			// let ipAddress = req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.header('x-real-ip') ? req.header('x-real-ip') : req.connection.remoteAddress

			// let ipInfo = await general_helpers.getIpInformation(ipAddress)
			// countryCode = ipInfo?.country ? ipInfo?.country : countryCode

			// Country
			let countryData = await Country.findOne({
				where: {
					countryCode: countryCode
				}
			})

			if (!countryData || !countryData.currencyId) {
				return res.status(500).send({
					status: false,
					message: 'Error: country or currency not found'
				})
			}

			accountBalance = await user.createAccountBalance({
				countryId: countryData.id,
				currencyId: countryData.currencyId,
				balance: 0

			})

			if (!accountBalance) {
				return res.status(500).send({
					message: 'Unable to handle this request.',
				});
			}
		}


		/**
		 * @description after saving api
		 */


		userData.accountBalance = accountBalance;

		let genderData = await user.getGender()

		if (genderData) {
			userData.gender = genderData.gender
		}

		if (!userData.profileImage) {
			userData.profileImage = 'defaultProfile.png'
		}

		if (userData.dob) {
			let dob = moment(userData.dob)
			let dateNow = moment()
			userData.age = dateNow.diff(dob, 'years')
		}
		else {
			userData.age = null
		}


		general_helpers.updateGuestCart(userData.id, deviceId)

		if (roleName == 'rider') {

			let restaurantRiderData = await RestaurantRider.findOne({ where: { riderId: userData.id } })

			if (restaurantRiderData) {

				let restaurantRiderDataInJson = restaurantRiderData.toJSON()


				let branchId = restaurantRiderDataInJson.restaurantUserId


				const GetRestaurantRespData = () => {
					return new Promise((resolve, reject) => {
						rpcClient.RestaurantService.getAllRestaurant({
							type: 'getBranchNameForBranchRiderRegistration',
							id: [branchId]
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


				if (!restaurantData && restaurantData.length == 0) {
					return respondWithError(req, res, 'restaurant not found!', null, 400)
				}

				userData.branchName = restaurantData[0].name
				userData.branchId = restaurantData[0].id

			}
		}


		return res.send({
			message: "Logged in successfully.",
			user: userData,
			token: loginInfo.accessToken,
			refreshToken: loginInfo.refreshToken,
			is_guest_user: false
		});


	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}
}

// ************ SocialMedia Login ************ //
exports.loginCallback = async function (req, res) {
	try {

		const user = req.user;
		let deviceId = req.deviceId ? req.deviceId : ''

		if (!user) {
			return res.status(400).json({ message: `Invalid Username Or password` })
		}

		if (user.deleteStatus) {
			return res.status(400).json({ message: `User no longer exits.` })
		}

		let userData = user.toJSON();

		userData = authHelper.deleteOtherUserInfo(userData);

		await authHelper.expireUserTokens(userData.id);

		let loginInfo = await authHelper.generateLoginInfo(userData, user.provider);

		user.refreshToken = loginInfo.refreshToken;
		user.deviceId = deviceId
		if (deviceId) {
			let appSlug = 'asaap'
			let systemApp = await SystemApp.findOne({ where: { slug: appSlug } })
			if (systemApp && Object.keys(systemApp).length) {
				Device.update({ userId: user.id }, { where: { uuid: deviceId, systemAppId: systemApp.id } })
				Device.update({ userId: null }, { where: { userId: user.id, uuid: { [Op.not]: deviceId }, systemAppId: systemApp.id } })
			}
		}

		await user.save();

		let accountBalance = await user.getAccountBalance({
			include: [{
				model: Currency,
				attributes: ['currencySymbol']
			}]
		})

		if (!accountBalance) {

			// add user Account Balance here.
			let countryCode = constants.DEFAULT_COUNTRY;

			// let ipAddress = req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.header('x-real-ip') ? req.header('x-real-ip') : req.connection.remoteAddress

			// let ipInfo = await general_helpers.getIpInformation(ipAddress)
			// countryCode = ipInfo?.country ? ipInfo?.country : countryCode

			// Country
			let countryData = await Country.findOne({
				where: {
					countryCode: countryCode
				}
			})

			if (!countryData || !countryData.currencyId) {
				return res.status(500).send({
					status: false,
					message: 'Error: country or currency not found'
				})
			}

			accountBalance = await user.createAccountBalance({
				countryId: countryData.id,
				currencyId: countryData.currencyId,
				balance: 0

			})

			if (!accountBalance) {
				return res.status(500).send({
					message: 'Unable to handle this request.',
				});
			}

		}



		userData.accountBalance = accountBalance;

		userData.isSocialLogin = true
		let genderData = await user.getGender()

		if (genderData) {
			userData.gender = genderData.gender
		}


		if (!userData.profileImage) {
			userData.profileImage = 'defaultProfile.png'
		}

		general_helpers.updateGuestCart(userData.id, req.deviceId)

		return res.send({
			message: "Logged in successfully.",
			user: userData,
			token: loginInfo.accessToken,
			refreshToken: loginInfo.refreshToken
		});

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}
}

// ************ Guest Login ************ //
exports.guestLogin = async function (req, res) {
	try {
		let deviceId = req.deviceId
		Role.findOne({ where: { roleName: 'guest' } }).then(data => {
			if (data) {
				let roleId = data.id
				User.findOne({
					where: { deviceId: deviceId },
					include: [{
						model: Role,
						where: {
							id: roleId
						},
						required: true,
						// include: Role
					}]
				}).then(user => {
					if (user) {
						const token = jwt.sign({
							user: {
								id: user.id,
								roleId,
								is_guest_user: true
							}
						}, constants.APP_SECRET, { expiresIn: constants.EXPIRE_IN });

						return res.send({
							message: "Logged in successfully.",
							token,
							is_guest_user: true
						});

					} else {
						let newUser = new User({
							deviceId: deviceId
						})
						newUser.save().then(item => {
							let userId = item.id
							UserRole.create({
								userId: userId,
								roleId: roleId
							})
							const token = jwt.sign({
								user: {
									id: item.id,
									roleId,
									is_guest_user: true
								}
							}, constants.APP_SECRET, { expiresIn: constants.EXPIRE_IN });
							return res.send({
								message: "Logged in successfully.",
								token,
								is_guest_user: true
							});
						})

					}

				}).catch(err => {
					console.log(err);
					return respondWithError(req, res, '', null, 500)
				})

			} else {
				return res.status(400).json({ message: `User no longer exits.` })
			}
		}).catch(err => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		})
	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}
}

// ************ Forgot Password ************
exports.forgotPassword = async function (req, res) {
	const sequelizeTransaction = await sequelize_conn.transaction();

	try {
		// console.log(userExist);
		let email = req.body.email

		let roleName = (req.body.roleName) ? req.body.roleName : 'user';


		const forgotPasswordCode = generator.generate({
			length: 12,
			numbers: true
		})

		const forgotPasswordCodeHash = await bcrypt.hash(`${forgotPasswordCode}`, 10);


		let userExist = await User.findOne({
			where: {
				email: email
			},
			include: {
				model: Role,
				where: {
					roleName: roleName
				},
				required: true
			},
			transaction: sequelizeTransaction
		})

		if (!userExist) {
			sequelizeTransaction.rollback();
			return respondWithError(req, res, 'Unable to find user', null, 400)
		}


		const token = jwt.sign({
			user: {
				forgotPasswordCode,
				email,
				roleName: roleName
			}
		}, constants.APP_SECRET, { expiresIn: '20m' });

		let verificationLink = `${constants.HOST}/auth/resetPassword?token=${token}`;

		await sendEmailV2("Reset password request", '', email, 'user/forgotPassword.pug', {
			title: 'Reset password request',
			verificationLink: verificationLink
		});

		userExist.forgotPasswordCode = forgotPasswordCodeHash

		await userExist.save({ transaction: sequelizeTransaction })

		sequelizeTransaction.commit();

		return respondWithSuccess(req, res, 'Please check your email to reset your password', null, 200)

	} catch (error) {
		console.log(error);
		sequelizeTransaction.rollback();
		return respondWithError(req, res, '', null, 500)
	}

}

// ************ Update Password ************ //
exports.getResetPasswordView = async function (req, res) {
	try {
		// console.log(req.query)
		let token = req.query.token;
		jwt.verify(token, constants.APP_SECRET, function (error, data) {
			if (error || !data) {
				return respondWithError(req, res, 'Unauthorized Access', null, 401)
			}
			return res.render('resetPassword.pug', {
				host: constants.HOST,
				FACEBOOK: constants.FACEBOOK,
				TWITTER: constants.TWITTER,
				LINKED_IN: constants.LINKED_IN,
				INSTAGRAM: constants.INSTAGRAM,
				token: token
			})

		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

exports.saveResetPassword = async function (req, res) {
	// console.log(req, res);
	let { token } = req.query

	jwt.verify(token, constants.APP_SECRET, async function (err, data) {
		if (err || !data) {
			return respondWithError(req, res, 'Unauthorized Access', null, 401)
		}

		try {
			let authUser = data.user
			let forgotPasswordCode = authUser.forgotPasswordCode
			let email = authUser.email

			let roleName = (authUser.roleName) ? authUser.roleName : 'user'

			let newPassword = req.body.password

			let user = await User.findOne({
				where: {
					email: email
				},
				include: {
					model: Role,
					where: {
						roleName: roleName
					},
					required: true
				}
			})
			if (!user || !user.forgotPasswordCode) {
				return respondWithError(req, res, 'Invalid request', null, 400)
			}

			let isMatched = await bcrypt.compare(forgotPasswordCode, user.forgotPasswordCode);
			if (!isMatched) {
				return respondWithError(req, res, 'Invalid Username or password', null, 400)
			}

			user.forgotPasswordCode = null
			user.password = await bcrypt.hash(`${newPassword}`, 10);
			await user.save()
			return res.status(200).send({ message: 'Password has been updated successfully.' });

		} catch (error) {
			console.log(error);
			return respondWithError(req, res, '', null, 500)
		}
	})
}

exports.passwordChangedView = async function (req, res) {
	return res.render('passwordChanged.pug', {
		host: constants.HOST,
		FACEBOOK: constants.FACEBOOK,
		TWITTER: constants.TWITTER,
		LINKED_IN: constants.LINKED_IN,
		INSTAGRAM: constants.INSTAGRAM,
	})
}

// ************ Refresh Token ************ //
exports.refreshToken = async function (req, res) {
	try {
		let accessToken = req.query.accessToken;
		let refreshToken = req.query.refreshToken;

		let authUserData = await UserAuth.findOne({
			where: {
				[Op.and]: {
					accessToken: accessToken,
					refreshToken: refreshToken,
					deleteStatus: false
				}
			}
		})

		if (!authUserData) {
			return res.status(403).send({
				message: 'Error: Access Token or refresh token are not valid'
			})
		}

		let user = await User.findOne({ where: { id: authUserData.userId } })

		if (!user) {
			return res.status(403).send({
				message: 'Error: User not found'
			})
		}

		await authUserData.destroy();

		let userData = user.toJSON();

		userData = authHelper.deleteOtherUserInfo(userData);


		let loginInfo = await authHelper.generateLoginInfo(userData);
		user.refreshToken = loginInfo.refreshToken;

		await user.save();

		let accountBalance = await user.getAccountBalance({
			include: [{
				model: Currency,
				attributes: ['currencySymbol']
			}]
		})

		if (!accountBalance) {

			// add user Account Balance here.
			let countryCode = constants.DEFAULT_COUNTRY;

			// let ipAddress = req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.header('x-real-ip') ? req.header('x-real-ip') : req.connection.remoteAddress

			// let ipInfo = await general_helpers.getIpInformation(ipAddress)
			// countryCode = ipInfo?.country ? ipInfo?.country : countryCode

			// Country
			let countryData = await Country.findOne({
				where: {
					countryCode: countryCode
				}
			})

			if (!countryData || !countryData.currencyId) {
				return res.status(500).send({
					status: false,
					message: 'Error: country or currency not found'
				})
			}

			accountBalance = await user.createAccountBalance({
				countryId: countryData.id,
				currencyId: countryData.currencyId,
				balance: 0

			})

			if (!accountBalance) {
				return res.status(500).send({
					message: 'Unable to handle this request.',
				});
			}
		}


		userData.accountBalance = accountBalance;

		let genderData = await user.getGender()

		if (genderData) {
			userData.gender = genderData.gender
		}

		if (!userData.profileImage) {
			userData.profileImage = 'defaultProfile.png'
		}
		if (userData.dob) {
			let dob = moment(userData.dob)
			let dateNow = moment()
			userData.age = dateNow.diff(dob, 'years')
		}
		else {
			userData.age = null
		}

		return res.send({
			message: "Logged in successfully.",
			user: userData,
			token: loginInfo.accessToken,
			refreshToken: loginInfo.refreshToken,
			is_guest_user: false
		});
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}

// ============== ADMIN APIs ============== //

exports.adminSignUp = async function (req, res) {
	try {
		let username = req.body.username
		let email = req.body.email;
		let userPassword = req.body.password
		let deviceId = req.deviceId ? req.deviceId : ''

		const hash = await bcrypt.hash(userPassword, 10);
		// const emailVerificationCode = generator.generate({
		// 	length: 12,
		// 	numbers: true
		// })

		// const emailVerificationCodeHash = await bcrypt.hash(`${emailVerificationCode}`, 10);

		let userExist = await User.findOne({
			where: {
				[Op.or]: [
					{
						username: username
					},
					{
						email: email
					}
				]
			}
		})

		// console.log(userExist.addRole);
		if (userExist && userExist.id) {
			if (userExist.username === username) {
				return res.status(400).send({
					message: "username already exist."
				})
			} else {
				return res.status(400).send({
					message: "Email already exist."
				})
			}
		}

		let user = await User.create({
			username,
			email,
			password: hash,
			// emailVerificationCode: emailVerificationCodeHash,
			deviceId: deviceId
		});

		if (!user) {
			return res.status(500).send({
				message: 'Unable to handle this request.',
			});
		}

		let adminRole = await Role.findOne({
			where: {
				roleName: 'admin'
			}
		})

		if (!adminRole) {
			return res.status(400).send({
				status: false,
				message: 'Role not found'
			})
		}

		await user.addRole(adminRole, { through: { selfGranted: false } })

		let userData = user.toJSON();


		return res.send({
			message: 'Signup successful',
			user: userData,
		});
	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}

}

exports.adminLogin = async function (req, res) {

	try {
		let password = req.body.password
		let username = req.body.username

		let user = await User.findOne({
			where: {
				[Op.or]: [
					{
						username: username
					},
					{
						email: username
					}
				]
			}
		})

		if (!user) {
			return res.status(400).json({ message: `Error: Invalid Username Or password` })
		}

		let isMatched = await bcrypt.compare(password, user.password);

		if (!isMatched) {
			return res.status(400).json({ message: `Invalid Username Or password` })
		}

		let userRoles = await user.getRoles({ through: { selfGranted: false } })
		if (!userRoles || !userRoles.length) {
			return res.status(400).json({ message: `Error: Invalid Username or Password` })
		}

		let roles = await Role.findAll({
			where: {
				[Op.or]: [
					{
						roleName: 'admin'
					},
					{
						isAgent: true
					}
				],
			}
		})

		let isExist = roles.find(a => a.roleName === userRoles[0].roleName)

		if (!isExist) {
			return res.status(400).json({ message: `Error: Invalid Username or Password` })
		}


		if (user.deleteStatus || user.status !== 'active') {
			return res.status(400).json({ message: `User no longer exits.` })
		}

		// else if (!user.isEmailVerified) {
		// 	return res.status(400).json({ message: `Please Verify your email first to login.` })
		// }

		let userData = user.toJSON();

		userData = authHelper.deleteOtherUserInfo(userData);

		const token = jwt.sign({ user: userData }, constants.APP_SECRET, { expiresIn: constants.EXPIRE_IN });
		// console.log('token', token)
		let refreshToken = await general_helpers.generateRefreshToken();
		let insertedUserAuth = await UserAuth.create({
			userId: userData.id,
			username: userData.username,
			oAuthProvider: 'jwt',
			accessToken: token,
			refreshToken: refreshToken
		})

		if (!insertedUserAuth) {
			return res.status(400).send({
				status: false,
				message: `Error: Refresh token couldn't be saved`
			})
		}

		user.refreshToken = refreshToken;

		// await redisClient.set(`${token}`, refreshToken)

		await user.save();

		if (userData.genderId) {
			let genderData = await Gender.findOne({ where: { id: user.genderId } })
			if (genderData) {
				userData.gender = genderData.gender
			}
		}


		if (!userData.profileImage) {
			userData.profileImage = 'defaultProfile.png'
		}

		return res.send({
			message: "Logged in successfully.",
			user: userData,
			token,
			refreshToken,
			is_guest_user: false
		});

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}
}
