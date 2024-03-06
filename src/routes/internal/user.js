// Libraries
var express = require('express');
var router = express.Router();



//***************** Controllers **********************//
const userController = require('../../app/Controllers/internal/user.controller');


//***************** Validations **********************//
const commonValidators = require('../../app/Validators/commonValidators');

// const authValidator = require('../app/Validators/auth')
var errorMsgs = commonValidators.responseValidationResults;


//***************** User Routes **********************//
/* GET ALL USERS */
router.get('/', userController.getAll);


module.exports = router;
