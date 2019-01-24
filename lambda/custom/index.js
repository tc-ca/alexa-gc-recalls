'use strict'

const Alexa = require('ask-sdk-core')
const loglessClient = require('logless-client')

const HANDLERS = {
  'LaunchRequest': require('./handlers/launchIntent/LaunchRequestHandler'),
  'SearchForVehicleRecall': require('./handlers/customIntents/SearchForVehicleRecallHandler'),
  'Yes': require('./handlers/builtInIntents/YesHandler'),
  'No': require('./handlers/builtInIntents/NoHandler'),
  'CancelAndStop': require('./handlers/builtInIntents/CancelAndStopHandler'),
  'ResolveAmbigious': require('./handlers/customIntents/ResolveAmbiguousModelHandler'),
  'SelectRecallCategory': require('./handlers/customIntents/SelectRecallCategoryHandler'),
  'Next': require('./handlers/builtInIntents/NextHandler'),
  'StartOver': require('./handlers/builtInIntents/StartOverHandler'),
  'Help': require('./handlers/builtInIntents/HelpHandler'),
  'Error': require('./handlers/builtInIntents/ErrorHandler'),
  'SessionEnded': require('./handlers/builtInIntents/SessionEndedHandler')

}

const INTERCEPTORS = {
  'Localization': require('./interceptors/LocalizationInterceptor')

}

const skillBuilder = Alexa.SkillBuilders.custom()
console.log('capture: 6423ca35-5b10-4448-bc0e-ca179bc10e60')
exports.handler = loglessClient.Logless.capture('6423ca35-5b10-4448-bc0e-ca179bc10e60', skillBuilder
  .addRequestHandlers(
    HANDLERS.LaunchRequest,
    HANDLERS.SelectRecallCategory,
    HANDLERS.SearchForVehicleRecall.InProgressSearchForVehicleRecallIntentHandler,
    HANDLERS.SearchForVehicleRecall.CompletedSearchForVehicleRecallIntentHandler,
    HANDLERS.ResolveAmbigious,
    HANDLERS.Next,
    HANDLERS.StartOver,
    HANDLERS.Help,
    HANDLERS.CancelAndStop,
    HANDLERS.SessionEnded,
    HANDLERS.Yes,
    HANDLERS.No
  )
  .addRequestInterceptors(INTERCEPTORS.Localization) 
  .addErrorHandlers(HANDLERS.Error)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda())
