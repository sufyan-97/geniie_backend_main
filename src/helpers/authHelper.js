// Libraries
// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize')
const moment = require("moment")

// Models
// const LoginHistory = mongoose.model('login_history')
const UserAuth = require('../app/SqlModels/UserAuth');
const User = require('../app/SqlModels/User');
const Role = require('../app/SqlModels/Role');

// Custom Libraries
// const { sendEmail, sendEmailV2 } = require("../lib/email");
// const { sql } = require("../config/database");


// Constants
const app_constants = require("../../config/constants");

// const constants = require("../app/Constants/app.constants");

module.exports = {

	commonJwtProvider: (id, roleNames = []) => {
		return new Promise(async (resolve, reject) => {
			try {
				let user = await User.findOne({
					where: { id: id },
					include: [{
						model: Role,
						where: {
							roleName: {
								[Op.in]: roleNames
							}
						}
					}]
				});

				if (!user) {
					return reject('User not found')
				}
				user.roleName = user.roles ? user.roles[0].roleName : ''
				if (user.dob) {
					let dob = moment(user.dob)
					let dateNow = moment()
					user.age = dateNow.diff(dob, 'years')
				} else {
					user.age = null
				}
				return resolve(user);
			} catch (error) {
				return reject(error)
			}
		})
	},

	deleteOtherUserInfo: (userData) => {
		userData.isSetPassword = true

		if (!userData.password) {
			userData.isSetPassword = false
		}

		delete userData.password;
		delete userData.refreshToken;
		delete userData.forgotPasswordCode;
		delete userData.emailVerificationCode;
		delete userData.profileImageSize;
		delete userData.profileImageByte;
		delete userData.facebookId;
		delete userData.googleId;
		delete userData.twitterId;
		delete userData.appleId;
		delete userData.githubId;
		if (userData.user_roles) {
			delete userData.user_roles;
		}
		return userData
	},

	expireUserTokens: async function (userId) {
		return new Promise(async (resolve, reject) => {

			UserAuth.destroy({
				where: {
					userId: userId
				}
			}).then((rowsDeleted) => {
				return resolve(rowsDeleted);
			}).catch((error) => {
				console.log(error.message);
				return reject(error)
			})

		})
	},
	generateLoginInfo: async (userData, authProvider = 'jwt') => {
		return new Promise(async (resolve, reject) => {
			try {
				let accessToken = await jwt.sign({
					user: {
						id: userData.id,
						email: userData.email,
						username: userData.email
					}
				}, app_constants.APP_SECRET, { expiresIn: app_constants.EXPIRE_IN });

				let refreshToken = await bcrypt.hash(`${uuid.v4()}`, 10)
				if (!accessToken || !refreshToken) {
					return reject(`Error: accessToken or refreshToken Couldn't be generated`)
				}

				let insertedUserAuth = await UserAuth.create({
					userId: userData.id,
					username: userData.username,
					oAuthProvider: authProvider,
					accessToken: accessToken,
					refreshToken: refreshToken
				})

				if (!insertedUserAuth) {
					return reject(`Error: Refresh token couldn't be saved`)
				}

				return resolve({
					accessToken,
					refreshToken
				})

			} catch (error) {
				console.log('error:', error);
				reject(error)
			}

		})
	},
}


