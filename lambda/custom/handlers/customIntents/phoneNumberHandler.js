const HANDLERS = {
  ProfileHandler: require('./profileHandler')
}

const MODELS = {
  GeneralConversation: require('../../models/generalConversation'),
  PhoneNumber: require('../../models/phoneNumber') }

// Required constants
const SESSION_KEYS = require('../../constants').SESSION_KEYS

// Profile specific constants
const PROFILE = {
  COUNTRY_CODE: require('./profileHandler').COUNTRY_CODE,
  PERMISSIONS: require('./profileHandler').PERMISSIONS,
  PHONE_NUMBER_API_SEARCH_RESULT: require('./profileHandler').PHONE_NUMBER_API_SEARCH_RESULT
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
const SMSHandler = {
  async handle (handlerInput, userAction) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SMSIntent'

    const phoneNumberObj = new MODELS.PhoneNumber(await HANDLERS.ProfileHandler.PhoneNumberHandler.handle(handlerInput)) // use new keyword to get intelli sense / known type.

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

module.exports = { SMSHandler }
