'use strict'

// Handlers
const VehicleRecallHandler = require('../customIntents/SearchForVehicleRecallHandler')
const PhoneNumberHandler = require('../customIntents/PhoneNumberHandler')

const RestartSearchForRecallHandler = require('./StartOverHandler')
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
          case QUESTION.WouldYouLikeToHearTheNextRecall:

            // move to next recall in the array
            sessionAttributes[SESSION_KEYS.CurrentRecallIndex]++
            return VehicleRecallHandler.CompletedSearchForVehicleRecallIntentHandler.handle(handlerInput, USER_ACTION.RequestingNextRecallInfo)

          case QUESTION.WouldYouLikeToSearchForAnotherRecall:
            return RestartSearchForRecallHandler.handle(handlerInput)
          default:
            break
        }
        break
      case 'SelectRecallCategoryIntent':
        switch (convo.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToRecieveSMSMessage:
            convo.withUserAction = USER_ACTION.ResponsedYesToWantingToReceiveSMS
            sessionAttributes[SESSION_KEYS.Conversation] = convo

            return PhoneNumberHandler.handle(handlerInput, USER_ACTION.ResponsedYesToWantingToReceiveSMS)
        }
        break
      case 'SMSIntent':
        switch (convo.followUpQuestionEnum) {
          case QUESTION.IsYourPhoneNumberFiveFiveFiveBlahBlah:

            return PhoneNumberHandler.handle(handlerInput, USER_ACTION.ResponsedYesToCorrectPhoneNumberFoundOnAccount)
        }
        break
      default:
        break
    }
  }
}

module.exports = YesIntentHandler
