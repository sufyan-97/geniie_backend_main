var express = require('express');
var router = express.Router();
var jwtPassport = require('../app/Providers/jwtStrategy.provider')

//***************** Controllers **********************/
const userLanguageController = require('../app/Controllers/userLanguage.controller');

//***************** Validations **********************/

const commonValidators = require('../app/Validators/commonValidators');

const userLanguageValidator = require('../app/Validators/userLanguage')
var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */

router.get('/', userLanguageController.getAll);

router.put('/', [userLanguageValidator.update, errorMsgs], userLanguageController.update);

module.exports = router;
