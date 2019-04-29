/**
 * Initilizes the skill with any required setup
 * Code logic should only run once during lifespan/session of skill
 *
 *
 */

'use strict'
const SESSION_KEYS = require('../constants').SESSION_KEYS

const SERVICES = {
  alexaProfileHandler: require('../services/alexaProfile.api'),
  VEHICLE_RECALLS_API: require('../services/vehicleRecalls.api')

}

const PhoneNumber = require('../models/user').PhoneNumber
const Trace = require('../models/trace').Trace

module.exports = {
  async process (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const sessionPropertyExist = (typeof handlerInput.requestEnvelope.session.attributes === 'object' || typeof handlerInput.requestEnvelope.session.attributes === 'undefined')
    const sessionAttributesPropertyNotExist = typeof handlerInput.requestEnvelope.session.attributes === 'undefined'

    if (sessionPropertyExist && sessionAttributesPropertyNotExist) {
      // Warms up the vehicle recalls api, by not awaiting
      SERVICES.VEHICLE_RECALLS_API.Warmer()
      // gets the phone number from alexa api once
      sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER] = new PhoneNumber(await SERVICES.alexaProfileHandler.GetMobileNumber(handlerInput))
    }

    requestAttributes[SESSION_KEYS.HANDLER_TRACE] = new Trace()
  }

}
