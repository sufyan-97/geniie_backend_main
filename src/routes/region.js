var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

//***************** Controllers **********************/ 
const controller = require('../app/Controllers/region.controller');

//***************** Validations **********************/ 
const commonValidators = require('../app/Validators/commonValidators');

const profileValidator = require('../app/Validators/region')

//***************** Constants **********************/ 
var errorMsgs = commonValidators.responseValidationResults;

//***************** Routes **********************/ 

router.get('/', controller.getOurRegions);
router.get('/currencies', controller.getAllCurrencies);
router.get('/country', controller.getAllCountries);
router.put('/country', [profileValidator.addCountry, errorMsgs], controller.updateCountries);
router.get('/country/:countryId/state', controller.getAllCountryStates);
router.put('/country/:countryId/state', [profileValidator.addCountryState, errorMsgs], controller.updateCountryStates);
router.get('/country/:countryId/state/:stateId/cities', controller.getAllStateCities);
router.put('/country/:countryId/state/:stateId/cities', [profileValidator.addCountryStateCities, errorMsgs], controller.updateCountryStateCities);


module.exports = router;
