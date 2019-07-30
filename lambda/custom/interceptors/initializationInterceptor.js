/**
 * Initilizes the skill with any required setup
 * Code logic should only run once during lifespan/session of skill
 *
 *
 */

'use strict'
const SESSION_KEYS = require('../constants').SESSION_KEYS

const Trace = require('../models/trace').Trace

module.exports = {
  async process (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const sessionPropertyExist = (typeof handlerInput.requestEnvelope.session.attributes === 'object' || typeof handlerInput.requestEnvelope.session.attributes === 'undefined')
    const sessionAttributesPropertyNotExist = typeof handlerInput.requestEnvelope.session.attributes === 'undefined'

    if (sessionPropertyExist && sessionAttributesPropertyNotExist) {
      sessionAttributes[SESSION_KEYS.TRACE] = null
      sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT] = 0
    }

    requestAttributes[SESSION_KEYS.HANDLER_TRACE] = new Trace()
  }

}
