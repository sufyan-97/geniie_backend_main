// Libraries
var util = require("util");
const exec = util.promisify(require("child_process").exec);
var randomize = require("randomatic");

// Custom Libraries
const { sql } = require("../config/database");

// Constants
const app_constants = require("../config/constants");


module.exports = {

    replaceAt: function (string, index, replace) {
		index--;
		return (
			string.substring(0, index) + replace + string.substring(index + 1)
		);
	},

    
}