var express = require('express');
var router = express.Router();

//***************** Controllers **********************/ 
const supportDepartment = require('../app/Controllers/supportDepartment.controller');

//***************** Validations **********************/ 

router.get('/', supportDepartment.getAll);

module.exports = router;
