const SESSION_KEYS = require('../constants').sessionKeys

const CurrentIntentLocationLog = {

  process (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    console.log('Current Intent Location = ', sessionAttributes[SESSION_KEYS.CurrentIntentLocation])
  }

}

const RequestLog = {

  process (handlerInput) {
    console.log('REQUEST ENVELOPE = ' + JSON.stringify(handlerInput.requestEnvelope))
  }

}

module.exports = { CurrentIntentLocationLog, RequestLog }
