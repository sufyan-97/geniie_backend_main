// Libraries
var express = require('express');
var router = express.Router();



//***************** Controllers **********************//
const riderController = require('../../app/Controllers/internal/rider.controller');


//***************** Validations **********************//
const commonValidators = require('../../app/Validators/commonValidators');

// const authValidator = require('../app/Validators/auth')
var errorMsgs = commonValidators.responseValidationResults;


//***************** User Routes **********************//
/* GET ALL USERS */
router.get('/', riderController.getAll);


module.exports = router;
