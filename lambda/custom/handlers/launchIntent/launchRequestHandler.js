'use strict'
const sanitizeHtml = require('sanitize-html')
const SESSION_KEYS = require('../../constants').SESSION_KEYS


const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput

    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_WELCOME_MSG')
    // show welcome speech on card
    const cardText = `${sanitizeHtml(speechText, sanitizeHtml(speechText, { allowedTags: [], allowedAttributes: {} }))}`
    const cardTitle = requestAttributes.t('CARD_TXT_VEHICLE_WELCOME_TITLE')
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'LaunchRequest'
    // store welcome text so we can repeat it. welcome text is dynamic reason why we need to store it versus get straight from resource
    sessionAttributes[SESSION_KEYS.LAUNCH_INTENT_SPEECH_TXT] = speechText

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardTitle, cardText)
      .withShouldEndSession(false)
      .getResponse();
  }
}

module.exports = LaunchRequestHandler
