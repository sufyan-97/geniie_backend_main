// Libraries
const express = require('express');
const router = express.Router();


// Constants
const jwtOptions = {
	session: false,
	failWithError: true
}

//***************** Controllers **********************//
const userController = require('../app/Controllers/user.controller');


//***************** Validations **********************//
const commonValidators = require('../app/Validators/commonValidators');

const userValidator = require('../app/Validators/user')
// const authValidator = require('../app/Validators/auth')

//***************** Constants **********************/
const errorMsgs = commonValidators.responseValidationResults;


//***************** User Routes **********************//
/* GET ALL USERS */
router.get('/', userController.getAll);

router.get('/agent', userController.getAgents)
router.get('/providerRiders', userController.getProviderRiders);
router.get('/restaurantRiders', [userValidator.getRestaurantRiders, errorMsgs], userController.getRestaurantRiders)

router.post('/agent', [userValidator.createAgent, errorMsgs], userController.createAgent)
router.post('/restaurantRider', [userValidator.saveRestaurantRider, errorMsgs], userController.saveRestaurantRider);
router.put('/suspend', [userValidator.suspend, errorMsgs], userController.suspend)
router.post('/riderPrice', [userValidator.updateRiderPrice, errorMsgs], userController.updateRiderPrice)
router.get('/riderPrice', userController.getRiderPrice)


router.get('/:id', userController.getOne);


router.put('/changePassword', [userValidator.changePassword, errorMsgs], userController.changePassword)

router.post('/balanceLimit', [userValidator.balanceLimit, errorMsgs], userController.balanceLimit)




module.exports = router;
