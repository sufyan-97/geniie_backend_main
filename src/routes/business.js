// Libraries
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');

// Middleware
var jwtPassport = require('../app/Providers/jwtStrategy.provider')
var aclMiddleware = require('../app/Middleware/aclMiddleware');


//***************** Controllers **********************/
const controller = require('../app/Controllers/business.controller');

//***************** Validations **********************/
const errorMsgs = require('../app/Validators/commonValidators').responseValidationResults;
const validator = require('../app/Validators/business')


/* UNVERIFIED ROUTES */

router.get('/related', controller.related);

router.post('/', [validator.saveProvider, errorMsgs], controller.saveProvider);

router.post('/rider', [validator.saveRider, errorMsgs], controller.saveRider);


/* VERIFIED ROUTES */


//          New Business Routes                   //
router.get('/till', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, [validator.getTill, errorMsgs], controller.getTill)
router.post('/till', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, multipart(), [validator.saveTill, errorMsgs], controller.saveTill)
router.put('/updateDocumentExpiry', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, [validator.updateBusinessDocumentExpiry, errorMsgs], controller.updateDocumentExpiryDate)

router.get('/getBusinessRequest', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, controller.getBusinessRequest);
router.put('/approve/:id', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, [validator.approveBusiness, errorMsgs], controller.approveBusiness)
router.put('/reject/:id', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, [validator.approveBusiness, errorMsgs], controller.rejectBusiness)
router.put('/updateBusinessRequestRejection', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, [validator.updateBusinessRequestRejection, errorMsgs], controller.updateBusinessRequestRejection);


//          New Registration Routes               //
router.get('/rider/till', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, [validator.getTill, errorMsgs], controller.getRiderTill)
router.post('/rider/till', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, multipart(), [validator.saveRiderTill, errorMsgs], controller.saveRiderTill)

router.get('/registration', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, controller.getRegistrations);
router.put('/approve/registration/:id', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, [validator.approveBusiness, errorMsgs], controller.approveRegistration)
router.put('/reject/registration/:id', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, [validator.approveBusiness, errorMsgs], controller.rejectRegistration)
router.put('/registration/updateRegistrationRejection', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), aclMiddleware, [validator.updateRegistrationRejection, errorMsgs], controller.updateRegistrationRejection);

module.exports = router;