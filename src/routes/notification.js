var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

//***************** Controllers **********************/ 
const notificationController = require('../app/Controllers/notification.controller');

//***************** Validations **********************/ 

const commonValidators = require('../app/Validators/commonValidators');

const notificationValidator = require('../app/Validators/notification')
var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */

router.get('/', notificationController.getAll);

router.get('/:id', [notificationValidator.getOne, errorMsgs], notificationController.getOne);

router.post('/', [notificationValidator.post, errorMsgs], notificationController.post);

// router.put('/', [notificationValidator.update, errorMsgs], notificationController.update);

router.delete('/:id', [notificationValidator.delete, errorMsgs], notificationController.delete);


module.exports = router;
