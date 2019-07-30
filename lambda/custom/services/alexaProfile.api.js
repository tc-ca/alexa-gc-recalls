
const PhoneNumber = require('../models/user').PhoneNumber
const Email = require('../models/user').Email
const API_SEARCH_RESULT = require('../constants').API_SEARCH_RESULT
// Constants specific to handler.
const PERMISSIONS = ['alexa::profile:mobile_number:read']

const COUNTRY_CODE = {
  Other: -1,
  NorthAmerica: 1
}

/**
 * Code logic, attempts Alexa API Call to retreive phone number from Alexa account.
 *
 * @param {*} handlerInput
 * @returns PhoneNumber Object
 */
async function GetMobileNumber (handlerInput) {
  const { requestEnvelope, serviceClientFactory } = handlerInput

  const consentToken = requestEnvelope.context.System.apiAccessToken
  if (!consentToken) {
    return API_SEARCH_RESULT.NoPermission
  }

  const phoneNumber = new PhoneNumber()
  try {
    const apiStart = (new Date()).getTime()

    const client = serviceClientFactory.getUpsServiceClient()
    const number = await client.getProfileMobileNumber()

    const apiEnd = (new Date()).getTime()

    console.log({ requestId: 1, measuring: 'Get Profile Phone Number Query API Call', request: null, executionTimeMilliSeconds: apiEnd - apiStart, notes: 'measuring api time' })

    if (number == null) {
      phoneNumber.apiRetrievalResult = API_SEARCH_RESULT.NotFound
    } else {
      phoneNumber.phoneNumber = number.phoneNumber
      phoneNumber.countryCode = number.countryCode
      phoneNumber.apiRetrievalResult = API_SEARCH_RESULT.Found
    }
  } catch (error) {
    if (error.statusCode !== 403) {
      phoneNumber.apiRetrievalResult = API_SEARCH_RESULT.Error
    }
    console.log('Alexa profile phone retrieval error', error)
    phoneNumber.apiRetrievalResult = API_SEARCH_RESULT.NoPermission
  }

  return phoneNumber
}

// async function GetEmail (handlerInput) {
//   const { requestEnvelope, serviceClientFactory } = handlerInput

//   const consentToken = requestEnvelope.context.System.apiAccessToken
//   if (!consentToken) {
//     return API_SEARCH_RESULT.NoPermission
//   }

//   const email = new Email()
//   try {
//     const client = serviceClientFactory.getUpsServiceClient()
//     const profileEmail = await client.getProfileEmail()

//     if (profileEmail == null) {
//       email.apiRetrievalResult = API_SEARCH_RESULT.NotFound
//     } else {
//       email.apiRetrievalResult = API_SEARCH_RESULT.Found
//       email.email = profileEmail
//     }
//   } catch (error) {
//     if (error.statusCode !== 403) {
//       email.apiRetrievalResult = API_SEARCH_RESULT.Error
//     }
//     console.log('Alexa profile email retrieval error', error)
//     email.apiRetrievalResult = API_SEARCH_RESULT.NoPermission
//   }

//   return email
// }

module.exports = { GetMobileNumber, API_SEARCH_RESULT, COUNTRY_CODE, PERMISSIONS }
