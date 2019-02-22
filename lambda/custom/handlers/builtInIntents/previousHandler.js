'use strict'

// Handlers
const SearchForVehicleRecallIntentHandler = require('../customIntents/searchForVehicleRecallHandler')

const PreviousHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent'
  },
  handle (handlerInput) {
    // TODO: add defensive coding to when skip is said out of context
    return SearchForVehicleRecallIntentHandler.PreviousIntentHandler.handle(handlerInput)
  }
}

module.exports = PreviousHandler
