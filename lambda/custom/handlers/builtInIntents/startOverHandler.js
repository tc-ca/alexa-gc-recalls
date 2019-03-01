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
    const requestAttributes = attributesManager.getRequestAttributes()

    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'AMAZON.StartOverIntent'

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_TELL_ME_YOUR_MAKE')

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(false)
      .getResponse()
  }
}

module.exports = StartOverIntentHandler
