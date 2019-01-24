// Enums
const USER_ACTION = require('../../Constants').userAction
const SESSION_KEYS = require('../../Constants').sessionKeys
const Conversation = require('../../models/conversation')
const VehicleRecallHandler = require('../customIntents/SearchForVehicleRecallHandler')
const QUESTION = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions

const SMSHandler = {
  handle (handlerInput, userAction) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'SMSIntent'
    const convoObj = new Conversation(sessionAttributes[SESSION_KEYS.Conversation])
    let speechText

    switch (userAction) {
      case USER_ACTION.ResponsedYesToWantingToReceiveSMS:
        convoObj.followUpQuestionEnum = QUESTION.IsYourPhoneNumberFiveFiveFiveBlahBlah
        speechText = requestAttributes.t('IS_YOUR_PHONE_NUMBER_1_XXX_XXX_XXXX').replace('%PhoneNumber%', '555-555-8959')

        break
      case USER_ACTION.ResponsedYesToCorrectPhoneNumberFoundOnAccount:

        // handlerInput.requestEnvelope.request.intent.name = 'SearchForVehicleRecallIntent'

        // route to main search handler, InProgress handler should prompt for collection of slot values.
        return VehicleRecallHandler.InProgressSearchForVehicleRecallIntentHandler.handle(handlerInput)
      default:
        break
    }

    sessionAttributes[SESSION_KEYS.Conversation] = convoObj

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

module.exports = SMSHandler
