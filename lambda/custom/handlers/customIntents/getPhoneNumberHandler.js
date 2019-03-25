'use strict'

const SERVICES = {
  alexaProfileHandler: require('../../services/alexaProfileHandler.api')
}

const PhoneNumber = require('../../models/phoneNumber')

// Profile specific constants
const PROFILE = {
  COUNTRY_CODE: require('../../services/alexaProfileHandler.api').COUNTRY_CODE,
  PERMISSIONS: require('../../services/alexaProfileHandler.api').PERMISSIONS,
  PHONE_NUMBER_API_SEARCH_RESULT: require('../../services/alexaProfileHandler.api').PHONE_NUMBER_API_SEARCH_RESULT
}

/**
 * Code logic, handles short message service (SMS)/ text message interaction with skill
 * Provides appropriate response to user interaction / action to following questions.
 * QUESTION.WouldYouLikeToRecieveSMSMessage?
 * QUESTION.IsYourPhoneNumberFiveFiveFiveBlahBlah?
 *
 * @param {*} handlerInput
 * @returns
 */
const PhoneNumberHandler = {
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()

    const phoneNumberObj = new PhoneNumber(await SERVICES.alexaProfileHandler.GetMobileNumber(handlerInput)) // use new keyword to get intelli sense / known type.

    switch (phoneNumberObj.apiRetrievalResult) {
      case PROFILE.PHONE_NUMBER_API_SEARCH_RESULT.Found:

        return phoneNumberObj
      case PROFILE.PHONE_NUMBER_API_SEARCH_RESULT.NotFound:
        return null
      case PROFILE.PHONE_NUMBER_API_SEARCH_RESULT.NoPermission:
        //  just build response and return in 'case statement' since providing consent card, unique scenario.
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('ERROR_MISSING_PHONE_NUMBER_PERMISSIONS'))
          .withAskForPermissionsConsentCard(PROFILE.PERMISSIONS)
          .getResponse()

        // TODO: Implement

      case PROFILE.PHONE_NUMBER_API_SEARCH_RESULT.Error:
        //  just build response and return in 'case statement' since providing consent card, unique scenario.
        return handlerInput.responseBuilder
          .speak(requestAttributes.t('ERROR_MISSING_PHONE_NUMBER_PERMISSIONS'))
          .withAskForPermissionsConsentCard(PROFILE.PERMISSIONS)
          .getResponse()
      default:
        break
    }
  }
}

module.exports = { PhoneNumberHandler }
