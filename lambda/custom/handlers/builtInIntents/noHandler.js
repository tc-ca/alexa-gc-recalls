'use strict'

const HANDLERS = {
  VehicleRecallHandler: require('../customIntents/searchForVehicleRecallHandler'),
  RestartSearchForRecallHandler: require('./startOverHandler'),
  CancelAndStopHandler: require('./cancelAndStopHandler'),
  ErrorHandler: require('../builtInIntents/errorHandler')

}

const SESSION_KEYS = require('../../constants').SESSION_KEYS
const FOLLOW_UP_QUESTION = require('../../constants').FOLLOW_UP_QUESTIONS

const NoIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]

    switch (sessionAttributes[SESSION_KEYS.CurrentIntentLocation]) {
      case 'SearchForVehicleRecallIntent':

        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.ARE_YOU_LOOKING_FOR_VEHICLE_X:
            return HANDLERS.VehicleRecallHandler.DeniedCompleted.handle(handlerInput)

          case FOLLOW_UP_QUESTION.WouldYouLikeToMeReadTheRecall:
            return HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)

          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.CancelAndStopHandler.handle(handlerInput)

          default:
            break
        }
        break
      case 'ReadVehicleRecallHandler':
        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.WouldYouLikeToHearTheNextRecall:
            return HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)

          case FOLLOW_UP_QUESTION.WouldYouLikeTheRecallInformationRepeated:
            return HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)

          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.RestartSearchForRecallHandler.handle(handlerInput)

          default:
            break
        }
        break
      case 'DeniedCompletedSearchForVehicleRecallIntentHandler':
        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.CancelAndStopHandler.handle(handlerInput)
          case FOLLOW_UP_QUESTION.WOULD_YOU_LIKE_HELP:
            HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)
        }
        break
      case 'GetSearchForAnotherRecallQuestionHandler':
        switch (vehicleConversation.followUpQuestionCode) {
          case FOLLOW_UP_QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.CancelAndStopHandler.handle(handlerInput)
        }
        break
      default:
        return HANDLERS.ERROR_HANDLER.CommandOutOfContextHandler.handle(handlerInput)
    }
  }
}

module.exports = NoIntentHandler
