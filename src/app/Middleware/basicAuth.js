// Libraries
var auth = require('http-auth');
const bcrypt = require('bcrypt');
// App Constants & Configs
const app_constants = require('../../../config/constants');

// Swagger Auth
var basicAuth = auth.basic({
    realm: "MicroService Authentication"
}, async (username, password, callback) => {

    const hash = await bcrypt.compare(app_constants.BASIC_AUTH_PASSWORD, password);

    callback(username === app_constants.BASIC_AUTH_USER && hash);
});

module.exports = auth.connect(basicAuth)