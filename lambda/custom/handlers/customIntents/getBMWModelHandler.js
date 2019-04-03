'use strict'
const HELPER = require('../../utils/helper')
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const Vehicle = require('../../models/vehicle')

const GetBMWModelIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
                handlerInput.requestEnvelope.request.intent.name === 'GetBMWModelIntent'
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    const make = new Vehicle.Make({
      makeSlotId: 'BMW',
      makeSlotValue: 'BMW',
      makeIsValid: true
    })
    // sorry, could you tell me your model again
    const model = new Vehicle.Model({
      modelSlotId: slotValues.BMWModel.id,
      modelSlotValue: slotValues.BMWModel.resolved,
      modelIsValid: slotValues.BMWModel.isValidated
    })

    sessionAttributes[SESSION_KEYS.VEHICLE_MODEL] = make
    sessionAttributes[SESSION_KEYS.VEHICLE_MODEL] = model

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleYearIntent',
        confirmationStatus: 'NONE',
        slots: handlerInput.requestEnvelope.request.intent.slots
      })
      .getResponse()
  }
}
module.exports = { GetBMWModelIntentHandler }
