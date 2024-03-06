var express = require('express');
var router = express.Router();

//***************** Controllers **********************/ 
const nextOpeningController = require('../app/Controllers/nextOpening.controller');

//***************** Validations **********************/ 

const commonValidators = require('../app/Validators/commonValidators');

const nextOpeningValidator = require('../app/Validators/nextOpening.validator')
var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */

router.get('/', [nextOpeningValidator.getAll, errorMsgs], nextOpeningController.getAll);


router.post('/', [nextOpeningValidator.save, errorMsgs], nextOpeningController.save);

router.put('/', [nextOpeningValidator.update, errorMsgs], nextOpeningController.update);

router.delete('/:id', [nextOpeningValidator.delete, errorMsgs], nextOpeningController.delete);


module.exports = router;
