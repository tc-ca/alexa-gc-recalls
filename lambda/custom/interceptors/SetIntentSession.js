'use strict'
const SESSION_KEYS = require('../Constants').sessionKeys

const SetCurrentIntentSession = {

  process (handlerInput, userAction) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    if (handlerInput.requestEnvelope.request.type === 'IntentRequest') {
      sessionAttributes[SESSION_KEYS.VoiceRoutedIntentName] = handlerInput.requestEnvelope.request.intent.name
      console.log('interceptor working', handlerInput)
    }
  }

}
module.exports = SetCurrentIntentSession
