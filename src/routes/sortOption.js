var express = require('express');
var router = express.Router();

var jwtPassport = require('../app/Providers/jwtStrategy.provider')

//***************** Controllers **********************/
const controller = require('../app/Controllers/sortOption.controller');


//***************** Validations **********************/
const commonValidators = require('../app/Validators/commonValidators');

const validator = require('../app/Validators/sortOption')

var errorMsgs = commonValidators.responseValidationResults;

/* VERIFY EMAIL ROUTER */

router.get('/', [validator.get, errorMsgs], controller.getActive);

router.get('/all', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.get, errorMsgs], controller.getAll);

router.get('/:id', [validator.getOne, errorMsgs], controller.getOne);

router.post('/', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.post, errorMsgs], controller.post);

router.put('/', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.update, errorMsgs], controller.update);

router.delete('/:id', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.delete, errorMsgs], controller.delete);

module.exports = router;
