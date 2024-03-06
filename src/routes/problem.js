// Libraries
var express = require('express');
var router = express.Router();


//***************** Controllers **********************/ 
const controller = require('../app/Controllers/problem.controller');


//***************** Validations **********************/
const commonValidators = require('../app/Validators/commonValidators');

const validator = require('../app/Validators/problem')
var errorMsgs = commonValidators.responseValidationResults;

router.post('/', [validator.post, errorMsgs], controller.post);

module.exports = router;
