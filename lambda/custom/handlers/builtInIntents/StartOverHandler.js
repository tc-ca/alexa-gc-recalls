'use strict'

const SESSION_KEYS = require('../../Constants').sessionKeys

const StartOverIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'AMAZON.StartOverIntent'


    const speechText = 'To start, let me know the make, model and year of your vehicle.'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(false)
      .getResponse()
  }
}

module.exports = StartOverIntentHandler
