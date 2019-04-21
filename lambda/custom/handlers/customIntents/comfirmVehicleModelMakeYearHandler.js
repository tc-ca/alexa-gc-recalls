'use strict'

const VehicleConversation = require('../../models/vehicleRecallConversation')
const Vehicle = require('../../models/vehicle')

const CONVERSATION_CONTEXT = require('../../constants').VEHICLE_CONVERSATION_CONTEXT

const SESSION_KEYS = require('../../constants').SESSION_KEYS
const VEHICLE_MAZDA_MODEL_SPEECH_CORRECTION = require('../../constants').VEHICLE_MAZDA_MODEL_SPEECH_CORRECTION

const comfirmVehicleMakeModelYearHandler = {
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    const make = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_MAKE])
    const model = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_MODEL])
    const year = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_YEAR])

    // special case
    // change the way the model is pronounced back to the user.
    // strategy, we use the slot value in the interaction model as the designated speech output
    // in the case of the make Mazda the make name is repeated in the model i.e. Mazda 3
    // the idea of just having the value '3' in the slot value was tried but Alexa engine had trouble selecting and filling the correct slot values.
    // therefore do some clean up codewise.
    switch (make.slotId) {
      case 'MAZDA':
        model.slotValue = VEHICLE_MAZDA_MODEL_SPEECH_CORRECTION[model.slotId.replace(' ', '-').replace('-', '$').toUpperCase()]
        break
    }

    const vehicle = new Vehicle.Vehicle({ make: make, model: model, year: year })

    const VehicleRecallConversation = new VehicleConversation.ConversationContextBuilder({ vehicle: vehicle, requestAttributes: requestAttributes })
      .askFollowUpQuestion({ convoContext: CONVERSATION_CONTEXT.ComfirmingMakeModelYear })
      .buildSpeech()

    const speechText = VehicleRecallConversation.getSpeechText()

    const cardTitle = requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_QUERY_YEAR_TITLE`)
      .replace('%VehicleRecallYear%', year.slotValue)
    const cardText = requestAttributes.t(`CARD_TXT_VEHCILE_SHOW_YEAR_PROVIDED`)
      .replace('%VehicleRecallYear%', year.slotValue)

    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConversation
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(cardTitle, cardText) // TODO: should we keep this simple card?
      .withShouldEndSession(false)
      .getResponse()
  }
}

module.exports = { comfirmVehicleMakeModelYearHandler }
