'use strict'

// DONE: Need a 'no' path for when ambigious model are presented to the user.

// TODO: add unit test to check date format

// TODO: add unit test to check validation on year is expcted.

// TODO: add unit test check for correct foolow question for ambigious sentence

// TODO: create unit test in French

// DONE: update models

// DONE: ensure cards are only showing where they should be

// DONE: test what happends when you say at the ambigous

// TODO: add test for cards

// DONE: check links in french and english text msg

// DONE: re-generate api key and place on lambda

// TODO: add test to lambda to check api key connects to api

// TODO: connect to bespoken for testing later.

// TODO: when no text msg, need to re-work string

// TODO: null bmw 323 french needs to be fixed.

// TODO: add condition on getting phone number

const Alexa = require('ask-sdk-core')
require('dotenv').config()
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
    HANDLERS.getVehicleYear.CompletedNotCompletedMakeMissing,
    HANDLERS.getVehicleYear.Completed,
    HANDLERS.getvehicleModel.ResolveAmbigiousVehicleModel,
    HANDLERS.getvehicleModel.Inprogress,
    HANDLERS.getVehicleMake.InProgressGetMakeFirstThenModel,
    HANDLERS.getVehicleMake.CompletedGetMakeFirstThenModel,
    HANDLERS.getBMWModel.InProgress,
    HANDLERS.Next.outOfContextHandler,
    HANDLERS.Next.handler,
    HANDLERS.Previous.outOfContextHandler,
    HANDLERS.Previous.handler,
    HANDLERS.repeat.outOfContextHandler,
    HANDLERS.repeat.forReadVehicleRecall,
    HANDLERS.repeat.forLaunchIntent,
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
