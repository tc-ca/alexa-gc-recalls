'use strict'

const SESSION_KEYS = require('../../constants').SESSION_KEYS
const HANDLERS_STRING_NAMES = require('../../constants').HANDLERS_STRING_NAMES
const Trace = require('../../models/trace').Trace

const GlobalErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE')
    console.error('ERROR HANDLED', error)

    // console.log(`Error handled: ${error.message}`)
    // console.log(`Stack: ${error.stack}`)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

const CommandOutOfContextHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput

    const requestAttributes = attributesManager.getRequestAttributes()
    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT')

    const trace = new Trace(requestAttributes[SESSION_KEYS.HANDLER_TRACE])
    trace.location.push(HANDLERS_STRING_NAMES.START_OVER_INTENT_HANDLER)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

module.exports = { GlobalErrorHandler, CommandOutOfContextHandler }
