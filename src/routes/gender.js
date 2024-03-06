// Libraries
var express = require('express');
var router = express.Router();

// Providers
var jwtPassport = require('../app/Providers/jwtStrategy.provider')


//***************** Controllers **********************/
const genderController = require('../app/Controllers/gender.controller');


//***************** Validations **********************/
const errorMsgs = require('../app/Validators/commonValidators').responseValidationResults;

const genderValidator = require('../app/Validators/gender')

/* VERIFY EMAIL ROUTER */

router.get('/', genderController.getAll);

// router.get('/:id', [addressValidator.getOne, errorMsgs], genderController.getOne);

router.post('/',  [genderValidator.post, errorMsgs], genderController.post);

router.put('/',  [genderValidator.update, errorMsgs], genderController.update);

router.delete('/:id',  [genderValidator.delete, errorMsgs], genderController.delete);


module.exports = router;
