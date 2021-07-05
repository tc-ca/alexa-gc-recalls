const SessionEndedRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle (handlerInput) {
    const { requestEnvelope } = handlerInput
    const sessionId = requestEnvelope.session.sessionId

    console.error('SESSION ENDED WITH REASON', { sessionId: sessionId, withReason: handlerInput.requestEnvelope.request.reason })

    return handlerInput.responseBuilder.getResponse()
  }
}
module.exports = SessionEndedRequestHandler
