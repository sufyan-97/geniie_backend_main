// Libraries
var passport = require('passport');
const GoogleStrategy = require('passport-google-token');

// Models
var User = require('../SqlModels/User');
const Role = require('../SqlModels/Role');

// constants
const constants = require('../../../config/constants')

// console.log(GoogleStrategy)
passport.use(new GoogleStrategy.Strategy({
	clientID: constants.GOOGLE_CLIENT_ID,
	clientSecret: constants.GOOGLE_CLIENT_SECRET,
	// callbackURL: constants.GOOGLE_CALLBACK_URL
}, async function (accessToken, refreshToken, profile, done) {
	try {
		// console.log( profile);
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
		user.googleId = profile.id
		user.fullName = profile.displayName
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
		user.provider = 'google'

		return done(null, user)
	} catch (error) {
		done(error)
	}
}));

module.exports = passport;
