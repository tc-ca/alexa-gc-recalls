'use strict'

const FallbackHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_FALLBACK_INTENT')
    const cardText = requestAttributes.t('CARD_TXT_VEHICLE_ERROR_CONTACT_HELP')
    const cardTitle = requestAttributes.t('CARD_TXT_VEHICLE_ERROR_CONTACT_HELP_TITLE')

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardTitle, cardText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

module.exports = FallbackHandler
