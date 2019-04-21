'use strict'

/**
 * Sample utterance: {model}
 * Required slots: none
 * Usage: if only (Model i.e. civic) is provided --> get/ask for make by chaining to getVehicleMakeIntent
 * Note: GetVehicleModelIntent is used to capture user utterance when prompted to clarify ambigious model
 */

const HELPER = require('../../utils/helper')
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const FOLLOW_UP_QUESTIONS = require('../../constants').FOLLOW_UP_QUESTIONS
const SEARCH_FINDINGS = require('../../constants').VEHICLE_SEARCH_FINDINGS
const VehicleRecallConversation = require('../../models/vehicleRecallConversation').VehicleRecallConversation
const Vehicle = require('../../models/vehicle')

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
    const vehicleRecallConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

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

const GetVehicleModelIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
              handlerInput.requestEnvelope.request.intent.name === 'GetVehicleModelIntent'
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    const model = new Vehicle.Model({
      modelSlotId: slotValues.model.id,
      modelSlotValue: slotValues.model.resolved,
      modelIsValid: slotValues.model.isValidated
    })

    const cardText = requestAttributes.t(`CARD_TXT_VEHCILE_SHOW_MODEL_PROVIDED`)
      .replace('%VehicleRecallModel%', (typeof model.slotValue !== 'undefined') ? model.slotValue : '')

    const cardTitle = requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_QUERY_MODEL_TITLE`)

    sessionAttributes[SESSION_KEYS.VEHICLE_MODEL] = model

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleMakeIntent',
        confirmationStatus: 'NONE',
        slots: handlerInput.requestEnvelope.request.intent.slots
      })
      .withSimpleCard(cardTitle, cardText)
      .getResponse()
  }
}

module.exports = { ResolveAmbigiousVehicleModel: ResolveAmbigiousVehicleModelIntentHandler, Inprogress: GetVehicleModelIntentHandler }
