

// Constants
const app_constants = require('../../config/constants')

exports.twilioClient = require('twilio')(app_constants.TWILIO_SID, app_constants.TWILIO_AUTH_TOKEN)