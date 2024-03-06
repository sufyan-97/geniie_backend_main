// Library
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

// Model
const User = require('../SqlModels/User');
const Role = require('../SqlModels/Role');

// constants
const constants = require('../../../config/constants')

passport.use(new FacebookStrategy({
	clientID: constants.FACEBOOK_CLIENT_ID,
	clientSecret: constants.FACEBOOK_CLIENT_SECRET,
	callbackURL: constants.FACEBOOK_CALLBACK_URL,
	fields: ['emails', 'id', 'displayName', 'name', 'photos', 'last_name', 'first_name', 'middle_name'],
	profileFields: ['id', 'emails', 'last_name', 'first_name', 'middle_name']
}, async function (accessToken, refreshToken, profile, done) {
	try {
		// console.log('data:', accessToken, refreshToken, profile, profile._json.email)
		if (!profile || !profile._json || !profile._json.email) {
			return done(`Profile Email couldn't be read`)
		}
		let email = profile._json.email
		let user = await User.findOne({
			where: {
				email: email
			}
		});

		if (!user) {
			user = new User()
		}

		user.username = user.username ? user.username : email;
		user.email = email
		// user.deviceId = req.deviceId
		user.isEmailVerified = true
		user.facebookId = profile.id
		await user.save()

		let userRoleInfo = await user.getRoles({
			where: {
				roleName: 'user',
				isActive: true
			}
		})

		if (!userRoleInfo || !userRoleInfo.length) {
			let roleData = await Role.findOne({
				where: {
					roleName: 'user',
					isActive: true
				}
			})

			if (!roleData) {
				return done('Error: Internal server error')
			}

			await user.addRole(roleData, { through: { selfGranted: false } })
		}
		user.provider = 'facebook'
		return done(null, user)
	} catch (error) {
		done(error)
	}
}));

module.exports = passport;
