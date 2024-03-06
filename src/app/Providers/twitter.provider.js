var passport = require('passport')
	, TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../SqlModels/UserAuth');
const constants = require('../../../config/constants')


passport.serializeUser(function (user, fn) {
	fn(null, user);
});

passport.deserializeUser(function (id, fn) {
	User.findOne({ _id: id.doc._id }, function (err, user) {
		fn(err, user);
	});
});

passport.use(new TwitterStrategy({
	consumerKey: constants.TWITTER_CONSUMER_KEY,
	consumerSecret: constants.TWITTER_CONSUMER_SECRET,
	callbackURL: constants.TWITTER_CALLBACK_URL
},
	function (accessToken, refreshToken, profile, done) {
		User.findOrCreate({ userId: profile.id }, { userName: profile.displayName, userId: profile.id, accessToken: accessToken, refreshToken: refreshToken, oAuthProvider: profile.provider }, function (err, user) {
			if (err) {
				console.log(err);
				return done(err);
			}
			done(null, user);
		});
	}
));

module.exports = passport;
