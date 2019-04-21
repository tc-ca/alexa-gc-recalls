'use strict'

/**
 * Sample utterance: {model}{trimLevel}, {make}{model}{trimLevel}, {make}{model}
 * Required slots: {make} and {model}
 * Usage: if both Make and Model (Honda Civic) is provided --> get/ask for year by chaining to getVehicleYearIntent
 */

const HELPER = require('../../utils/helper')
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const Vehicle = require('../../models/vehicle')

const InProgressGetVehicleMakeAndModelIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'GetVehicleMakeAndModelIntent' &&
        handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED'
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

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

    const cardText = requestAttributes.t(`CARD_TXT_VEHCILE_SHOW_MAKE_MODEL_PROVIDED`)
      .replace('%VehicleRecallMake%', (typeof make.slotValue !== 'undefined') ? make.slotValue : '')
      .replace('%VehicleRecallModel%', (typeof model.slotValue !== 'undefined') ? model.slotValue : '')

    const cardTitle = requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_MODEL_TITLE`)

    // ambigious model, go get some context
    switch (slotValues.make.id) {
      case 'BMW':

        switch (slotValues.model.id) {
          case '323':

            // need to go back to Alexa engine to resolve value to correct entity.
            return handlerInput.responseBuilder
              .addDelegateDirective({
                name: 'GetBMWModelIntent',
                confirmationStatus: 'NONE',
                slots: {}
              })
              .withSimpleCard(cardTitle, cardText) // I heard you say BMW 323 but I need you to clairfy
              .getResponse()
          // if model has not been given go into the specific intent to get context awareness
          case undefined:
            return handlerInput.responseBuilder
              .addDelegateDirective({
                name: 'GetBMWModelIntent',
                confirmationStatus: 'NONE',
                slots: {}
              })
              .withSimpleCard(cardTitle, cardText)
              .getResponse()
          default:
            break
        }

        break
      default:
    }

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
    const requestAttributes = attributesManager.getRequestAttributes()

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

    const cardTitle = requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_MODEL_TITLE`)

    const cardText = requestAttributes.t(`CARD_TXT_VEHCILE_SHOW_MAKE_MODEL_PROVIDED`)
      .replace('%VehicleRecallMake%', (typeof make.slotValue !== 'undefined') ? make.slotValue : '')
      .replace('%VehicleRecallModel%', (typeof model.slotValue !== 'undefined') ? model.slotValue : '')
    // What is your make? Your answer was:
    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleYearIntent',
        confirmationStatus: 'NONE',
        slots: handlerInput.requestEnvelope.request.intent.slots
      })
      .withSimpleCard(cardTitle, cardText)
      .getResponse()
  }
}

module.exports = { InProgress: InProgressGetVehicleMakeAndModelIntentHandler, Completed: CompletedGetVehicleMakeAndModelIntentHandler }
