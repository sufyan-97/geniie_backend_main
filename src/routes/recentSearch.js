var express = require('express');
var router = express.Router();

//***************** Controllers **********************/ 
const controller = require('../app/Controllers/recentSearch.controller');


//***************** Validations **********************/ 
const errorMsgs = require('../app/Validators/commonValidators').responseValidationResults;

const validator = require('../app/Validators/recentsearch')

/* VERIFY EMAIL ROUTER */

router.get('/', controller.getAll);

router.post('/',[validator.post,errorMsgs], controller.bulkPost);

router.delete('/all',controller.bulkDelete)
router.delete('/:id', [validator.delete, errorMsgs], controller.delete);

module.exports = router;
