var express = require('express');
var router = express.Router();

//***************** Controllers **********************/ 
const controller = require('../app/Controllers/rejectionReason.controller');

//***************** Validations **********************//
const errorMsgs = require('../app/Validators/commonValidators').responseValidationResults;

const validator = require('../app/Validators/rejectionReason')

/* VERIFY EMAIL ROUTER */

router.post("/", [validator.post, errorMsgs], controller.post);

router.get("/:id", controller.getOne);

router.get("/", [validator.getAll, errorMsgs], controller.getAll);

router.put("/", [validator.update, errorMsgs], controller.update);

router.delete("/:id", [validator.delete, errorMsgs], controller.delete)

module.exports = router;
