'use strict'
const HELPER = require('../../utils/helper')
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const Vehicle = require('../../models/vehicleConversation')

const InProgressGetVehicleMakeAndModelIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'GetVehicleMakeAndModelIntent' &&
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

    const model = new Vehicle.Model({
      modelSlotId: slotValues.model.id,
      modelSlotValue: slotValues.model.resolved,
      modelIsValid: slotValues.model.isValidated
    })

    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE] = make
    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE] = model

    return handlerInput.responseBuilder
      .addDelegateDirective(handlerInput.requestEnvelope.request.intent) // makes alexa prompt for required slots.
      .getResponse()
  }
}

const CompletedGetVehicleMakeAndModelIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'GetVehicleMakeAndModelIntent' &&
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

    const model = new Vehicle.Model({
      modelSlotId: slotValues.model.id,
      modelSlotValue: slotValues.model.resolved,
      modelIsValid: slotValues.model.isValidated
    })

    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE] = make
    sessionAttributes[SESSION_KEYS.VEHICLE_MODEL] = model

    // TODO: REMOVE if the never being invoke as the utterance calls the year intent all over instead of chaining the update.
    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleYearIntent',
        confirmationStatus: 'NONE',
        slots: handlerInput.requestEnvelope.request.intent.slots
      })
      // .addElicitSlotDirective('year', {
      //   name: 'GetVehicleYearIntent',
      //   confirmationStatus: 'NONE',
      //   slots: handlerInput.requestEnvelope.request.intent.slots
      // })
      // .speak('What year is your vehicle')
      // .reprompt('What year is your vehicle')
      .getResponse()
  }
}

module.exports = { InProgress: InProgressGetVehicleMakeAndModelIntentHandler, Completed: CompletedGetVehicleMakeAndModelIntentHandler }
