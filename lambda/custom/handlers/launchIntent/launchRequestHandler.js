'use strict'
const SESSION_KEYS = require('../../constants').SESSION_KEYS

const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput

    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()
    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT] = 1
    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_WELCOME_MSG')

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Canadian Safety Recalls')
      .getResponse()
  }
}

module.exports = LaunchRequestHandler
