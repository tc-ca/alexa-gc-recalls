const SessionEndedRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle (handlerInput) {
    console.log('SESSION ENDED WITH REASON', handlerInput.requestEnvelope.request.reason)

    return handlerInput.responseBuilder.getResponse()
  }
}
module.exports = SessionEndedRequestHandler
