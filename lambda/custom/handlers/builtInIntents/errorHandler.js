const GlobalErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE')
    console.error('ERROR HANDLED', error)

    // console.log(`Error handled: ${error.message}`)
    // console.log(`Stack: ${error.stack}`)

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withShouldEndSession(true)
      .getResponse()
  }
}

const CommandOutOfContextHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput

    const requestAttributes = attributesManager.getRequestAttributes()
    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT')
    console.log('COMMAND OUT OF CONTEXT')

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

module.exports = { GlobalErrorHandler, CommandOutOfContextHandler }
