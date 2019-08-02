'use strict'
const sanitizeHtml = require('sanitize-html')

const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput

    const requestAttributes = attributesManager.getRequestAttributes()

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_WELCOME_MSG')
    // show welcome speech on card
    const cardText = `${sanitizeHtml(speechText, sanitizeHtml(speechText, { allowedTags: [], allowedAttributes: {} }))} ${requestAttributes.t('CARD_TXT_VEHICLE_WELCOME_FOLLOW_UP_QUESTION')}`
    const cardTitle = requestAttributes.t('CARD_TXT_VEHICLE_WELCOME_TITLE')
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardTitle, cardText)
      .addDelegateDirective({
        name: 'GetVehicleMakeAndModelIntent',
        confirmationStatus: 'NONE',
        slots: {}
      })
      .getResponse()
  }
}

module.exports = LaunchRequestHandler
