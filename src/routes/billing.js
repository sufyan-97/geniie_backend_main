// Libraries
var express = require('express');
var router = express.Router();

//***************** Controllers **********************/
const billingController = require('../app/Controllers/billing.controller');

//***************** Validations **********************/
const commonValidators = require('../app/Validators/commonValidators');
const errorMsgs = commonValidators.responseValidationResults;

const billingValidator = require('../app/Validators/billing')


// ============= Crypto APIs ============= //

router.get('/cryptoCoins', [billingValidator.getCryptoCoins, errorMsgs], billingController.getCryptoCoins)


// ============= Stripe APIs ============= //

router.get('/card', [billingValidator.getCards, errorMsgs], billingController.getCards)

router.post('/card', [billingValidator.addCard, errorMsgs], billingController.addCard)

router.delete('/card', [billingValidator.deleteCard, errorMsgs], billingController.deleteCard)

router.post('/switchCard', [billingValidator.switchCard, errorMsgs], billingController.switchCard)


// ============= General Billing APIs ============= //

router.post('/switchPaymentMethod', [billingValidator.switchPaymentMethod, errorMsgs], billingController.switchPaymentMethod)

router.post('/top-up', [billingValidator.topUp, errorMsgs], billingController.topUp)

router.post('/payCashFromWallet', [billingValidator.payCashFromWallet, errorMsgs], billingController.payCashFromWallet)

router.get('/paymentHistory', [billingValidator.getPaymentHistory, errorMsgs], billingController.getPaymentHistory)

router.get('/statements', [billingValidator.getPaymentHistory, errorMsgs], billingController.getStatements)

router.get('/statement/:id', [billingValidator.getPaymentHistory, errorMsgs], billingController.getStatementDetail)

router.post('/serviceTransaction', [billingValidator.serviceTransaction, errorMsgs], billingController.serviceTransaction)

module.exports = router;