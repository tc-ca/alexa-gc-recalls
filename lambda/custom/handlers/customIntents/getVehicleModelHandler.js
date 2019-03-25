'use strict'
const HELPER = require('../../utils/helper')
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const FOLLOW_UP_QUESTIONS = require('../../constants').FOLLOW_UP_QUESTIONS
const SEARCH_FINDINGS = require('../../constants').VEHICLE_SEARCH_FINDINGS
const Vehicle = require('../../models/vehicleConversation')

const HANDLERS = {
  VehicleRecallHandler: require('./searchForVehicleRecallHandler')
}

const ResolveAmbigiousVehicleModelIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
          handlerInput.requestEnvelope.request.intent.name === 'GetVehicleModelIntent' &&
          handlerInput.requestEnvelope.session.attributes.VehicleConversation &&
          handlerInput.requestEnvelope.session.attributes.VehicleConversation.searchFindings === SEARCH_FINDINGS.AmbigiousModelFound &&
          handlerInput.requestEnvelope.session.attributes.VehicleConversation.followUpQuestionCode === FOLLOW_UP_QUESTIONS.VEHICLE_IsItModelAOrModelB
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)
    const vehicleRecallConversation = new Vehicle.VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    if (slotValues.multipleChoiceNoResponse.isValidated) {
      return HANDLERS.VehicleRecallHandler.SearchForAnotherRecallHandler.handle(handlerInput)
    }

    const make = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_MAKE])
    const year = new Vehicle.MakeModelYearMapper(sessionAttributes[SESSION_KEYS.VEHICLE_YEAR])

    const model = new Vehicle.Model({
      modelSlotId: slotValues.model.id,
      modelSlotValue: slotValues.model.resolved,
      modelIsValid: slotValues.model.isValidated
    })

    const vehicle = new Vehicle.Vehicle({ make: make, model: model, year: year })

    vehicleRecallConversation.vehicle = vehicle
    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleRecallConversation

    return HANDLERS.VehicleRecallHandler.AmbigiousHandler.handle(handlerInput)
  }
}

const CollectModelFirstIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
              handlerInput.requestEnvelope.request.intent.name === 'GetVehicleModelIntent' &&
              !handlerInput.requestEnvelope.session.attributes.VEHICLE_MAKE
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    const model = new Vehicle.Model({
      modelSlotId: slotValues.model.id,
      modelSlotValue: slotValues.model.resolved,
      modelIsValid: slotValues.model.isValidated
    })

    sessionAttributes[SESSION_KEYS.VEHICLE_MODEL] = model

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleMakeIntent',
        confirmationStatus: 'NONE',
        slots: handlerInput.requestEnvelope.request.intent.slots
      })
      .getResponse()
  }
}

const CollectModelLastIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'GetVehicleModelIntent' &&
            handlerInput.requestEnvelope.session.attributes.VEHICLE_MAKE
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    const model = new Vehicle.Model({
      modelSlotId: slotValues.model.id,
      modelSlotValue: slotValues.model.resolved,
      modelIsValid: slotValues.model.isValidated
    })

    sessionAttributes[SESSION_KEYS.VEHICLE_MODEL] = model

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleYearIntent',
        confirmationStatus: 'NONE',
        slots: handlerInput.requestEnvelope.request.intent.slots
      })
  }
}

module.exports = { ResolveAmbigiousVehicleModelIntentHandler, CollectModelLastIntentHandler, CollectModelFirstIntentHandler }
