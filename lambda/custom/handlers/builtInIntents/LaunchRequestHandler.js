'use strict'

const WELCOME_MESSAGE_SPEECH = 'Welcome to Transport Canada Vehicle Recalls. I\'ll help you find out if your vehicle has any recalls. To start, let me know the make, model and year of your vehicle'
const WELCOME_MESSAGE_CARD = 'Welcome to Transport Canada Vehicle Recalls'

const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle (handlerInput) {
    const speechText = WELCOME_MESSAGE_SPEECH

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(WELCOME_MESSAGE_CARD, speechText)
      .getResponse()
  }
}

module.exports = LaunchRequestHandler
