var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');


// Provider
var jwtPassport = require('../app/Providers/jwtStrategy.provider')

// Constants
const jwtOptions = {
    session: false,
    failWithError: true
}


//***************** Controllers **********************/
const onboardingController = require('../app/Controllers/onboarding.controller');

//***************** Validations **********************/

const commonValidators = require('../app/Validators/commonValidators');

const onboardingValidator = require('../app/Validators/onboarding')
var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */

router.get('/', [onboardingValidator.getAll, errorMsgs], onboardingController.getAll);

router.get('/:id', [onboardingValidator.getOne, errorMsgs], onboardingController.getOne);

router.post('/', jwtPassport.authenticate('jwt', jwtOptions), [onboardingValidator.post, errorMsgs], onboardingController.post);

router.put('/', jwtPassport.authenticate('jwt', jwtOptions), [onboardingValidator.update, errorMsgs], onboardingController.update);

router.delete('/:id', jwtPassport.authenticate('jwt', jwtOptions), [onboardingValidator.delete, errorMsgs], onboardingController.delete);


module.exports = router;
