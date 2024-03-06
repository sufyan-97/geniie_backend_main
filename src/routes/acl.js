var express = require('express');
var router = express.Router();

//***************** Controllers **********************/ 
const controller = require('../app/Controllers/acl.controller');


//***************** Validations **********************/ 
const commonValidators = require('../app/Validators/commonValidators');

const validator = require('../app/Validators/acl')

var errorMsgs = commonValidators.responseValidationResults;

/* VERIFY EMAIL ROUTER */

router.get('/', controller.getAll);

router.get('/:id', [validator.getOne, errorMsgs], controller.getOne);

router.post('/', [validator.post, errorMsgs], controller.post);

router.put('/', [validator.update, errorMsgs], controller.update);

router.put('/privilege', [validator.updatePrivilege, errorMsgs], controller.updatePrivilege);

router.delete('/:id', [validator.delete, errorMsgs], controller.delete);

module.exports = router;
