const HELPER = require('../../utils/Helper')
// Enums
const USER_ACTION = require('../../Constants').userAction
const SESSION_KEYS = require('../../Constants').sessionKeys
const Conversation = require('../../models/conversation')
const QUESTION = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions

const ComfirmedCompletedGetPhoneNumberIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'GetPhoneNumberIntent' &&
        handlerInput.requestEnvelope.request.dialogState === 'COMPLETED' &&
        handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)
    const convoObj = new Conversation(sessionAttributes[SESSION_KEYS.Conversation])

    console.log('ainskey',convoObj)
    // TODO: Validate phone number
    convoObj.withManuallyProvidedPhoneNumber(slotValues.userPhoneNumber)
    const speechText = requestAttributes.t('TELL_ME_YOUR_MAKE')

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const DeniedCompletedGetPhoneNumberIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'GetPhoneNumberIntent' &&
        handlerInput.requestEnvelope.request.dialogState === 'COMPLETED' &&
        handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)
    const convoObj = new Conversation(sessionAttributes[SESSION_KEYS.Conversation])

    convoObj.withManuallyProvidedPhoneNumber(slotValues.userPhoneNumber)
    const speechText = requestAttributes.t('TELL_ME_YOUR_PHONE_NUMBER')
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

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
        convoObj.sendSMS = true
        speechText = requestAttributes.t('IS_YOUR_PHONE_NUMBER_1_XXX_XXX_XXXX').replace('%PhoneNumber%', '555-555-8959')

        break
      case USER_ACTION.ResponsedNoToWantingToReceiveSMS:
        convoObj.sendSMS = false
        speechText = requestAttributes.t('TELL_ME_YOUR_MAKE')

        break
      case USER_ACTION.ResponsedNoToCorrectPhoneNumberFoundOnAccount:
        speechText = requestAttributes.t('TELL_ME_YOUR_PHONE_NUMBER')

        break
      case USER_ACTION.ResponsedYesToCorrectPhoneNumberFoundOnAccount:
        speechText = requestAttributes.t('TELL_ME_YOUR_MAKE')
        break
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

module.exports = { SMSHandler, ComfirmedCompletedGetPhoneNumberIntentHandler, DeniedCompletedGetPhoneNumberIntentHandler }
