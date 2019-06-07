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
    const cardText = `${sanitizeHtml(speechText, sanitizeHtml(speechText, { allowedTags: [], allowedAttributes: {} }))} ${requestAttributes.t('SPEECH_TXT_VEHICLE_WELCOME_FOLLOW_UP_QUESTION')}`

    return handlerInput.responseBuilder
      .withSimpleCard(cardText)
      .addDelegateDirective({
        name: 'GetVehicleMakeAndModelIntent',
        confirmationStatus: 'NONE',
        slots: {}
      })
      .speak(speechText)
      .getResponse()
  }
}

module.exports = LaunchRequestHandler
