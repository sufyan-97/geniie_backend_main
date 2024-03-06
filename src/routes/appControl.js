var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

//Provider
var jwtPassport = require('../app/Providers/jwtStrategy.provider')

//***************** Controllers **********************/
const appControlController = require('../app/Controllers/appControl.controller');

//***************** Validations **********************/

const commonValidators = require('../app/Validators/commonValidators');

const appControlValidator = require('../app/Validators/appControl')
var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */

router.get('/all', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [appControlValidator.getAll, errorMsgs], appControlController.getAll);

router.get('/', [appControlValidator.getAll, errorMsgs], appControlController.getActive);

router.get('/:key', [appControlValidator.getOne, errorMsgs], appControlController.getOne);

router.post('/', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [appControlValidator.post, errorMsgs], appControlController.post);

router.put('/', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [appControlValidator.update, errorMsgs], appControlController.update);

router.delete('/:id', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [appControlValidator.delete, errorMsgs], appControlController.delete);


module.exports = router;
