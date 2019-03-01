'use strict'

// Handlers
const HANDLERS = {
  VehicleRecallHandler: require('../customIntents/searchForVehicleRecallHandler'),
  ErrorHandler: require('../builtInIntents/errorHandler')
}

/**
 * When called, moves listener to next recall in array of recalls.
 * @param {*} handlerInput
 * @returns
 */
const NextIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent' &&
        handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation &&
        handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation === 'ReadVehicleRecallHandler'
  },
  handle (handlerInput) {
    return HANDLERS.VehicleRecallHandler.MoveToNextRecallHandler.handle(handlerInput)
  }
}

/**
 * Executed when next intent is called out of context. i.e. user not in recall read portion of script.
 * @param {*} handlerInput
 * @returns
 */
const NextIntentHandlerOutOfContext = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent' &&
        handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation &&
        handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation !== 'ReadVehicleRecallHandler'
  },
  handle (handlerInput) {
    return HANDLERS.ErrorHandler.CommandOutOfContextHandler.handle(handlerInput)
  }
}

module.exports = { NextIntentHandler, NextIntentHandlerOutOfContext }
