'use strict'

const HELPER = require('../../utils/helper')

const GlobalErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    const { attributesManager, requestEnvelope } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    const sessionId = requestEnvelope.session.sessionId

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE')
    const cardText = requestAttributes.t('CARD_TXT_VEHICLE_ERROR_CONTACT_HELP')
    const cardTitle = requestAttributes.t('CARD_TXT_VEHICLE_ERROR_CONTACT_HELP_TITLE')

    console.error('ERROR HANDLED', { sessionId: sessionId, error: error })

    HELPER.SetTrace({
      handlerName: 'GlobalErrorHandler',
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

const CommandOutOfContextHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput

    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT')

    HELPER.SetTrace({
      handlerName: 'CommandOutOfContextHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

module.exports = { GlobalErrorHandler, CommandOutOfContextHandler }
