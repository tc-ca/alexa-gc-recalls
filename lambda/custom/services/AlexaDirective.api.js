'use strict'

function SendDirective (handlerInput, directive) {
  // Call Alexa Directive Service.
  const requestEnvelope = handlerInput.requestEnvelope
  const directiveServiceClient = handlerInput.serviceClientFactory.getDirectiveServiceClient()
  const endpoint = requestEnvelope.context.System.apiEndpoint
  const token = requestEnvelope.context.System.apiAccessToken
  // send directive
  return directiveServiceClient.enqueue(directive, endpoint, token)
}

module.exports = { callDirectiveService: SendDirective }
