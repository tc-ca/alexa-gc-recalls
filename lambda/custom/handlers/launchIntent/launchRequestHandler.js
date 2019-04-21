'use strict'

const SESSION_KEYS = require('../../constants').SESSION_KEYS

const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput

    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    // Set attempt to zero, before help is initiated / provided to user when comfirming make, model, and year.
    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT] = 0

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_WELCOME_MSG')

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

module.exports = LaunchRequestHandler
