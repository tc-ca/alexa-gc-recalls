'use strict'

// Handlers
const VehicleRecallHandler = require('../customIntents/SearchForVehicleRecallHandler')

const USER_ACTION = require('../../Constants').userAction
const SESSION_KEYS = require('../../Constants').sessionKeys
const QUESTION = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions
const HELPER = require('../../utils/Helper')

const ResolveAmbiguousModelIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'ResolveAmbiguousModelIntent'
  },
  handle (handlerInput) {
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]

    switch (sessionAttributes[SESSION_KEYS.LogicRoutedIntentName]) {
      case 'SearchForVehicleRecallIntent':
        switch (vehicleConversation.followUpQuestionEnum) {
          case QUESTION.ProvideComfirmationOfAmbiguousModel:

            // model was missing from the conversation exchange.
            vehicleConversation.model = slotValues.VehicleModelType.resolved
            sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleConversation
            // set for testing purposes only when unit testing YML configuration
            sessionAttributes[SESSION_KEYS.UserActionPerformed] = USER_ACTION.ResolvingAmbiguousModel

            return VehicleRecallHandler.CompletedSearchForVehicleRecallIntentHandler.handle(handlerInput, USER_ACTION.ResolvingAmbiguousModel)
        }
        break
      default:
        break
    }
  }
}

module.exports = ResolveAmbiguousModelIntentHandler
