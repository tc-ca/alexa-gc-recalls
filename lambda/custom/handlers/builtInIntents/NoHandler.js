'use strict'

// Handlers
const CancelAndStopHandler = require('./CancelAndStopHandler')

// Enums
const SESSION_KEYS = require('../../Constants').sessionKeys
const QUESTION = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions

const NoIntentHandler = {
  canHandle (handlerInput) {
    console.log('no intent handler')
    console.log(handlerInput.requestEnvelope.request.intent.name)

    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    console.log('inside no intent')
    console.log('intent name: ', sessionAttributes[SESSION_KEYS.LogicRoutedIntentName])

    switch (sessionAttributes[SESSION_KEYS.LogicRoutedIntentName]) {
      case 'SearchForVehicleRecallIntent':
        const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]

        switch (vehicleConversation.followUpQuestionEnum) {
          case QUESTION.WouldYouLikeToHearTheNextRecall:

            return CancelAndStopHandler.handle(handlerInput)

          case QUESTION.WouldYouLikeToSearchForAnotherRecall:

            return CancelAndStopHandler.handle(handlerInput)

          default:
            break
        }
        break
      default:
        break
    }
  }
}

module.exports = NoIntentHandler
