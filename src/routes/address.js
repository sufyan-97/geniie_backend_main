var express = require('express');
var router = express.Router();


//***************** Controllers **********************/ 
const addressController = require('../app/Controllers/address.controller');




//***************** Validations **********************/ 
const commonValidators = require('../app/Validators/commonValidators');

const addressValidator = require('../app/Validators/address')
var errorMsgs = commonValidators.responseValidationResults;

/* VERIFY EMAIL ROUTER */

router.get('/', addressController.getAll);

router.get('/:id', [addressValidator.getOne, errorMsgs], addressController.getOne);

router.post('/', [addressValidator.post, errorMsgs], addressController.post);

router.put('/', [addressValidator.post, errorMsgs], addressController.update);

router.delete('/:id', [addressValidator.delete, errorMsgs], addressController.delete);

router.put('/updateActiveAddress/:id', [addressValidator.updateActiveAddress, errorMsgs], addressController.updateActiveAddress);



module.exports = router;
