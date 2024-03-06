// Libraries
var express = require('express');
var router = express.Router();

//***************** Controllers **********************/
const webController = require('../app/Controllers/web.controller');

// Provider
var jwtPassport = require('../app/Providers/jwtStrategy.provider')

//***************** Validations **********************/

const webValidator = require('../app/Validators/web.validator')

const errorMsgs = require('../app/Validators/commonValidators').responseValidationResults;

// Constants
const jwtOptions = {
	session: false,
	failWithError: true
}

//***************** Languages User APIs **********************//


// TopUp Success
router.post('/message', [webValidator.saveMessage, errorMsgs], webController.saveMessage);

router.get('/subscriber', jwtPassport.authenticate('jwt', jwtOptions), webController.getSubscribers);

router.post('/subscribe', [webValidator.subscribe, errorMsgs], webController.subscribe);

router.delete('/subscriber/:id', jwtPassport.authenticate('jwt', jwtOptions), [webValidator.deleteSubscribe, errorMsgs], webController.deleteSubscriber);

router.get('/unsubscribe', [webValidator.unsubscribe, errorMsgs], webController.unsubscribe)

router.post('/messageToSubscribers', jwtPassport.authenticate('jwt', jwtOptions), [webValidator.messageToSubscriber, errorMsgs], webController.messageToSubscriber);


module.exports = router;