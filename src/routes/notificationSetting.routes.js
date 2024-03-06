var express = require('express');
var router = express.Router();

//***************** Controllers **********************/ 
const notificationSetting = require('../app/Controllers/notificationSetting.controller');

//***************** Validations **********************/ 
const commonValidators = require('../app/Validators/commonValidators');
const NotificationSetting = require('../app/Validators/NotificationSetting')

var errorMsgs = commonValidators.responseValidationResults;


router.get('/', [NotificationSetting.getAll, errorMsgs], notificationSetting.getAll);

router.get('/:id', [NotificationSetting.getOne, errorMsgs], notificationSetting.getOne);

router.post('/', [NotificationSetting.post, errorMsgs], notificationSetting.post);

router.put('/', [NotificationSetting.update, errorMsgs], notificationSetting.update);

router.delete('/:id', [NotificationSetting.delete, errorMsgs], notificationSetting.delete);


module.exports = router;
