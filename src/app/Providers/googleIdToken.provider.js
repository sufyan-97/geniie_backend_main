// Libraries
var passport = require('passport');
const GoogleStrategy = require('passport-google-id-token');

// Models
const User = require('../SqlModels/User');
const Role = require('../SqlModels/Role');

// constants
const constants = require('../../../config/constants')

passport.use(new GoogleStrategy({
    clientID: constants.GOOGLE_CLIENT_ID,
    // clientSecret: constants.GOOGLE_CLIENT_SECRET,
    // callbackURL: constants.GOOGLE_CALLBACK_URL
}, async function (parsedToken, googleId, done) {
    try {
        // console.log(parsedToken, googleId, done)
        if (!parsedToken || !parsedToken.payload || !parsedToken.payload.email || !parsedToken.payload.name) {
            return done(`Profile Email couldn't be read`)
        }

        let email = parsedToken.payload.email
        // console.log(email)
        let user = await User.findOne({
            where: {
                email: email
            }
        });
        // console.log(user);
        if (!user) {
            user = new User()
        }

        user.username = user.username ? user.username : email;
        user.email = email
        // user.deviceId = req.deviceId
        user.isEmailVerified = user.isEmailVerified ? user.isEmailVerified : parsedToken.payload.email_verified

        user.googleId = googleId

        user.fullName = user.fullName? user.fullName : parsedToken.payload.name

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
        // console.log(error)
        done(error)
    }
}));

module.exports = passport;
