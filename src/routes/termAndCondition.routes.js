// Libraries
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');


//***************** Controllers **********************/
const controller = require('../app/Controllers/termAndCondition.controller');


//***************** Validations **********************/
const commonValidators = require('../app/Validators/commonValidators');

const validator = require('../app/Validators/termAndCondition.validator')

var errorMsgs = commonValidators.responseValidationResults;

/* VERIFY EMAIL ROUTER */

router.get('/', controller.getAll);

router.post('/', [validator.create, errorMsgs], controller.create);

router.put('/', [validator.update, errorMsgs], controller.update);

router.delete('/:id', [validator.delete, errorMsgs], controller.delete);


module.exports = router;
