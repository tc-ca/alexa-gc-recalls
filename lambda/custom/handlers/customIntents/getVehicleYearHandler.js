'use strict'
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const HELPER = require('../../utils/helper')
const Vehicle = require('../../models/vehicleConversation')

const HANDLERS = {
  Confirm: require('./comfirmVehicleModelMakeYearHandler')
}

const InProgressGetVehicleYearIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'GetVehicleYearIntent' &&
        handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED'
  },
  async handle (handlerInput) {
    return handlerInput.responseBuilder
      .addDelegateDirective(handlerInput.requestEnvelope.request.intent) // makes alexa prompt for required slots.
      .getResponse()
  }
}

const CompletedGetVehicleYearIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'GetVehicleYearIntent' &&
          handlerInput.requestEnvelope.request.dialogState === 'COMPLETED'
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    const year = new Vehicle.Year({
      yearSlotValue: slotValues.year.resolved
    })

    sessionAttributes[SESSION_KEYS.VEHICLE_YEAR] = year

    return HANDLERS.Confirm.comfirmVehicleMakeModelYearHandler.handle(handlerInput)
  }
}
module.exports = { InProgress: InProgressGetVehicleYearIntentHandler, Completed: CompletedGetVehicleYearIntentHandler }
