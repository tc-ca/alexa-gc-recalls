'use strict'
const conversationService = require('../../services/conversationService')

const HELPER = require('../../utils/Helper')
const SESSION_KEYS = require('../../Constants').sessionKeys
const FOLLOW_UP_QUESTIONS = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions

const SelectRecallCategoryHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SelectRecallCategoryIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Get the selected recall category from slot input.
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    const convoObj = conversationService.GetConversationObj()
      .withFollowUpQuestion(FOLLOW_UP_QUESTIONS.WouldYouLikeToRecieveSMSMessage)

    let speechText = requestAttributes.t('WOULD_YOU_LIKE_TO_RECIEVE_TXT_MSG_ON_PHONE').replace('%RecallCategory%', slotValues.RecallCategory.resolved)

    sessionAttributes[SESSION_KEYS.Conversation] = convoObj
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'SelectRecallCategoryIntent'

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
      .reprompt(speechText)
    // .withSimpleCard('Canadian Safety Recalls', 'Would you like to get the recall information by text on your phone?')
      .getResponse()
  }
}

module.exports = SelectRecallCategoryHandler
