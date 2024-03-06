var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

//***************** Controllers **********************/ 
const controller = require('../app/Controllers/contactUs.controller');


//***************** Validations **********************/ 
const commonValidators = require('../app/Validators/commonValidators');

const validator = require('../app/Validators/contactUs')
var errorMsgs = commonValidators.responseValidationResults;

/* VERIFY EMAIL ROUTER */

router.get('/', controller.getAll);

router.get('/:id', [validator.getOne, errorMsgs], controller.getOne);

router.post('/', multipart(), [validator.post, errorMsgs], controller.post);

router.put('/', multipart(), [validator.update, errorMsgs], controller.update);

router.delete('/:id', [validator.delete, errorMsgs], controller.delete);

module.exports = router;
