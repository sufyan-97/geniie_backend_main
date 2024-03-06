
//***************** Libraries *****************//
const express = require('express');
const router = express.Router();

var jwtPassport = require('../app/Providers/jwtStrategy.provider')

//***************** Controllers *****************//
const deviceController = require('../app/Controllers/device.controller')

//***************** Validators *****************//
const commonValidators = require('../app/Validators/commonValidators');
const deviceValidator = require('../app/Validators/device')


//***************** Constants *****************//
const errorMsgs = commonValidators.responseValidationResults;


//***************** Routes *****************//
router.get('/', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [deviceValidator.getAll, errorMsgs], deviceController.getAll);

router.post('/register', [deviceValidator.register, errorMsgs], deviceController.updateOrRegister);

// router.put('/:id', [deviceValidator.update, errorMsgs], deviceController.update);

// router.delete('/:id', [deviceValidator.delete, errorMsgs], deviceController.delete);

module.exports = router;
