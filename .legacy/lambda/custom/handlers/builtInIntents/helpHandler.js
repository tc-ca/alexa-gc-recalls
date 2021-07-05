'use strict'
const HELPER = require('../../utils/helper')

const HelpIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_HELP')

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const GetHelpHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_GET_HELP')
    const cardText = requestAttributes.t('CARD_TXT_VEHICLE_ERROR_CONTACT_HELP')
    const cardTitle = requestAttributes.t('CARD_TXT_VEHICLE_ERROR_CONTACT_HELP_TITLE')

    HELPER.SetTrace({
      handlerName: 'GetHelpHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(cardTitle, cardText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

module.exports = { HelpIntentHandler, GetHelpHandler }
