'use strict'

const HELPER = require('../../utils/helper')

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

    HELPER.SetTrace({
      handlerName: 'CancelAndStopIntentHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })
    const speechText = requestAttributes.t('SPEECH_TXT_VEHCILE_RECALLS_GOODBYE')

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

module.exports = CancelAndStopIntentHandler
