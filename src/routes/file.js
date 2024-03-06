var express = require('express');
var router = express.Router();
// Provider
var jwtPassport = require('../app/Providers/jwtStrategy.provider')
// Constants
const jwtOptions = {
    session: false,
    failWithError: true
}
//***************** Controllers **********************/
const fileController = require('../app/Controllers/file.controller');

//***************** Validations **********************/



const commonValidators = require('../app/Validators/commonValidators');

const fileValidator = require('../app/Validators/file')
var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */

router.get('/:fileName', jwtPassport.authenticate('jwt', jwtOptions), [fileValidator.getOne, errorMsgs], fileController.getOne);
router.get('/noAuth/:fileName', [fileValidator.getOne, errorMsgs], fileController.getOneNoAuth);
router.get('/:folderName/:fileName',jwtPassport.authenticate('jwt', jwtOptions), [fileValidator.getOne, errorMsgs], fileController.getOneWithFolder);

module.exports = router;
