'use strict'

const VehicleConversation = require('../../models/vehicleRecallConversation')
const Vehicle = require('../../models/vehicle')

const CONVERSATION_CONTEXT = require('../../constants').VEHICLE_CONVERSATION_CONTEXT

const SESSION_KEYS = require('../../constants').SESSION_KEYS

const comfirmVehicleMakeModelYearHandler = {
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    const make = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_MAKE])
    const model = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_MODEL])
    const year = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_YEAR])

    const vehicle = new Vehicle.Vehicle({ make: make, model: model, year: year })

    const VehicleRecallConversation = new VehicleConversation.ConversationContextBuilder({ vehicle: vehicle, requestAttributes: requestAttributes })
      .askFollowUpQuestion({ convoContext: CONVERSATION_CONTEXT.ComfirmingMakeModelYear })
      .buildSpeech()

    const speechText = VehicleRecallConversation.getSpeechText()

    const simepleCard = requestAttributes.t(`SPEECH_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR`)
      .replace('%VehicleRecallYear%', year.slotValue)
      .replace('%VehicleRecallMake%', make.slotValue)
      .replace('%VehicleRecallModel%', model.slotValue)

    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConversation
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(simepleCard) // TODO: should we keep this simple card?
      .withShouldEndSession(false)
      .getResponse()
  }
}

module.exports = { comfirmVehicleMakeModelYearHandler }
