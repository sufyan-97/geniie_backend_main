const express = require('express');
const router = express.Router();



//***************** Controllers **********************/
const emailTemplateController = require('../app/Controllers/emailTemplate.controller');

//***************** Validations **********************/

const emailTemplateValidator = require('../app/Validators/emailTemplate.validator')
const errorMsgs = require('../app/Validators/commonValidators').responseValidationResults;

// var errorMsgs = commonValidators.responseValidationResults;
/* VERIFY EMAIL ROUTER */
router.post('/send', [emailTemplateValidator.sendMail, errorMsgs], emailTemplateController.sendMail);

router.get('/', [emailTemplateValidator.getAll, errorMsgs], emailTemplateController.getAll);

router.get('/mailRecord', emailTemplateController.getSentMail);

// router.get('/:id', [emailTemplateValidator.getOne, errorMsgs], emailTemplateController.getOne);

// router.post('/', [emailTemplateValidator.post, errorMsgs], emailTemplateController.post);
router.post('/', [emailTemplateValidator.save, errorMsgs], emailTemplateController.save);


router.put('/', [emailTemplateValidator.update, errorMsgs], emailTemplateController.update);

router.delete('/:id', [emailTemplateValidator.delete, errorMsgs], emailTemplateController.delete);


module.exports = router;
