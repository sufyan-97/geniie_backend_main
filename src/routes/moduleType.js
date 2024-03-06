// Libraries
var express = require('express');
var router = express.Router();

// Providers
var jwtPassport = require('../app/Providers/jwtStrategy.provider')


//***************** Controllers **********************/
const moduleTypeController = require('../app/Controllers/moduleType.controller');


//***************** Validations **********************/
const errorMsgs = require('../app/Validators/commonValidators').responseValidationResults;

const moduleTypeValidator = require('../app/Validators/moduleType')

router.get('/', moduleTypeController.getAll);

router.get('/:id',  [moduleTypeValidator.getOne, errorMsgs], moduleTypeController.getOne);

router.post('/',  [moduleTypeValidator.post, errorMsgs], moduleTypeController.post);

router.put('/',  [moduleTypeValidator.update, errorMsgs], moduleTypeController.update);

router.delete('/:id',  [moduleTypeValidator.delete, errorMsgs], moduleTypeController.delete);


module.exports = router;
