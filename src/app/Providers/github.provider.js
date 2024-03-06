var passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy;
var User = require('../SqlModels/UserAuth');
const constants = require('../../../config/constants')


passport.use(new GitHubStrategy({
  clientID: constants.GITHUB_CLIENT_ID,
  clientSecret: constants.GITHUB_CLIENT_SECRET,
  callbackURL: constants.GITHUB_CALLBACK_URL
},
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({ userId: profile.id }, { userName: profile.displayName, userId: profile.id, accessToken: accessToken, refreshToken: refreshToken, oAuthProvider: profile.provider }, function (err, user) {
      return done(err, user);
    });
  }
));

module.exports = passport;
