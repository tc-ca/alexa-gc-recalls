'use strict'

const SESSION_KEYS = require('../../constants').SESSION_KEYS
const HELPER = require('../../utils/helper')

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

    HELPER.SetTrace({
      handlerName: 'StartOverIntentHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

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
