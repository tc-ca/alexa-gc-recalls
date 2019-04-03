'use strict'

const SESSION_KEYS = require('../../constants').SESSION_KEYS

const StartOverIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'AMAZON.StartOverIntent'

    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE] = null
    sessionAttributes[SESSION_KEYS.VEHICLE_MODEL] = null
    sessionAttributes[SESSION_KEYS.VEHICLE_YEAR] = null

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleMakeAndModelIntent',
        confirmationStatus: 'NONE',
        slots: {}
      })
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

module.exports = StartOverIntentHandler
