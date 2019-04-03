'use strict'

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

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

module.exports = { HelpIntentHandler, GetHelpHandler }
