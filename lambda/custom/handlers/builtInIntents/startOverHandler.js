'use strict'

const SESSION_KEYS = require('../../constants').SESSION_KEYS
const HANDLERS_STRING_NAMES = require('../../constants').HANDLERS_STRING_NAMES
const Trace = require('../../models/trace').Trace

const StartOverIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE] = null
    sessionAttributes[SESSION_KEYS.VEHICLE_MODEL] = null
    sessionAttributes[SESSION_KEYS.VEHICLE_YEAR] = null

    const trace = new Trace(requestAttributes[SESSION_KEYS.HANDLER_TRACE])
    trace.location.push(HANDLERS_STRING_NAMES.START_OVER_INTENT_HANDLER)

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleMakeAndModelIntent',
        confirmationStatus: 'NONE',
        slots: {}
      })
      .getResponse()
  }
}

module.exports = StartOverIntentHandler
