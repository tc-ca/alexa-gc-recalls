// 'use strict'

// function SendDirective (handlerInput, directive) {
//   // Call Alexa Directive Service.
//   const requestEnvelope = handlerInput.requestEnvelope
//   const directiveServiceClient = handlerInput.serviceClientFactory.getDirectiveServiceClient()
//   const endpoint = requestEnvelope.context.System.apiEndpoint
//   const token = requestEnvelope.context.System.apiAccessToken
//   // send directive
//   return directiveServiceClient.enqueue(directive, endpoint, token)
// }

// async function ActivateVoicePlayerSpeakDirective (requestId, speechText, handlerInput)

// {
//   try {
//     const directive = {
//       header: {
//         requestId
//       },
//       directive: {
//         type: 'VoicePlayer.Speak',
//         speech: speechText
//       }
//     }
//     await SendDirective(handlerInput, directive)
//   } catch (err) {
//     // if it failed we can continue, just the user will wait longer for first response
//     console.log('error: ' + err)
//   }
// }
// module.exports = { ActivateVoicePlayerSpeakDirective }
