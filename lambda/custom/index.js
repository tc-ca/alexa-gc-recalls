'use strict'

// TODO: Need a 'no' path for when ambigious model are presented to the user.

// TODO: document,

const Alexa = require('ask-sdk-core')
const loglessClient = require('logless-client')

const HANDLERS = {
  LaunchRequest: require('./handlers/launchIntent/launchRequestHandler'),
  SearchForVehicleRecall: require('./handlers/customIntents/searchForVehicleRecallHandler'),
  Yes: require('./handlers/builtInIntents/yesHandler'),
  No: require('./handlers/builtInIntents/noHandler'),
  CancelAndStop: require('./handlers/builtInIntents/cancelAndStopHandler'),
  Next: require('./handlers/builtInIntents/nextHandler'),
  Previous: require('./handlers/builtInIntents/previousHandler'),
  StartOver: require('./handlers/builtInIntents/startOverHandler'),
  Help: require('./handlers/builtInIntents/helpHandler'),
  Error: require('./handlers/builtInIntents/errorHandler'),
  SessionEnded: require('./handlers/builtInIntents/sessionEndedHandler'),
  Fallback: require('./handlers/builtInIntents/fallbackHandler'),
  repeat: require('./handlers/builtInIntents/repeatHandler'),
  getVehicleMakeAndModel: require('./handlers/customIntents/getVehicleMakeAndModelHandler'),
  getVehicleYear: require('./handlers/customIntents/getVehicleYearHandler'),
  getvehicleModel: require('./handlers/customIntents/getVehicleModelHandler'),
  getVehicleMake: require('./handlers/customIntents/getVehicleMakeHandler'),
  getBMWModel: require('./handlers/customIntents/getBMWModelHandler')

}

const INTERCEPTORS = {
  Localization: require('./interceptors/localizationInterceptor'),
  LogInterceptor: require('./interceptors/logInterceptor'),
  InitializationInterceptor: require('./interceptors/initializationInterceptor')

}

const skillBuilder = Alexa.SkillBuilders.custom()
exports.handler = skillBuilder
  .addRequestHandlers(
    HANDLERS.LaunchRequest,
    HANDLERS.getVehicleMakeAndModel.Completed,
    HANDLERS.getVehicleMakeAndModel.InProgress,
    HANDLERS.getVehicleYear.InProgress,
    HANDLERS.getVehicleYear.CompletedNotCompleted,
    HANDLERS.getVehicleYear.Completed,
    HANDLERS.getvehicleModel.ResolveAmbigiousVehicleModel,
    HANDLERS.getvehicleModel.Inprogress,
    HANDLERS.getVehicleMake.InProgressGetMakeFirstThenModel,
    HANDLERS.getVehicleMake.CompletedGetMakeFirstThenModel,
    HANDLERS.getBMWModel.InProgress,
    HANDLERS.Next.handler,
    HANDLERS.Next.outOfContextHandler,
    HANDLERS.Previous.handler,
    HANDLERS.Previous.outOfContextHandler,
    HANDLERS.repeat.handler,
    HANDLERS.repeat.outOfContextHandler,
    HANDLERS.StartOver,
    HANDLERS.Help.HelpIntentHandler,
    HANDLERS.CancelAndStop,
    HANDLERS.SessionEnded,
    HANDLERS.Yes,
    HANDLERS.No,
    HANDLERS.Fallback

  )
  .addRequestInterceptors(
    INTERCEPTORS.Localization,
    INTERCEPTORS.LogInterceptor.LogRequest,
    INTERCEPTORS.InitializationInterceptor)
  .addResponseInterceptors(
    INTERCEPTORS.LogInterceptor.LogResponse)
  .addErrorHandlers(HANDLERS.Error.GlobalErrorHandler)
  .withApiClient(new Alexa.DefaultApiClient())
  .lambda()
