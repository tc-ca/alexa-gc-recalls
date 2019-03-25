'use strict'

const Vehicle = require('../../models/vehicleConversation')
const CONVERSATION_CONTEXT = require('../../constants').VEHICLE_CONVERSATION_CONTEXT

const SESSION_KEYS = require('../../constants').SESSION_KEYS

const comfirmVehicleMakeModelYearHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    const make = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_MAKE])
    const model = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_MODEL])
    const year = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_YEAR])

    const vehicle = new Vehicle.Vehicle({ make: make, model: model, year: year })

    const VehicleRecallConversation = new Vehicle.ConversationContextBuilder({ vehicle: vehicle, requestAttributes: requestAttributes })
      .askFollowUpQuestion({ convoContext: CONVERSATION_CONTEXT.ComfirmingMakeModelYear })
      .build()

    let speechText = VehicleRecallConversation.speech()

    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConversation
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    // .withSimpleCard('Canadian Safety Recalls') // TODO: should we keep this simple card?
      .withShouldEndSession(false)
      .getResponse()
  }
}

module.exports = { comfirmVehicleMakeModelYearHandler }
