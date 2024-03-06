// Libraries
var express = require('express');
var router = express.Router();

//***************** Controllers **********************/ 
const ipnController = require('../app/Controllers/ipn.controller');


//***************** Validations **********************/
const commonValidators = require('../app/Validators/commonValidators');

const ipnValidator = require('../app/Validators/ipn.validator')

const errorMsgs = commonValidators.responseValidationResults;

//***************** Languages User APIs **********************//


// TopUp Success
router.get('/paypalSuccess', [ipnValidator.paypalSuccessPayment, errorMsgs], ipnController.paypalSuccessPayment);
router.get('/paypalFailure', [ipnValidator.paypalCancelPayment, errorMsgs], ipnController.paypalCancelPayment);

router.get('/paypalOrderSuccess', [ipnValidator.paypalOrderSuccess, errorMsgs], ipnController.paypalOrderSuccess);
router.get('/paypalOrderFailure', [ipnValidator.paypalOrderCancel, errorMsgs], ipnController.paypalOrderCancel);

router.get('/paypalBookingSuccess', [ipnValidator.paypalOrderSuccess, errorMsgs], ipnController.paypalBookingSuccess);
router.get('/paypalBookingFailure', [ipnValidator.paypalOrderCancel, errorMsgs], ipnController.paypalOrderCancel);



module.exports = router;