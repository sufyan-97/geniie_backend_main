// Libraries
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');


//***************** Controllers **********************/
const controller = require('../app/Controllers/promotion.controller');


//***************** Validations **********************/
const commonValidators = require('../app/Validators/commonValidators');

const validator = require('../app/Validators/promotion.validator')

var errorMsgs = commonValidators.responseValidationResults;

/* VERIFY EMAIL ROUTER */

router.get('/', controller.getAll);

router.get('/specific', [validator.getUserSpecificPromotions, errorMsgs], controller.getUserSpecificPromotions);

// router.get('/:id', [validator.getOne, errorMsgs], controller.getOne);

router.post('/', multipart(), [validator.create, errorMsgs], controller.createPromotion);

// router.post('/apply', [validator.apply, errorMsgs], controller.apply);

router.put('/', multipart(), [validator.update, errorMsgs], controller.updatePromotion);

router.delete('/:id', [validator.delete, errorMsgs], controller.deletePromotion);

// router.put('/availability', [validator.availability, errorMsgs], controller.changeAvailability);


module.exports = router;
