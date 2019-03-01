const ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE')
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse()
  }
}

const CommandOutOfContextHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput

    const requestAttributes = attributesManager.getRequestAttributes()
    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT')

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

module.exports = { ErrorHandler, CommandOutOfContextHandler }
