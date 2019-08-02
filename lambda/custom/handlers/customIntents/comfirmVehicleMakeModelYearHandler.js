'use strict'
const sanitizeHtml = require('sanitize-html')

const VehicleConversation = require('../../models/vehicleRecallConversation')
const Vehicle = require('../../models/vehicle')

const CONVERSATION_CONTEXT = require('../../constants').VEHICLE_CONVERSATION_CONTEXT

const SESSION_KEYS = require('../../constants').SESSION_KEYS
const VEHICLE_MAZDA_MODEL_SPEECH_CORRECTION = require('../../constants').VEHICLE_MAZDA_MODEL_SPEECH_CORRECTION

const SERVICES = {
  alexaProfileHandler: require('../../services/alexaProfile.api') }

const PhoneNumber = require('../../models/user').PhoneNumber

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
    const cardText = requestAttributes.t(`CARD_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR`)
    .replace('%VehicleRecallYear%', vehicle.year)
    .replace('%VehicleRecallMake%', vehicle.makeSpeechText)
    .replace('%VehicleRecallModel%', vehicle.modelSpeechText)

    const cardTitle =  requestAttributes.t('CARD_TXT_VEHCILE_COMFIRM_TITLE')

    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConversation
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    // TODO: add condition to check if have phone number, instead of always calling the API
    sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER] = new PhoneNumber(await SERVICES.alexaProfileHandler.GetMobileNumber(handlerInput))

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(cardTitle, cardText) // TODO: should we keep this simple card?
      .withShouldEndSession(false)
      .getResponse()
  }
}

module.exports = { comfirmVehicleMakeModelYearHandler }
