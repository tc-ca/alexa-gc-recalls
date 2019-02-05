const HELPER = require('../../utils/Helper')
// Enums
const USER_ACTION = require('../../Constants').userAction
const SESSION_KEYS = require('../../Constants').sessionKeys
const MODELS = {
  Conversation: require('../../models/conversation'),
  PhoneNumber: require('../../models/phoneNumber') }

const QUESTION = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions

const PhoneNumberAPISearchResult = {
  Found: 0,
  NotFound: 1,
  NoPermission: 2,
  ServiceError: 3,
  Error: 4
}

const CountryCode = {
  Other: -1,
  NorthAmerica: 1
}

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

    // TODO: Check to see if resolution match is not success before taking  value
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)
    let phoneNumber = slotValues.phoneNumber.resolved
    const convoObj = new MODELS.Conversation(sessionAttributes[SESSION_KEYS.Conversation])
    let speechText

    if (IsValidPhoneNumber(phoneNumber)) {
      speechText = requestAttributes.t('TELL_ME_YOUR_MAKE')
      // only place into session when phone number is valid.
      convoObj.withManuallyProvidedPhoneNumber(slotValues.phoneNumber.resolved)
      sessionAttributes[SESSION_KEYS.Conversation] = convoObj
    } else {
      speechText = requestAttributes.t('ERROR_PHONE_NUMBER_VALIDATION_10_DIGIT_TRY_AGAIN')
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

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

    const speechText = requestAttributes.t('TELL_ME_YOUR_PHONE_NUMBER')
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const SMSHandler = {
  async handle (handlerInput, userAction) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'SMSIntent'
    const convoObj = new MODELS.Conversation(sessionAttributes[SESSION_KEYS.Conversation])
    let speechText

    switch (userAction) {
      case USER_ACTION.ResponsedYesToWantingToReceiveSMS:
        convoObj.followUpQuestionEnum = QUESTION.IsYourPhoneNumberFiveFiveFiveBlahBlah
        convoObj.sendSMS = true

        const phoneNumberObj = new MODELS.PhoneNumber(await GetPhoneNumberFromAlexaAccount(handlerInput)) // use new keyword to get intelli sense / known type.

        switch (phoneNumberObj.phoneNumberState) {
          case PhoneNumberAPISearchResult.Found:

            switch (phoneNumberObj.countryCode) {
              case CountryCode.NorthAmerica:
                speechText = requestAttributes.t('IS_YOUR_PHONE_NUMBER_1_XXX_XXX_XXXX').replace('%PhoneNumber%', phoneNumberObj.phoneNumber)

                break
              case CountryCode.Other:
                // TODO: IMPLEMENT

                speechText = requestAttributes.t('IS_YOUR_PHONE_NUMBER_1_XXX_XXX_XXXX').replace('%PhoneNumber%', phoneNumberObj.phoneNumber)
                break
              default:
                // TODO: IMPLEMENT

                speechText = requestAttributes.t('IS_YOUR_PHONE_NUMBER_1_XXX_XXX_XXXX').replace('%PhoneNumber%', phoneNumberObj.phoneNumber)

                break
            }

            break
          case PhoneNumberAPISearchResult.NotFound:
            speechText = requestAttributes.t('ERROR_MISSING_PHONE_NUMBER')
            break
          case PhoneNumberAPISearchResult.NoPermission:
          //  just build response and return in 'case statement' since providing consent card, unique scenario.
            return handlerInput.responseBuilder
              .speak(requestAttributes.t('ERROR_MISSING_PHONE_NUMBER_PERMISSIONS'))
              .withAskForPermissionsConsentCard(requestAttributes.t('ERROR_MISSING_PHONE_NUMBER_PERMISSIONS'))
              .getResponse()
          case PhoneNumberAPISearchResult.ServiceError:
            speechText = requestAttributes.t('GENERAL_ERROR_MSG')

            break
          case PhoneNumberAPISearchResult.Error:
            speechText = requestAttributes.t('GENERAL_ERROR_MSG')

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

    sessionAttributes[SESSION_KEYS.Conversation] = convoObj

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

async function GetPhoneNumberFromAlexaAccount (handlerInput) {
  const { requestEnvelope, serviceClientFactory } = handlerInput

  const consentToken = requestEnvelope.context.System.apiAccessToken
  if (!consentToken) {
    return PhoneNumberAPISearchResult.NoPermission
  }

  const phoneNumber = new MODELS.PhoneNumber()
  try {
    const client = serviceClientFactory.getUpsServiceClient()
    const number = await client.getProfileMobileNumber()

    if (number == null) {
      phoneNumber.phoneNumberState = PhoneNumberAPISearchResult.NotFound
    } else {
      if (Number(number.countryCode) !== CountryCode.NorthAmerica) {
        phoneNumber.countryCode = CountryCode.Other
      } else {
        phoneNumber.phoneNumber = number.phoneNumber
        phoneNumber.phoneNumberState = PhoneNumberAPISearchResult.Found
        phoneNumber.countryCode = CountryCode.NorthAmerica
      }
    }
  } catch (error) {
    if (error.name === 'ServiceError') {
      phoneNumber.phoneNumberState = PhoneNumberAPISearchResult.ServiceError
    }
    phoneNumber.phoneNumberState = PhoneNumberAPISearchResult.Error
  }

  return phoneNumber
}

function IsValidPhoneNumber (phoneNumber) {
  let ValidPhoneNumberPattern = new RegExp('^[0-9]{10}$')

  if (phoneNumber !== 'undefined') {
    if (ValidPhoneNumberPattern.test(phoneNumber)) {
      return true
    }
  }
  return false
}
module.exports = { SMSHandler, ComfirmedCompletedGetPhoneNumberIntentHandler, DeniedCompletedGetPhoneNumberIntentHandler }
