/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core')
const loglessClient = require('logless-client')

const LaunchRequestHandler = require('./handlers/builtInIntents/LaunchRequestHandler')
const SearchForVehicleRecallIntentHandler = require('./handlers/customIntent/SearchForVehicleRecallHandler')
const NextIntentHandler = require('./handlers/builtInIntents/NextHandler')
const YesIntentHandler = require('./handlers/builtInIntents/YesHandler')
const NoIntentHandler = require('./handlers/builtInIntents/NoHandler')
const CancelAndStopIntentHandler = require('./handlers/builtInIntents/CancelAndStopHandler')
const StartOverHandler = require('./handlers/builtInIntents/StartOverHandler')
const ResolveAmbiguousModelIntentHandler = require('./handlers/customIntent/ResolveAmbiguousModelHandler')
const testInterceptor = require('./interceptors/SetIntentSession')


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
      .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const SessionEndedRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle (handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`)

    return handlerInput.responseBuilder.getResponse()
  }
}

const ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse()
  }
}

const skillBuilder = Alexa.SkillBuilders.custom()
console.log('capture: 6423ca35-5b10-4448-bc0e-ca179bc10e60')
exports.handler = loglessClient.Logless.capture('6423ca35-5b10-4448-bc0e-ca179bc10e60', skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    SearchForVehicleRecallIntentHandler.InProgressSearchForVehicleRecallIntentHandler,
    SearchForVehicleRecallIntentHandler.CompletedSearchForVehicleRecallIntentHandler,
    ResolveAmbiguousModelIntentHandler,
    NextIntentHandler,
    StartOverHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    YesIntentHandler,
    NoIntentHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda())
