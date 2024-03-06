// Library
const NodeGeocoder = require('node-geocoder');

// constants
var app_constants = require('../../config/constants');

const options = {
    provider: 'openstreetmap',

    // Optional depending on the providers
    // fetch: customFetchImplementation,
    // apiKey: app_constants.GEOCODER_API_KEY,
    formatter: null // 'gpx', 'string', ...
};

exports.geocoder = NodeGeocoder(options);