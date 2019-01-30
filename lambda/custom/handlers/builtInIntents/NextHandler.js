'use strict'

// Handlers
const SearchForVehicleRecallIntentHandler = require('../customIntents/SearchForVehicleRecallHandler')

const NextIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent'
  },
  handle (handlerInput) {
    // TODO: add defensive coding to when skip is said out of context
    return SearchForVehicleRecallIntentHandler.MoveToNextRecallHandler.handle(handlerInput)
  }
}

module.exports = NextIntentHandler
