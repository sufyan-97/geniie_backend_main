
//***************** Libraries *****************// 
const express = require('express');
const router = express.Router();


//***************** Controllers *****************//
const sysyemAppController = require('../app/Controllers/systemApp')

//***************** Validators *****************//
const commonValidators = require('../app/Validators/commonValidators');
const systemAppValidator = require('../app/Validators/systemApp')


//***************** Constants *****************//
const errorMsgs = commonValidators.responseValidationResults;


//***************** Routes *****************//
router.get('/', [systemAppValidator.getAll, errorMsgs], sysyemAppController.getAll);

router.post('/', [systemAppValidator.create, errorMsgs], sysyemAppController.create);

router.put('/', [systemAppValidator.update, errorMsgs], sysyemAppController.update);

router.delete('/:id', [systemAppValidator.delete, errorMsgs], sysyemAppController.delete);

module.exports = router;
