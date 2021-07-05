
/**
 * Request Interceptor to log the request sent by Alexa
 */
const LogRequest = {
  process (handlerInput) {
    console.log('REQUEST ENVELOPE', JSON.stringify(handlerInput.requestEnvelope, null, 2))
  }

}

/**
 * Response Interceptor to log the response made to Alexa
 */
const LogResponse = {
  process (handlerInput, response) {
    console.log('RESPONSE ENVELOPE', JSON.stringify(response, null, 2))
  }
}

module.exports = { LogRequest, LogResponse }
