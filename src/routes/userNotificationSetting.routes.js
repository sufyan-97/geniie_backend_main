var express = require('express');
var router = express.Router();

//***************** Controllers **********************/ 
const userNotificationSettingController = require('../app/Controllers/userNotificationSetting.controller');

//***************** Validations **********************/
const commonValidators = require('../app/Validators/commonValidators');
const userNotificationSettingValidator = require('../app/Validators/userNotificationSetting')

var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */

router.get('/', userNotificationSettingController.getAll);

router.put('/', [userNotificationSettingValidator.update, errorMsgs], userNotificationSettingController.update);

module.exports = router;
