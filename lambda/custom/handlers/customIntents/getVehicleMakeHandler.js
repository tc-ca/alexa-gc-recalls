'use strict'

/**
 * Sample utterance {make}
 * Required slots {make}{model}
 * Usage: if only (Make i.e. Honda) is provided --> get/ask for model by delegating to Alexa for required slot
 */

const HELPER = require('../../utils/helper')
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const Vehicle = require('../../models/vehicle')

const InProgressGetMakeFirstThenModelIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
             handlerInput.requestEnvelope.request.intent.name === 'GetVehicleMakeIntent' &&
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

    // This handler can be called by the getVehicleModelIntentHandler, in such an event request will have model slot value.
    const model = new Vehicle.Model({
      modelSlotId: slotValues.model.id,
      modelSlotValue: slotValues.model.resolved,
      modelIsValid: slotValues.model.isValidated
    })

    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE] = make
    sessionAttributes[SESSION_KEYS.VEHICLE_MODEL] = model

    const cardText = requestAttributes.t(`CARD_TXT_VEHCILE_SHOW_MAKE_PROVIDED`)
      .replace('%VehicleRecallMake%', (typeof make.slotValue !== 'undefined') ? make.slotValue : '')

    const cardTitle = requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_TITLE`)

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
            // .withSimpleCard(cardTitle, cardText) TODO: show only for debugging
              .getResponse()
          // if model has not been given go into the specific intent to get context awareness
          case undefined:
            return handlerInput.responseBuilder
              .addDelegateDirective({
                name: 'GetBMWModelIntent',
                confirmationStatus: 'NONE',
                slots: {}
              })
            // .withSimpleCard(cardTitle, cardText) TODO: show only for debugging
              .getResponse()
          default:
            break
        }

        break
      default:
    }

    return handlerInput.responseBuilder
      .addDelegateDirective(handlerInput.requestEnvelope.request.intent)
      // .withSimpleCard(cardTitle, cardText) TODO: show only for debugging
      .getResponse()
  }
}

const CompletedGetMakeFirstThenModelIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'GetVehicleMakeIntent' &&
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

    const cardText = requestAttributes.t(`CARD_TXT_VEHCILE_SHOW_MODEL_PROVIDED`)
      .replace('%VehicleRecallModel%', (typeof model.slotValue !== 'undefined') ? model.slotValue : '')

    const cardTitle = requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_QUERY_MODEL_TITLE`)

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleYearIntent',
        confirmationStatus: 'NONE',
        slots: handlerInput.requestEnvelope.request.intent.slots
      })
      // .withSimpleCard(cardTitle, cardText) TODO: show only for debugging
      .getResponse()
  }
}

module.exports = { InProgressGetMakeFirstThenModel: InProgressGetMakeFirstThenModelIntentHandler, CompletedGetMakeFirstThenModel: CompletedGetMakeFirstThenModelIntentHandler }
