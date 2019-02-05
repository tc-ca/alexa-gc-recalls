'use strict'

const SESSION_KEYS = require('../../Constants').sessionKeys

const CancelAndStopIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'AMAZON.CancelIntent'

    const speechText = requestAttributes.t('VEHCILE_RECALLS_GOODBYE_MSG')

    return handlerInput.responseBuilder
      .speak(speechText)
      // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

module.exports = CancelAndStopIntentHandler
