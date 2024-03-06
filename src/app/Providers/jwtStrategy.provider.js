// Libraries
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;
const { Op } = require('sequelize')
const moment = require("moment")

// Custom Libraries
// var redisClient = require('../../../config/redis');

// Constants
var { APP_SECRET, REDIS_PREFIX } = require('../../../config/constants');
var general_helpers = require('../../helpers/general_helper');


const User = require('../SqlModels/User')
const Role = require('../SqlModels/Role')
const UserAuth = require('../SqlModels/UserAuth');

var opts = {
	jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromUrlQueryParameter("access_token"), ExtractJwt.fromAuthHeaderAsBearerToken()]),
	secretOrKey: APP_SECRET,
	passReqToCallback: true
}
passport.use(new JwtStrategy(opts, async function (req, jwtPayload, done) {
	try {
		if (jwtPayload.user.is_guest_user) {
			let id = jwtPayload.user.id
			let user = await User.findOne({ where: { id: id }, include: Role });
			// let user = await User.findOne({ where: { id: id } });
			if (user) {

				// let userData = user.toJSON();
				user.is_guest_user = true
				return done(null, user);
			} else {
				return done(null, false);
			}
		}

		let token = ExtractJwt.fromExtractors([ExtractJwt.fromUrlQueryParameter("access_token"), ExtractJwt.fromAuthHeaderAsBearerToken()])(req);

		let authTokens = await UserAuth.findAll({
			where: {
				[Op.and]: {
					accessToken: token,
					deleteStatus: false
				}
			}
		});

		if (authTokens && authTokens.length) {
			let id = jwtPayload.user.id
			let user = await User.findOne({ where: { id: id, deleteStatus: false }, include: Role });
			if (user) {
				user.roleName = user.roles ? user.roles[0].roleName : ''

				if (user.dob) {
					let dob = moment(user.dob)
					let dateNow = moment()
					user.age = dateNow.diff(dob, 'years')
				} else {
					user.age = null
				}

				// user.save()
				return done(null, user);
			} else {
				return done(null, false);
			}
		} else {
			if (jwtPayload.user) {
				general_helpers.destroyCart(jwtPayload.user.id)
			}
			return done({ status: 403 }, false);
		}

	} catch (error) {
		console.log('testing error ====', error)
		return done(null, false);
	}
}));

module.exports = passport;