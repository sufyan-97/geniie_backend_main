var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

//***************** Controllers **********************/ 
const userNotificationController = require('../app/Controllers/userNotification.controller');

//***************** Validations **********************/ 

const commonValidators = require('../app/Validators/commonValidators');

const userNotificationValidator = require('../app/Validators/userNotification')
var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */

router.get('/', userNotificationController.getAll);

// router.get('/:id', [notificationValidator.getOne, errorMsgs], userNotificationController.getOne);

// router.post('/', [notificationValidator.post, errorMsgs], userNotificationController.post);

router.put('/markAsRead/:id', [userNotificationValidator.markAsRead, errorMsgs], userNotificationController.update);

// router.delete('/:id', [notificationValidator.delete, errorMsgs], userNotificationController.delete);


module.exports = router;
