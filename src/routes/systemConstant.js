var express = require('express');
var router = express.Router();

//Provider
var jwtPassport = require('../app/Providers/jwtStrategy.provider')

//***************** Controllers **********************/
const systemConstantController = require('../app/Controllers/systemConstant.controller');

//***************** Validations **********************/

const commonValidators = require('../app/Validators/commonValidators');

const systemConstantValidator = require('../app/Validators/systemConstant')
var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */

router.get('/all', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), systemConstantController.getAll);

router.get('/', systemConstantController.getActive);

router.get('/:key', [systemConstantValidator.getOne, errorMsgs], systemConstantController.getOne);

router.post('/', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [systemConstantValidator.post, errorMsgs], systemConstantController.post);

router.put('/', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [systemConstantValidator.update, errorMsgs], systemConstantController.update);

router.delete('/:id', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [systemConstantValidator.delete, errorMsgs], systemConstantController.delete);


module.exports = router;
