// Libraries
var express = require('express');
var router = express.Router();


//***************** Controllers **********************/
const superAdminPermissionController = require('../app/Controllers/superAdminPermission.controller');


//***************** Validations **********************/
const errorMsgs = require('../app/Validators/commonValidators').responseValidationResults;

const superAdminPermissionValidator = require('../app/Validators/superAdminPermission.validator')

router.put('/',  [superAdminPermissionValidator.post, errorMsgs], superAdminPermissionController.post);


module.exports = router;
