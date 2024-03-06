// Libraries
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');


//***************** Controllers **********************/
// const mobileController = require('../app/Controllers/mobile.controller')

const profileController = require('../app/Controllers/profile.controller')

//***************** Validations **********************/
const commonValidators = require('../app/Validators/commonValidators');

const authValidator = require('../app/Validators/auth')
const profileValidator = require('../app/Validators/profile')

// var multipartMiddleware = multipart();
//***************** Middleware **********************/
const checkPasswordMiddleware = require('../app/Middleware/checkPassword')

//***************** Constants **********************/
const errorMsgs = commonValidators.responseValidationResults;



router.post('/checkAcl', [profileValidator.checkAcl, errorMsgs], profileController.user)

/* VERIFY EMAIL ROUTER */

/* VERIFY EMAIL ROUTER */
router.put('/updatePassword', [profileValidator.updatePassword, errorMsgs], profileController.updatePassword);

router.post('/updateProfile', multipart(), [profileValidator.updateProfile, errorMsgs], profileController.updateProfile);

router.put('/updateBankDetails', multipart(), [profileValidator.bankDetails, errorMsgs], profileController.updateBankDetails);

router.put('/vehicleInformation', multipart(), [profileValidator.updateVehicleInformation, errorMsgs], profileController.updateVehicleInformation)

router.put('/updateDocument', multipart(), [profileValidator.updateDocument, errorMsgs], profileController.updateDocument)

router.get('/image/:fileName', [profileValidator.getProfileImage, errorMsgs], profileController.getProfileImage);

router.put('/removeProfileImage', [profileValidator.removeProfileImage, errorMsgs], profileController.removeProfileImage);

router.post('/verifyEmailAlreadyExistOrNot', [profileValidator.verifyEmailAlreadyExistOrNot, errorMsgs], profileController.verifyEmailAlreadyExistOrNot)
router.post('/requestToVerifyEmail', profileController.requestToVerifyEmail);
router.post('/changeEmail', checkPasswordMiddleware, [profileValidator.changeEmail, errorMsgs], profileController.changeEmail)


router.post('/verifyPhoneNumberAlreadyExistOrNot', [profileValidator.verifyPhoneNumberAlreadyExistOrNot, errorMsgs], profileController.verifyPhoneNumberAlreadyExistOrNot)
router.put('/updatePhoneNumber', checkPasswordMiddleware, [profileValidator.updatePhoneNumber, errorMsgs], profileController.updatePhoneNumber)
// router.put('/updateUserPhoneNumber', [profileValidator.updateUserPhoneNumber, errorMsgs], profileController.updateUserPhoneNumber)
router.post('/verifyPhoneNumber', [profileValidator.verifyPhoneNumber, errorMsgs], profileController.verifyPhoneNumber)

/* LOGOUT ROUTER */
router.get('/logout', profileController.logout);

/* FORCE LOGOUT ROUTE */
router.put('/force/logout', [profileValidator.forceLogoutUser, errorMsgs], profileController.forceLogoutUser);


/* ADMIN LOGOUT ROUTER */
router.put('/adminLogout', profileController.adminLogout);

//GET ALL USER DATA
router.get('/user', profileController.user);

router.post('/redeemRewardPoint', profileController.redeemRewardPoints);

router.get('/reward/history', profileController.rewardPointHistory);

router.delete('/', profileController.deleteAccount);


module.exports = router;
