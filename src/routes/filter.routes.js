
//***************** Libraries *****************//
const express = require('express');
const router = express.Router();


var jwtPassport = require('../app/Providers/jwtStrategy.provider')

//***************** Controllers *****************//
const filterController = require('../app/Controllers/filter.controller')

//***************** Validators *****************//
const commonValidators = require('../app/Validators/commonValidators');
const filterValidator = require('../app/Validators/filter.validator')


//***************** Constants *****************//
const errorMsgs = commonValidators.responseValidationResults;


//***************** Routes *****************//
router.get('/', [filterValidator.get, errorMsgs], filterController.getActive);

router.get('/all', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [filterValidator.get, errorMsgs], filterController.getAll);

router.get('/:id', [filterValidator.getOne, errorMsgs], filterController.getOne);

router.post('/', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [filterValidator.post, errorMsgs], filterController.post);

router.put('/', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [filterValidator.update, errorMsgs], filterController.update);

router.delete('/:id', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [filterValidator.delete, errorMsgs], filterController.delete);

module.exports = router;
