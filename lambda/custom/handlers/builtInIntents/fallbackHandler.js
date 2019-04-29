'use strict'

const FallbackHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_UNEXPECTED_UTTERANCE')

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

module.exports = FallbackHandler
