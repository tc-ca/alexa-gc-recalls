'use strict'

// TODO: Need a 'no' path for when ambigious model are presented to the user.

const Alexa = require('ask-sdk-core')
const loglessClient = require('logless-client')

const HANDLERS = {
  'LaunchRequest': require('./handlers/launchIntent/launchRequestHandler'),
  'SearchForVehicleRecall': require('./handlers/customIntents/searchForVehicleRecallHandler'),
  'Yes': require('./handlers/builtInIntents/yesHandler'),
  'No': require('./handlers/builtInIntents/noHandler'),
  'CancelAndStop': require('./handlers/builtInIntents/cancelAndStopHandler'),
  'Next': require('./handlers/builtInIntents/nextHandler'),
  'StartOver': require('./handlers/builtInIntents/startOverHandler'),
  'Help': require('./handlers/builtInIntents/helpHandler'),
  'Error': require('./handlers/builtInIntents/errorHandler'),
  'SessionEnded': require('./handlers/builtInIntents/sessionEndedHandler')
}

const INTERCEPTORS = {
  'Localization': require('./interceptors/localizationInterceptor'),
  'LogInterceptor': require('./interceptors/logInterceptor')
}

const skillBuilder = Alexa.SkillBuilders.custom()
exports.handler = loglessClient.Logless.capture('6423ca35-5b10-4448-bc0e-ca179bc10e60', skillBuilder
  .addRequestHandlers(
    HANDLERS.LaunchRequest,
    HANDLERS.SearchForVehicleRecall.AmbigiousHandler,
    HANDLERS.SearchForVehicleRecall.InProgress,
    HANDLERS.SearchForVehicleRecall.ComfirmedCompleted,
    HANDLERS.SearchForVehicleRecall.DeniedCompleted,
    HANDLERS.Next,
    HANDLERS.StartOver,
    HANDLERS.Help,
    HANDLERS.CancelAndStop,
    HANDLERS.SessionEnded,
    HANDLERS.Yes,
    HANDLERS.No
  )
  .addRequestInterceptors(INTERCEPTORS.Localization, INTERCEPTORS.LogInterceptor.RequestLog)
  .addResponseInterceptors(INTERCEPTORS.LogInterceptor.CurrentIntentLocationLog)
  .addErrorHandlers(HANDLERS.Error)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda())
