'use strict'

const HANDLERS = {
  VehicleRecallHandler: require('../customIntents/searchForVehicleRecallHandler'),
  RestartSearchForRecallHandler: require('./StartOverHandler')
}

// CONSTANTS
const USER_ACTION = require('../../constants').userAction
const SESSION_KEYS = require('../../constants').sessionKeys
const FOLLOW_UP_QUESTION = require('../../constants').FollowUpQuestions

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

    // TODO: make vehicle convo into own class
    const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]
    switch (sessionAttributes[SESSION_KEYS.CurrentIntentLocation]) {
      case 'SearchForVehicleRecallIntent':
        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.WouldYouLikeToMeReadTheRecall:

            return HANDLERS.VehicleRecallHandler.ReadVehicleRecallDetails.handle(handlerInput)

          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:

            return HANDLERS.RestartSearchForRecallHandler.handle(handlerInput)

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
            return HANDLERS.RestartSearchForRecallHandler.handle(handlerInput)
          default:
            break
        }
        break
      case 'DeniedCompletedSearchForVehicleRecallIntentHandler':
        return HANDLERS.VehicleRecallHandler.SearchForNewVehicleRecallHandler.handle(handlerInput)

      case 'GetSearchForAnotherRecallQuestionHandler':
        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.VehicleRecallHandler.SearchForNewVehicleRecallHandler.handle(handlerInput)
        }
        break
      default:
        break
    }
  }
}

module.exports = YesIntentHandler
