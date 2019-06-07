'use strict'

// Handlers
const HANDLERS = {
  VehicleRecallHandler: require('../customIntents/searchForVehicleRecallHandler'),
  ErrorHandler: require('../builtInIntents/errorHandler')
}

const SESSION_KEYS = require('../../constants').SESSION_KEYS
const VehicleRecallConversation = require('../../models/vehicleRecallConversation').VehicleRecallConversation

const RepeatHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent' &&
          handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation &&
          handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation === 'ReadVehicleRecallHandler' &&
          handlerInput.requestEnvelope.session.attributes.VehicleConversation &&
          handlerInput.requestEnvelope.session.attributes.VehicleConversation.speechString.length > 0
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    // get session variables.
    const vehicleRecallConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])
    const speechText = vehicleRecallConversation.speechString.join(' ')

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const RepeatOutOfContextHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent' &&
          handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation &&
          handlerInput.requestEnvelope.session.attributes.CurrentIntentLocation !== 'ReadVehicleRecallHandler'
  },
  handle (handlerInput) {
    return HANDLERS.ErrorHandler.CommandOutOfContextHandler.handle(handlerInput)
  }
}

module.exports = { handler: RepeatHandler, outOfContextHandler: RepeatOutOfContextHandler }
