'use strict'
const SESSION_KEYS = require('../constants').SESSION_KEYS

const SERVICES = {
  alexaProfileHandler: require('../services/alexaProfile.api'),
  VEHICLE_RECALLS_API: require('../services/vehicleRecalls.api')

}

const PhoneNumber = require('../models/user').PhoneNumber

module.exports = {
  async process (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    if ((typeof handlerInput.requestEnvelope.session.attributes === 'object' || typeof handlerInput.requestEnvelope.session.attributes === 'undefined') &&
     (typeof handlerInput.requestEnvelope.session.attributes === 'undefined' || typeof handlerInput.requestEnvelope.session.attributes.USER_PHONE_NUMBER === 'undefined')) {
      // Warms up the vehicle recalls api, by not awaiting
      SERVICES.VEHICLE_RECALLS_API.Warmer()
      // gets the phone number from alexa api once
      sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER] = new PhoneNumber(await SERVICES.alexaProfileHandler.GetMobileNumber(handlerInput))
      console.log('profile number is: ', sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER])
    }
  }

}
