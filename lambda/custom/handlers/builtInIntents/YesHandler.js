'use strict'

// Handlers
const VehicleRecallHandler = require('../customIntent/SearchForVehicleRecallHandler')
const RestartSearchForRecallHandler = require('./StartOverHandler')

// Enums
const USER_ACTION = require('../../Constants').userAction
const SESSION_KEYS = require('../../Constants').sessionKeys
const QUESTION = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions

const YesIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    switch (sessionAttributes[SESSION_KEYS.LogicRoutedIntentName]) {
      case 'SearchForVehicleRecallIntent':

        const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]
        switch (vehicleConversation.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToHearTheNextRecall:

            // set for testing purposes only when unit testing YML configuration
            // sessionAttributes[SESSION_KEYS.UserActionPerformed] = USER_ACTION.USER_ACTION.RequestingNextRecallInfo

            // move to next recall in the array
            sessionAttributes[SESSION_KEYS.CurrentRecallIndex]++
            return VehicleRecallHandler.CompletedSearchForVehicleRecallIntentHandler.handle(handlerInput, USER_ACTION.RequestingNextRecallInfo)

          case QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return RestartSearchForRecallHandler.handle(handlerInput)
          default:
            break
        }
        break
      default:
        break
    }
  }
}

module.exports = YesIntentHandler
