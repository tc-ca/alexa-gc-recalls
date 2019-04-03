'use strict'

const HELPER = require('../../utils/helper')
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const Vehicle = require('../../models/vehicle')

const InProgressCollectMakeIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
             handlerInput.requestEnvelope.request.intent.name === 'GetVehicleMakeIntent' &&
             handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED'
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    const make = new Vehicle.Make({
      makeSlotId: slotValues.make.id,
      makeSlotValue: slotValues.make.resolved,
      makeIsValid: slotValues.make.isValidated
    })

    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE] = make
    return handlerInput.responseBuilder
      .addDelegateDirective(handlerInput.requestEnvelope.request.intent) // makes alexa prompt for required slots.
      .getResponse()
  }
}

const CompletedCollectMakeIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'GetVehicleMakeIntent' &&
               handlerInput.requestEnvelope.request.dialogState === 'COMPLETED'
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    const make = new Vehicle.Make({
      makeSlotId: slotValues.make.id,
      makeSlotValue: slotValues.make.resolved,
      makeIsValid: slotValues.make.isValidated
    })

    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE] = make

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleYearIntent',
        confirmationStatus: 'NONE',
        slots: handlerInput.requestEnvelope.request.intent.slots
      })
      .getResponse()
  }
}

module.exports = { InProgressCollectMakeIntentHandler, CompletedCollectMakeIntentHandler }
