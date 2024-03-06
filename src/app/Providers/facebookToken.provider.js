// Libraries
var passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token');

// Models
const User = require('../SqlModels/User');
const Role = require('../SqlModels/Role');

// constants
const constants = require('../../../config/constants')

passport.use(new FacebookTokenStrategy({
	clientID: constants.FACEBOOK_CLIENT_ID,
	clientSecret: constants.FACEBOOK_CLIENT_SECRET,
	fbGraphVersion: 'v3.0'
}, async function (accessToken, refreshToken, profile, done) {
	try {
		console.log('data:', accessToken, refreshToken, profile)
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

		let fullName = profile?._json?.name ? profile?._json?.name : null

		user.fullName = user.fullName ? user.fullName : fullName

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
		return done(error.message)
	}
}));

module.exports = passport;
