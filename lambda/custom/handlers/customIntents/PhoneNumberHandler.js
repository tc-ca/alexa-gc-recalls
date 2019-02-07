const HANDLERS = {
  ProfileHandler: require('../../handlers/customIntents/ProfileHandler')
}

const HELPER = require('../../utils/Helper')

const MODELS = {
  Conversation: require('../../models/generalConversation'),
  PhoneNumber: require('../../models/phoneNumber') }

// Required constants
const USER_ACTION = require('../../Constants').userAction
const SESSION_KEYS = require('../../Constants').sessionKeys
const FOLLOW_UP_QUESTION = require('../../Constants').FollowUpQuestions

// Profile specific constants
const PROFILE = {
  COUNTRY_CODE: require('../../handlers/customIntents/ProfileHandler').COUNTRY_CODE,
  PERMISSIONS: require('../../handlers/customIntents/ProfileHandler').PERMISSIONS,
  PHONE_NUMBER_API_SEARCH_RESULT: require('../../handlers/customIntents/ProfileHandler').PHONE_NUMBER_API_SEARCH_RESULT
}

/**
 * GetPhoneNumberIntent comfirmed (yes)
 * logic handled when end-user utters phone number and comfirms the intent.
 *
 * @param {*} handlerInput
 * @returns
 */
const ComfirmedCompletedGetPhoneNumberIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'GetPhoneNumberIntent' &&
        handlerInput.requestEnvelope.request.dialogState === 'COMPLETED' &&
        handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    let phoneNumber = slotValues.phoneNumber.resolved
    const convoObj = new MODELS.Conversation(sessionAttributes[SESSION_KEYS.GeneralConversation])
    let speechText

    if (IsValidTenDigitPhoneNumber(phoneNumber)) {
      speechText = requestAttributes.t('TELL_ME_YOUR_MAKE')
      // only place into session when phone number is valid.
      convoObj.withUserProvidedPhoneNumber(slotValues.phoneNumber.resolved)
      sessionAttributes[SESSION_KEYS.GeneralConversation] = convoObj
    } else {
      // TODO: TEST
      speechText = requestAttributes.t('ERROR_PHONE_NUMBER_VALIDATION_10_DIGIT_TRY_AGAIN')
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

/**
 * GetPhoneNumberIntent comfirmed (no)
 * logic handled when end-user utters phone number and says 'no' when alexa prompts for comfirmation.
 *
 * @param {*} handlerInput
 * @returns
 */
const DeniedCompletedGetPhoneNumberIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name === 'GetPhoneNumberIntent' &&
        handlerInput.requestEnvelope.request.dialogState === 'COMPLETED' &&
        handlerInput.requestEnvelope.request.intent.confirmationStatus === 'DENIED'
  },
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()

    const speechText = requestAttributes.t('TELL_ME_YOUR_PHONE_NUMBER') // intent denied, ask for phone number again
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
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
    const convoObj = new MODELS.Conversation(sessionAttributes[SESSION_KEYS.GeneralConversation])
    let speechText

    switch (userAction) {
      case USER_ACTION.ResponsedYesToWantingToReceiveSMS:
        convoObj.followUpQuestionCode = FOLLOW_UP_QUESTION.IsYourPhoneNumberFiveFiveFiveBlahBlah
        convoObj.sendSMS = true

        const phoneNumberObj = new MODELS.PhoneNumber(await HANDLERS.ProfileHandler.PhoneNumberHandler.handle(handlerInput)) // use new keyword to get intelli sense / known type.

        switch (phoneNumberObj.apiRetrievalResult) {
          case PROFILE.PHONE_NUMBER_API_SEARCH_RESULT.Found:
            speechText = requestAttributes.t('IS_YOUR_PHONE_NUMBER_1_XXX_XXX_XXXX').replace('%PhoneNumber%', phoneNumberObj.phoneNumber)

            break
          case PROFILE.PHONE_NUMBER_API_SEARCH_RESULT.NotFound:
            speechText = requestAttributes.t('ERROR_MISSING_PHONE_NUMBER')
            // TODO: Implement

            break
          case PROFILE.PHONE_NUMBER_API_SEARCH_RESULT.NoPermission:
          //  just build response and return in 'case statement' since providing consent card, unique scenario.
            return handlerInput.responseBuilder
              .speak(requestAttributes.t('ERROR_MISSING_PHONE_NUMBER_PERMISSIONS'))
              .withAskForPermissionsConsentCard(PROFILE.PERMISSIONS)
              .getResponse()

            // TODO: Implement

          case PROFILE.PHONE_NUMBER_API_SEARCH_RESULT.Error:
            speechText = requestAttributes.t('GENERAL_ERROR_MSG')
            // TODO: Implement
            break

          default:
            break
        }
        break
      case USER_ACTION.ResponsedNoToWantingToReceiveSMS:
        convoObj.sendSMS = false
        speechText = requestAttributes.t('TELL_ME_YOUR_MAKE')

        break
      case USER_ACTION.ResponsedNoToCorrectPhoneNumberFoundOnAccount:
        speechText = requestAttributes.t('TELL_ME_YOUR_PHONE_NUMBER')

        break
      case USER_ACTION.ResponsedYesToCorrectPhoneNumberFoundOnAccount:
        speechText = requestAttributes.t('TELL_ME_YOUR_MAKE')
        break
      default:
        break
    }

    sessionAttributes[SESSION_KEYS.GeneralConversation] = convoObj

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
      .reprompt(speechText)
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

// TODO: TEST 
/**
 * Function validates phone number to match ten digits
 *
 * @param {*} phoneNumber
 * @returns
 */
function IsValidTenDigitPhoneNumber (phoneNumber) {
  let ValidPhoneNumberPattern = new RegExp('^[0-9]{10}$')

  if (phoneNumber !== 'undefined') {
    if (ValidPhoneNumberPattern.test(phoneNumber)) {
      return true
    }
  }
  return false
}
module.exports = { SMSHandler, ComfirmedCompletedGetPhoneNumberIntentHandler, DeniedCompletedGetPhoneNumberIntentHandler }
