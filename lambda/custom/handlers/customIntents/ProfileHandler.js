
const MODELS = { PhoneNumber: require('../../models/phoneNumber') }

// Constants specific to handler.
const PERMISSIONS = ['alexa::profile:mobile_number:read']

const PHONE_NUMBER_API_SEARCH_RESULT = {
  Found: 0,
  NotFound: 1,
  NoPermission: 2,
  Error: 3
}

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
const PhoneNumberHandler = {
  async handle (handlerInput) {
    const { requestEnvelope, serviceClientFactory } = handlerInput

    const consentToken = requestEnvelope.context.System.apiAccessToken
    if (!consentToken) {
      return PHONE_NUMBER_API_SEARCH_RESULT.NoPermission
    }

    const phoneNumber = new MODELS.PhoneNumber()
    try {
      const client = serviceClientFactory.getUpsServiceClient()
      const number = await client.getProfileMobileNumber()

      if (number == null) {
        phoneNumber.apiRetrievalResult = PHONE_NUMBER_API_SEARCH_RESULT.NotFound
      } else {
        phoneNumber.phoneNumber = number.phoneNumber
        phoneNumber.apiRetrievalResult = PHONE_NUMBER_API_SEARCH_RESULT.Found
        phoneNumber.countryCode = COUNTRY_CODE.NorthAmerica
      }
    } catch (error) {
      if (error.statusCode !== 403) {
        phoneNumber.apiRetrievalResult = PHONE_NUMBER_API_SEARCH_RESULT.Error
      }
      console.log('Alexa profile phone retrieval error', error)
      phoneNumber.apiRetrievalResult = PHONE_NUMBER_API_SEARCH_RESULT.NoPermission
    }

    return phoneNumber
  }
}

module.exports = { PhoneNumberHandler, PHONE_NUMBER_API_SEARCH_RESULT: PHONE_NUMBER_API_SEARCH_RESULT, COUNTRY_CODE, PERMISSIONS }
