'use strict'

// Handlers
const SearchForVehicleRecallIntentHandler = require('../customIntent/SearchForVehicleRecallHandler')
// Enums
const USER_ACTION = require('../../Constants').userAction
const SESSION_KEYS = require('../../Constants').sessionKeys

const NextIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    sessionAttributes[SESSION_KEYS.CurrentRecallIndex]++
    // set for testing purposes only when unit testing YML configuration
    sessionAttributes[SESSION_KEYS.UserActionPerformed] = USER_ACTION.USER_ACTION.USER_ACTION.InitiatedSkip

    return SearchForVehicleRecallIntentHandler.CompletedSearchForVehicleRecallIntentHandler.handle(handlerInput, USER_ACTION.InitiatedSkip)
  }
}

module.exports = NextIntentHandler
