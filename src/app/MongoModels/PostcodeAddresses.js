var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var postcodeAddressesSchema = new Schema({
    postcode: {
        type: String,
    },
    postcodeAddress: {
        type: String,
    },
    addressDetails: {
        type: Object,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    city: {
        type: String,
    },
    street: {
        type: String,
    },
    completePostcodeDetails: {
        type: Object,
    },
},{
    timestamps : true
});

const postcodeAddresses = mongoose.model('postcode_addresses', postcodeAddressesSchema);

module.exports = {
    postcodeAddresses: postcodeAddresses,

};