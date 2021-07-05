'use strict'
// Handlers
const HANDLERS = {
  VehicleRecallHandler: require('../customIntents/searchForVehicleRecallHandler'),
  ErrorHandler: require('../builtInIntents/errorHandler')
}

const PreviousHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent'
  },
  handle (handlerInput) {
    return HANDLERS.VehicleRecallHandler.MoveToPreviousRecallHandler.handle(handlerInput)
  }
}

/**
 * Executed when next intent is called out of context. i.e. user not in recall read portion of script.
 * @param {*} handlerInput
 * @returns
 */
const PreviousIntentHandlerOutOfContext = {
  canHandle (handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent' &&
        handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation === undefined) ||
        (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent' &&
        handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation &&
        handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation !== 'ReadVehicleRecallHandler')
  },
  handle (handlerInput) {
    return HANDLERS.ErrorHandler.CommandOutOfContextHandler.handle(handlerInput)
  }
}

module.exports = { handler: PreviousHandler, outOfContextHandler: PreviousIntentHandlerOutOfContext }
