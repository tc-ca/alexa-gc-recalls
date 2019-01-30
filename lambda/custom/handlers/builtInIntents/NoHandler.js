'use strict'
const Conversation = require('../../models/conversation')

const HANDLERS = {
  VehicleRecallHandler: require('../customIntents/SearchForVehicleRecallHandler'),
  PhoneNumberHandler: require('../customIntents/PhoneNumberHandler'),
  RestartSearchForRecallHandler: require('./StartOverHandler'),
  CancelAndStopHandler: require('./CancelAndStopHandler')
}
// Enums
const SESSION_KEYS = require('../../Constants').sessionKeys
const QUESTION = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions
const USER_ACTION = require('../../Constants').userAction

const NoIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    const convo = new Conversation(sessionAttributes[SESSION_KEYS.Conversation])
    const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]

    switch (sessionAttributes[SESSION_KEYS.LogicRoutedIntentName]) {
      case 'SelectRecallCategoryIntent':
        switch (convo.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToRecieveSMSMessage:

            convo.withUserAction = USER_ACTION.ResponsedNoToWantingToReceiveSMS
            sessionAttributes[SESSION_KEYS.Conversation] = convo

            return HANDLERS.PhoneNumberHandler.SMSHandler.handle(handlerInput, USER_ACTION.ResponsedNoToWantingToReceiveSMS)

          case QUESTION.WouldYouLikeToSearchForAnotherRecall:

            return HANDLERS.CancelAndStopHandler.handle(handlerInput)

          default:
            break
        }
        break
      case 'SearchForVehicleRecallIntent':

        switch (vehicleConversation.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToMeReadTheRecall:
            return HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)
          case QUESTION.WouldYouLikeToSearchForAnotherRecall:

            return HANDLERS.CancelAndStopHandler.handle(handlerInput)

          default:
            break
        }
        break
      case 'ReadVehicleRecallHandler':

        switch (vehicleConversation.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToHearTheNextRecall:

            return HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)

          case QUESTION.WouldYouLikeTheRecallInformationRepeated:
            sessionAttributes[SESSION_KEYS.CurrentRecallIndex] = 0
            return HANDLERS.VehicleRecallHandler.ReadVehicleRecallDetails.handle(handlerInput, USER_ACTION.RespondedYesToRepeatRecallInfo)

          case QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.RestartSearchForRecallHandler.handle(handlerInput)
          default:
            break
        }
        break
      case 'DeniedCompletedSearchForVehicleRecallIntentHandler':
        return HANDLERS.CancelAndStopHandler.handle(handlerInput)
      case 'SMSIntent':
        switch (convo.followUpQuestionEnum) {
          case QUESTION.IsYourPhoneNumberFiveFiveFiveBlahBlah:

            return HANDLERS.PhoneNumberHandler.SMSHandler.handle(handlerInput, USER_ACTION.ResponsedNoToCorrectPhoneNumberFoundOnAccount)
        }
        break
      case 'GetSearchForAnotherRecallQuestionHandler':
        switch (vehicleConversation.followUpQuestionEnum) {
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
