var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

//***************** Controllers **********************/ 
const addressLabelController = require('../app/Controllers/address.label.controller');




//***************** Validations **********************/ 
const commonValidators = require('../app/Validators/commonValidators');

const addressLabelValidator = require('../app/Validators/addressLabel')
var errorMsgs = commonValidators.responseValidationResults;

/* VERIFY EMAIL ROUTER */

router.get('/', addressLabelController.getAll);

router.get('/:id', [addressLabelValidator.getOne, errorMsgs], addressLabelController.getOne);

router.post('/', multipart(), [addressLabelValidator.post, errorMsgs], addressLabelController.post);

router.put('/', multipart(), [addressLabelValidator.update, errorMsgs], addressLabelController.update);

router.delete('/:id', [addressLabelValidator.delete, errorMsgs], addressLabelController.delete);

module.exports = router;
