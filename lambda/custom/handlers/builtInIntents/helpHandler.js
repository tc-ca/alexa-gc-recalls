'use strict'
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const HANDLERS_STRING_NAMES = require('../../constants').HANDLERS_STRING_NAMES
const Trace = require('../../models/trace').Trace

const HelpIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle (handlerInput) {
    const speechText = 'You can say hello to me!'

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
    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_GET_HELP')

    const trace = new Trace(requestAttributes[SESSION_KEYS.HANDLER_TRACE])
    trace.location.push(HANDLERS_STRING_NAMES.GET_HELP_HANDLER)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

module.exports = { HelpIntentHandler, GetHelpHandler }
