// Libraries
const passportJwtSocketIo = require('passport-jwt.socketio');
const ExtractJwt = require('passport-jwt').ExtractJwt;

// // Models
// const User = require('../SqlModels/User')
// const Role = require('../SqlModels/Role')

// Helpers
const authHelper = require('../../helpers/authHelper');

// constants
const constants = require('../../../config/constants')

module.exports = passportJwtSocketIo.authorize({
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter("access_token"),
    secretOrKey: constants.APP_SECRET
}, async (jwtPayload, done) => {
	try {
		let id = jwtPayload.user.id
		let user = await authHelper.commonJwtProvider(id, ['admin', 'provider', 'rider'])
		return done(null, user);

    } catch (error) {
        console.log('testing error ====', error)
        return done(null, false);
    }
})