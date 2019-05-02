'use strict'

/**
 * Sample utterance: {year}
 * Required slots: {year}
 * Usage: Amazon.Number provided -->  delegate to comfirmVehicleMakeModelYear Handler
 * Note: If Amazon.Number(english locales) Amazon.Four_Digit_Number/year is provided too early chain to GetVehicleMakeAndModelIntent
 */

const SESSION_KEYS = require('../../constants').SESSION_KEYS
const HELPER = require('../../utils/helper')
const Vehicle = require('../../models/vehicle')

const HANDLERS = {
  Confirm: require('./comfirmVehicleMakeModelYearHandler')
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

const CompletedGetVehicleYearButMakeModelNotProvidedIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'GetVehicleYearIntent' &&
          handlerInput.requestEnvelope.request.dialogState === 'COMPLETED' &&
          !handlerInput.requestEnvelope.session.attributes.VEHICLE_MAKE &&
          !handlerInput.requestEnvelope.session.attributes.VEHICLE_MODEL
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput

    const requestAttributes = attributesManager.getRequestAttributes()

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_YEAR_INTENT_TRIGGERED_NO_MODEL_MAKE_PROVIDED')
    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleMakeAndModelIntent',
        confirmationStatus: 'NONE',
        slots: {}
      })
      .speak(speechText)
      .getResponse()
  }
}
module.exports = { InProgress: InProgressGetVehicleYearIntentHandler, Completed: CompletedGetVehicleYearIntentHandler, CompletedNotCompleted: CompletedGetVehicleYearButMakeModelNotProvidedIntentHandler }
