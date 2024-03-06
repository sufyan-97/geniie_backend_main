var express = require('express');
var router = express.Router();

//***************** Controllers **********************/ 
const controller = require('../app/Controllers/searchByPostcode.controller');


//***************** Validations **********************/ 
const commonValidators = require('../app/Validators/commonValidators');

const validator = require('../app/Validators/searchByPostcode')

var errorMsgs = commonValidators.responseValidationResults;

/* VERIFY EMAIL ROUTER */

router.get('/', controller.getAll);

router.get('/:postcode', controller.getOne);

// router.post('/', [validator.post, errorMsgs], controller.post);

// router.put('/', [validator.update, errorMsgs], controller.update);

// router.delete('/:id', [validator.delete, errorMsgs], controller.delete);

module.exports = router;
