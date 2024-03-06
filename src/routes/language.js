//***************** Libraries **********************/
const express = require('express');
const router = express.Router();

const multipart = require('connect-multiparty');


var jwtPassport = require('../app/Providers/jwtStrategy.provider')

//***************** Controllers **********************/
const controller = require('../app/Controllers/language.controller');


//***************** Validations **********************/
const commonValidators = require('../app/Validators/commonValidators');

const validator = require('../app/Validators/language')
var errorMsgs = commonValidators.responseValidationResults;




//***************** Language Keys User APIs **********************//

router.get('/lngJson', [validator.getLanguageFile, errorMsgs], controller.getLanguageFile)
// router.get('/:id', [addressValidator.getOne, errorMsgs], controller.getOne);

//***************** Language Keys Admin APIs **********************//

router.get('/lngAllJson', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), controller.getAllLanguageFile)


router.get('/lngKeyValues', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.getKeyValues, errorMsgs], controller.getKeyValues)



router.post('/lngKeys', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.createKeys, errorMsgs], controller.createKeys)

router.delete('/lngKeys', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.deleteKeys, errorMsgs], controller.deleteKeys)


//***************** Languages User APIs **********************//
router.get('/', controller.getLanguages);

//***************** Languages Admin APIs **********************//
router.post('/', multipart(), jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.addLanguage, errorMsgs], controller.addLanguage);

router.put('/:id', multipart(), jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.updateLanguage, errorMsgs], controller.updateLanguage);

router.delete('/:id', jwtPassport.authenticate('jwt', { session: false, failWithError: true }), [validator.delete, errorMsgs], controller.deleteLanguage);





module.exports = router;
