'use strict'

const VehicleRecallConversation = require('../../models/vehicleRecallConversation').VehicleRecallConversation

const HANDLERS = {
  VehicleRecallHandler: require('../customIntents/searchForVehicleRecallHandler'),
  StartNewSearchForRecallHandler: require('./startOverHandler'),
  ErrorHandler: require('../builtInIntents/errorHandler'),
  HelpHandler: require('../builtInIntents/helpHandler')

}

// CONSTANTS
const USER_ACTION = require('../../constants').USER_ACTION
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const FOLLOW_UP_QUESTION = require('../../constants').FOLLOW_UP_QUESTIONS

/**
 * Yes Handler acts like a controller and routes to approriate handler
 *
 * @param {*} handlerInput
 * @returns
 */
const YesIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    const vehicleConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    switch (sessionAttributes[SESSION_KEYS.CurrentIntentLocation]) {
      case 'LaunchRequest':
      return HANDLERS.StartNewSearchForRecallHandler.handle(
        handlerInput
      );
        break
      case 'SearchForVehicleRecallIntent':
        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.ARE_YOU_LOOKING_FOR_VEHICLE_X:
            return HANDLERS.VehicleRecallHandler.ComfirmedCompleted.handle(handlerInput)

          case FOLLOW_UP_QUESTION.WouldYouLikeToMeReadTheRecall:
            return HANDLERS.VehicleRecallHandler.ReadVehicleRecallDetails.handle(handlerInput)

          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.StartNewSearchForRecallHandler.handle(handlerInput)

          default:
            break
        }
        break
      case 'ReadVehicleRecallHandler':

        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.WouldYouLikeToHearTheNextRecall:
            return HANDLERS.VehicleRecallHandler.MoveToNextRecallHandler.handle(handlerInput)

          case FOLLOW_UP_QUESTION.WouldYouLikeTheRecallInformationRepeated:

            sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex] = 0
            return HANDLERS.VehicleRecallHandler.ReadVehicleRecallDetails.handle(handlerInput, USER_ACTION.RespondedYesToRepeatRecallInfo)

          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.StartNewSearchForRecallHandler.handle(handlerInput)

          default:
            break
        }
        break
      case 'DeniedCompletedSearchForVehicleRecallIntentHandler':
        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.StartNewSearchForRecallHandler.handle(handlerInput)
          case FOLLOW_UP_QUESTION.WOULD_YOU_LIKE_HELP:
            return HANDLERS.HelpHandler.GetHelpHandler.handle(handlerInput)
        }
        break
      case 'SearchForAnotherRecallHandler':
        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.StartNewSearchForRecallHandler.handle(handlerInput)
        }
        break
      case 'SearchAgainRecallHandler':
        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.WouldYouLikeToTryAndSearchAgain:
            return HANDLERS.StartNewSearchForRecallHandler.handle(handlerInput)
        }
        break
      default:
        return HANDLERS.ErrorHandler.CommandOutOfContextHandler.handle(handlerInput)
    }
  }
}

module.exports = YesIntentHandler
