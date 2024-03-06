// Libraries
var express = require('express');
var router = express.Router();

//***************** Providers **********************//
const passportFacebook = require('../app/Providers/facebook.provider.js');
const passportFacebookToken = require('../app/Providers/facebookToken.provider');

const passportGoogle = require('../app/Providers/google.provider');
const passportGoogleToken = require('../app/Providers/googleToken.provider');
const passportGoogleIDToken = require('../app/Providers/googleIdToken.provider');
// const passportTwitter = require('../app/Providers/twitter');
// const passportGoogleToken = require('../app/Providers/googleToken');
// const passportGitHub = require('../app/Providers/github');


//***************** Controllers **********************//
const authController = require('../app/Controllers/auth.controller');


//***************** Validations **********************//
const commonValidators = require('../app/Validators/commonValidators');

const authValidator = require('../app/Validators/auth')
var errorMsgs = commonValidators.responseValidationResults;


//***************** User Routes **********************//
/* SIGN UP ROUTER */
router.post('/signup', [authValidator.signup, errorMsgs], authController.signup);

/* VERIFY EMAIL ROUTER */
router.get('/verifyEmail', [authValidator.verify, errorMsgs], authController.verify);

/* LOGIN ROUTER */
router.get('/guest/login', authController.guestLogin);

/* LOGIN ROUTER */
router.post('/login', [authValidator.login, errorMsgs], authController.login);

/* FORGOT PASSWORD ROUTER */
router.put('/forgotPassword', [authValidator.forgotPassword, errorMsgs], authController.forgotPassword);

/* RESET PASSWORD ROUTER */
router.get('/resetPassword', [authValidator.getResetPasswordView, errorMsgs], authController.getResetPasswordView)
router.put('/resetPassword', [authValidator.saveResetPassword, errorMsgs], authController.saveResetPassword);
router.get('/passwordChanged', [authValidator.passwordChangedView, errorMsgs], authController.passwordChangedView)


router.get('/refreshToken', [authValidator.refreshToken, errorMsgs], authController.refreshToken)


router.get('/facebook', passportFacebook.authenticate('facebook', { scope: ['email', 'public_profile'] }));
router.get('/facebook/callback', passportFacebook.authenticate('facebook', { session: false, scope: ['email', 'public_profile'] }), authController.loginCallback);
router.post('/facebook/login', passportFacebookToken.authenticate('facebook-token', { session: false }), authController.loginCallback)


router.get('/google', passportGoogle.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email', 'profile'] }));
router.get('/google/callback', passportGoogle.authenticate('google', { session: false, scope: ['https://www.googleapis.com/auth/plus.login', 'email', 'profile'] }), authController.loginCallback);
router.post('/google/iOSlogin', passportGoogleToken.authenticate('google-token', { session: false }), authController.loginCallback)
router.post('/google/login', passportGoogleIDToken.authenticate('google-id-token', { session: false }), authController.loginCallback)


//***************** Admin Routes **********************//

// disable it after calling it once
// router.post('/adminSignUp', [authValidator.adminSignUp, errorMsgs], authController.adminSignUp)

router.post('/adminLogin', [authValidator.adminLogin, errorMsgs], authController.adminLogin)
/* FACEBOOK ROUTER */



/* GOOGLE ROUTER */

/* TWITTER ROUTER */
// router.get('/twitter', passportTwitter.authenticate('twitter'));

// router.get('/twitter/callback', passportTwitter.authenticate('twitter', { failureRedirect: '/login' }), authController.twitterCallback);

/* GITHUB ROUTER */
// router.get('/github', passportGitHub.authenticate('github', { scope: ['user:email'] }));

// router.get('/github/callback', passportGitHub.authenticate('github', { failureRedirect: '/login' }), authController.githubCallback);

module.exports = router;
