var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

//***************** Controllers **********************/ 
const controller = require('../app/Controllers/serviceCategory.controller');


//***************** Validations **********************/ 
const commonValidators = require('../app/Validators/commonValidators');

const validator = require('../app/Validators/serviceCategory')
var errorMsgs = commonValidators.responseValidationResults;

/* VERIFY EMAIL ROUTER */

router.get('/', controller.getAll);

router.get('/:id', [validator.getOne, errorMsgs], controller.getOne);

router.post('/', multipart(), [validator.post, errorMsgs], controller.post);

router.put('/:id', multipart(), [validator.update, errorMsgs], controller.update);

router.delete('/:id', [validator.delete, errorMsgs], controller.delete);

module.exports = router;