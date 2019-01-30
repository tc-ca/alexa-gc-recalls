'use strict'

const HANDLERS = {
  VehicleRecallHandler: require('../customIntents/SearchForVehicleRecallHandler'),
  PhoneNumberHandler: require('../customIntents/PhoneNumberHandler'),
  RestartSearchForRecallHandler: require('./StartOverHandler')
}

const Conversation = require('../../models/conversation')

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

    const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]
    const convo = new Conversation(sessionAttributes[SESSION_KEYS.Conversation])

    switch (sessionAttributes[SESSION_KEYS.LogicRoutedIntentName]) {
      case 'SearchForVehicleRecallIntent':
        switch (vehicleConversation.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToMeReadTheRecall:

            return HANDLERS.VehicleRecallHandler.ReadVehicleRecallDetails.handle(handlerInput)

          case QUESTION.WouldYouLikeToSearchForAnotherRecall:

            return HANDLERS.RestartSearchForRecallHandler.handle(handlerInput)

          default:
            break
        }
        break
      case 'ReadVehicleRecallHandler':

        switch (vehicleConversation.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToHearTheNextRecall:

            return HANDLERS.SearchForVehicleRecallIntentHandler.MoveToNextRecallHandler(handlerInput)

          case QUESTION.WouldYouLikeTheRecallInformationRepeated:
            sessionAttributes[SESSION_KEYS.CurrentRecallIndex] = 0
            return HANDLERS.VehicleRecallHandler.ReadVehicleRecallDetails.handle(handlerInput, USER_ACTION.RespondedYesToRepeatRecallInfo)

          case QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.RestartSearchForRecallHandler.handle(handlerInput)
          default:
            break
        }
        break
      case 'SelectRecallCategoryIntent':
        switch (convo.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToRecieveSMSMessage:
            convo.withUserAction = USER_ACTION.ResponsedYesToWantingToReceiveSMS
            sessionAttributes[SESSION_KEYS.Conversation] = convo

            return HANDLERS.PhoneNumberHandler.SMSHandler.handle(handlerInput, USER_ACTION.ResponsedYesToWantingToReceiveSMS)
        }
        break
      case 'SMSIntent':
        switch (convo.followUpQuestionEnum) {
          case QUESTION.IsYourPhoneNumberFiveFiveFiveBlahBlah:

            return HANDLERS.PhoneNumberHandler.SMSHandler.handle(handlerInput, USER_ACTION.ResponsedYesToCorrectPhoneNumberFoundOnAccount)
        }
        break
      case 'DeniedCompletedSearchForVehicleRecallIntentHandler':
        return HANDLERS.VehicleRecallHandler.SearchForNewVehicleRecallHandler.handle(handlerInput)

      case 'GetSearchForAnotherRecallQuestionHandler':
        switch (vehicleConversation.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return HANDLERS.VehicleRecallHandler.SearchForNewVehicleRecallHandler.handle(handlerInput)
        }
        break
      default:
        break
    }
  }
}

module.exports = YesIntentHandler
