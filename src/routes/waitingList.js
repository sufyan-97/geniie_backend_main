// Libraries
const express = require('express');
const router = express.Router();

// Controllers
const waitingListController = require('../app/Controllers/waitingList.controller.js');

// validators
const waitingListValidator = require('../app/Validators/waitingList');

// constants
const errorMsgs = require('../app/Validators/commonValidators').responseValidationResults;


// Routes
router.post('/', [waitingListValidator.addWaitingList, errorMsgs], waitingListController.addWaitingList);

module.exports = router;