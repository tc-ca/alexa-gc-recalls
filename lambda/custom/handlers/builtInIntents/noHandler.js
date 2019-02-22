'use strict'

const HANDLERS = {
  VehicleRecallHandler: require('../customIntents/searchForVehicleRecallHandler'),
  RestartSearchForRecallHandler: require('./startOverHandler'),
  CancelAndStopHandler: require('./cancelAndStopHandler')
}
// Enums
const SESSION_KEYS = require('../../constants').sessionKeys
const QUESTION = require('../../constants').FollowUpQuestions

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
          case QUESTION.WouldYouLikeToMeReadTheRecall:
            return HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)
          case QUESTION.WouldYouLikeToSearchForAnotherRecall:

            return HANDLERS.CancelAndStopHandler.handle(handlerInput)

          default:
            break
        }
        break
      case 'ReadVehicleRecallHandler':

        switch (vehicleConversation.followUpQuestionCode) {
          case QUESTION.WouldYouLikeToHearTheNextRecall:

            return HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)

          case QUESTION.WouldYouLikeTheRecallInformationRepeated:
            return HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)

          case QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.RestartSearchForRecallHandler.handle(handlerInput)
          default:
            break
        }
        break
      case 'DeniedCompletedSearchForVehicleRecallIntentHandler':
        return HANDLERS.CancelAndStopHandler.handle(handlerInput)
      case 'GetSearchForAnotherRecallQuestionHandler':
        switch (vehicleConversation.followUpQuestionCode) {
          case QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.CancelAndStopHandler.handle(handlerInput)
        }
        break
      default:
        break
    }
  }
}

module.exports = NoIntentHandler
