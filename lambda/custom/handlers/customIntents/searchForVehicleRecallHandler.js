'use strict'

// TODO: double check currentIntentLocation
// TODO: should we always pass user action??

// Constants
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const USER_ACTION = require('../../constants').USER_ACTION
const FOLLOW_UP_QUESTIONS = require('../../constants').FOLLOW_UP_QUESTIONS
const CONVERSATION_CONTEXT = require('../../constants').VEHICLE_CONVERSATION_CONTEXT
const SEARCH_FINDINGS = require('../../constants').VEHICLE_SEARCH_FINDINGS
const VEHICLE_MAKES_ID = require('../../constants').VEHICLE_MAKE_ID

const SERVICES = {
  TC_RECALLS_API: require('../../services/transportSafetyRecalls.api'),
  ALEXA_DIRECTIVES_API: require('../../services/alexaDirective.api'),
  AMAZON_SNS_API: require('../../services/amazonSNS.api')
}

const HELPER = require('../../utils/helper')

const MODELS = {
  GeneralConversation: require('../../models/generalConversation'),
  VehicleConversation: require('../../models/vehicleConversation') }

const HANDLERS = {
  PhoneNumberHandler: require('./phoneNumberHandler')
}

// TODO: check to see if this handler is still required we are using auto delegation.
/**
 * Delegates to alexa to collect required slots
 *
 *
 * @param {*} handlerInput
 * @returns
 */
const InProgressSearchForVehicleRecallIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SearchForVehicleRecallIntent' &&
      handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED'
  },
  async handle (handlerInput) {
    return handlerInput.responseBuilder
      .addDelegateDirective(handlerInput.requestEnvelope.request.intent) // makes alexa prompt for required slots.
      .getResponse()
  }
}

/**
 * logic handled when end-user comfirms make, model and year of vehicle
 * Response is dynamic, possible outcomes
 *  1. No recalls found
 *  2. One recall found, sends text message
 *  3. Multiple recalls found, sends text message
 *  4. non valid model found.
 *  5. Ambigious model found.
 *
 * @param {*} handlerInput
 * @returns
 */
const ComfirmedCompletedSearchForVehicleRecallIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SearchForVehicleRecallIntent' &&
      handlerInput.requestEnvelope.request.dialogState === 'COMPLETED' &&
      handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED'
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    // const requestId = handlerInput.requestEnvelope.request.requestId

    let currentRecallIndex = 0 // set to zero, as the current index in the array of recalls
    let speechText
    let vehicleConversation = null

    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)

    // look for recalls based on slot values.
    let recalls = await SERVICES.TC_RECALLS_API.GetRecalls(slotValues.VehicleMakeType.resolved, slotValues.VehicleModelType.resolved, slotValues.year.resolved)
    // get details on the recalls
    let recallsSummaries = await GetRecallsDetails(recalls, handlerInput.requestEnvelope.request.locale)

    const generalConversationObj = new MODELS.GeneralConversation(sessionAttributes[SESSION_KEYS.GeneralConversation])

    // Return findings of search and retrieves the appropriate follow up question
    vehicleConversation = new MODELS.VehicleConversation.Builder({
      requestAttributes: requestAttributes,
      year: slotValues.year.resolved,
      make: slotValues.VehicleMakeType.resolved,
      model: slotValues.VehicleModelType.resolved,
      recalls: recalls,
      currentIndex: currentRecallIndex,
      recallsSummaries: recallsSummaries
    })
      .modelIsValid(slotValues.VehicleModelType.isValidated)
      .withConversation(generalConversationObj)
      .withFollowUpQuestion(CONVERSATION_CONTEXT.GettingSearchResultFindingsState)
      .withFindings()

    speechText = vehicleConversation.speech()

    // TODO: Get phone number.
    // TODO: CAST for intellisense
    let retrievedPhoneNumber = await HANDLERS.PhoneNumberHandler.SMSHandler.handle(handlerInput)

    // only send text msg on certain conditions.
    if (retrievedPhoneNumber !== null && (vehicleConversation.searchFindings === SEARCH_FINDINGS.SingleRecallFound || vehicleConversation.searchFindings === SEARCH_FINDINGS.MultipleRecallsFound)) {
      const message = GetVehicleRecallSMSMessage(slotValues.VehicleMakeType.resolved, slotValues.VehicleModelType.resolved, slotValues.year.resolved, requestAttributes)
      SERVICES.AMAZON_SNS_API.SendSMS({ message: message, phoneNumber: retrievedPhoneNumber.phoneNumber })
    }

    // TODO: try sending by email instead.

    // IMPORTANT: place required values into session to keep for contextual value on next round trip.
    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleConversation
    sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex] = currentRecallIndex
    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'
    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
      .reprompt(`<speak>${speechText}</speak>`)
    //  .withSimpleCard('Welcome to Canadian Safety Recalls', 'Recalls have been found')
      .withShouldEndSession(false)
      .getResponse()
  }
}

/**
 * logic handled when end-user says 'no' when alexa prompts for comfirmation.
 *
 * @param {*} handlerInput
 * @returns
 */
const DeniedCompletedSearchForVehicleRecallIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SearchForVehicleRecallIntent' &&
      handlerInput.requestEnvelope.request.dialogState === 'COMPLETED' &&
      handlerInput.requestEnvelope.request.intent.confirmationStatus === 'DENIED'
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    console.log('filled slots: ', JSON.stringify(handlerInput.requestEnvelope.request.intent.slots))

    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'DeniedCompletedSearchForVehicleRecallIntentHandler'
    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT]++

    let speechText
    if (sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT] === 4) {
      speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_FAILED_MAX_ATTEMPTS')
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
        .withShouldEndSession(true)
        .getResponse()
    } else {
      speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN') // intent denied, ask end user if they would like to attempt search again?
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
        .getResponse()
    }
  }
}

const AmbigiousHandler = {
  async canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SearchForVehicleRecallIntent' &&
      handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED' &&
      handlerInput.requestEnvelope.request.intent.slots.VehicleModelType.value &&
      !handlerInput.requestEnvelope.request.intent.slots.VehicleMakeType.value &&
      !handlerInput.requestEnvelope.request.intent.slots.year.value
  },
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)
    const vehicleConversationObjFromSession = sessionAttributes[SESSION_KEYS.VehicleConversation]

    let resolvingType
    let recalls
    let speechText
    const resolvingModelCode = {
      Ambigious: 0,
      NonValid: 1
    }

    // TODO: check to see if the slots values have been validated.
    // if not validated then this is an attempt to validate or else trying to resolve ambigious model

    // still not validated, the send error message.

    if (!vehicleConversationObjFromSession.validVehicleModel) {
      if (slotValues.VehicleModelType.isValidated) {
        resolvingType = resolvingModelCode.NonValid
        // resolving valid model
      } else {
        speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_MODEL_VALIDATION_FAILED')
          .replace('%VehicleRecallYear%', vehicleConversationObjFromSession.year)
          .replace('%VehicleRecallMake%', vehicleConversationObjFromSession.make)
          .replace('%VehicleRecallModel%', slotValues.VehicleModelType.resolved)

        vehicleConversationObjFromSession.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
        sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'
        sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleConversationObjFromSession

        return handlerInput.responseBuilder
          .speak(`<speak>${speechText}</speak>`)
        //  .withSimpleCard('Reading Recalls')
          .getResponse()
      }
    } else {
      resolvingType = resolvingModelCode.Ambigious
    }

    recalls = await SERVICES.TC_RECALLS_API.GetRecalls(vehicleConversationObjFromSession.make, slotValues.VehicleModelType.resolved, vehicleConversationObjFromSession.year)

    switch (resolvingType) {
      case resolvingModelCode.NonValid:
        break
      case resolvingModelCode.Ambigious:
        recalls = recalls.filter(x => {
          return x.modelName === slotValues.VehicleModelType.resolved
        })
    }
    // TODO: check to ensure make and year has been set, else ask for them
    // TODO: make sure model is valid

    // get session variables.
    // TODO: cast to vehicle object
    let recallsSummaries = await GetRecallsDetails(recalls, handlerInput.requestEnvelope.request.locale)

    const generalConversationObj = new MODELS.GeneralConversation(sessionAttributes[SESSION_KEYS.GeneralConversation])

    // Return findings of search and retrieves the appropriate follow up question
    let vehicleConversation = new MODELS.VehicleConversation.Builder({
      requestAttributes: requestAttributes,
      year: vehicleConversationObjFromSession.year,
      make: vehicleConversationObjFromSession.make,
      model: slotValues.VehicleModelType.resolved,
      recalls: recalls,
      currentIndex: 0,
      recallsSummaries: recallsSummaries
    })
      .withConversation(generalConversationObj)
      .modelIsValid(slotValues.VehicleModelType.isValidated)
      .withFollowUpQuestion(CONVERSATION_CONTEXT.GettingSearchResultFindingsState)
      .withFindings()

    speechText = vehicleConversation.speech()
    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleConversation
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    // only send text msg on certain conditions.
    if ((generalConversationObj.sendSMS && (vehicleConversation.searchFindings === SEARCH_FINDINGS.SingleRecallFound || vehicleConversation.searchFindings === SEARCH_FINDINGS.MultipleRecallsFound))) {
      const message = GetVehicleRecallSMSMessage(slotValues.VehicleMakeType.resolved, slotValues.VehicleModelType.resolved, slotValues.year.resolved, requestAttributes)
      SERVICES.AMAZON_SNS_API.SendSMS({ message: message, phoneNumber: generalConversationObj.phoneNumber })
    }

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
      .reprompt(`<speak>${speechText}</speak>`)
    //  .withSimpleCard('Reading Recalls')
      .withShouldEndSession(false)
      .getResponse()
  }
}

/**
 * handler makes Alexa read the recall details.
 * @param {*} handlerInput
 * @returns
 */
const ReadVehicleRecallDetailsHandler = {
  handle (handlerInput, userAction) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    // get session variables.
    const vehicleConversationObjFromSession = sessionAttributes[SESSION_KEYS.VehicleConversation]
    const currentIndex = sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]
    // get speech text
    let vehicleConversation = new MODELS.VehicleConversation.Builder({
      requestAttributes: requestAttributes,
      recalls: vehicleConversationObjFromSession.recalls,
      recallsSummaries: vehicleConversationObjFromSession.recallsSummaries,
      currentIndex: currentIndex,
      make: vehicleConversationObjFromSession.make,
      model: vehicleConversationObjFromSession.model,
      year: vehicleConversationObjFromSession.year
    })
      .withIntro(currentIndex === 0 && userAction !== 'undefined' && userAction !== USER_ACTION.RespondedYesToRepeatRecallInfo) // if user responded "yes" to repeating recalls exclude intro portion
      .withDetails(userAction !== USER_ACTION.SaidSkipWhenNoMoreRecallsToLookUp) // if user triggers next intent but no more recalls to be read exclude details portion
      .withFollowUpQuestion(CONVERSATION_CONTEXT.ReadingRecallState)

    const speechText = vehicleConversation.speech()

    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'ReadVehicleRecallHandler'
    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleConversation

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
    //  .withSimpleCard('Reading Recalls')
      .withShouldEndSession(false)
      .getResponse()
  }
}

/**
 * handler moves to current vehicle index plus one.
 * @param {*} handlerInput
 * @returns
 */
const MoveToNextRecallHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'
    sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]++
    const vehicleConversation = new MODELS.VehicleConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    if (typeof (vehicleConversation.recalls[sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]]) === 'undefined') {
      // bring index into range and return to last recall
      // code logic will re-state "that's all the info I have and prompt folow-up question
      sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex] = vehicleConversation.recalls.length - 1

      return ReadVehicleRecallDetailsHandler.handle(handlerInput, USER_ACTION.SaidSkipWhenNoMoreRecallsToLookUp)
    }
    return ReadVehicleRecallDetailsHandler.handle(handlerInput, USER_ACTION.InitiatedSkip)
  }
}

/**
 * handler moves to current vehicle index plus one.
 * @param {*} handlerInput
 * @returns
 */
const MoveToPreviousRecallHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'
    sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]--
    const currentIndex = sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]

    // TODO: add defensive coding to when skip is said when no more recalls exist
    // if (currentIndex === 'undefined') {

    // }

    return ReadVehicleRecallDetailsHandler.handle(handlerInput, USER_ACTION.InitiatedSkip)
  }
}
/**
 * handler directs Alexa to ask FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
 * usage: DRY principle.
 * @param {*} handlerInput
 * @returns
 */
const AskWouldYouLikeToSearchForAnotherRecallHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'GetSearchForAnotherRecallQuestionHandler'
    const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]

    vehicleConversation.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
    const speechText = requestAttributes.t('SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL')
    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleConversation

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

/**
 * handler directs Alexa to ask for make, model and year info.
 * usage: DRY principle.
 * @param {*} handlerInput
 * @returns
 */
const AskTellMeYourMakeHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_TELL_ME_YOUR_MAKE')
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

// TODO: Move this to business service.

/**
 * Gets the recall datails for each recall
 *
 * @param {*} recalls
 * @returns array of recalls
 */
async function GetRecallsDetails (recalls, locale) {
  let recallsDetails = []
  for (let i = 0; i < recalls.length; i++) {
    let details = await SERVICES.TC_RECALLS_API.GetRecallDetails(recalls[i].recallNumber, locale)

    recallsDetails.push(details)
  }
  return recallsDetails
}

/**
 *
 *
 * @param {*} make
 * @param {*} model
 * @param {*} year
 * @param {*} requestAttributes
 * @returns
 */
function GetVehicleRecallSMSMessage (make, model, year, requestAttributes) {
  return requestAttributes.t('VEHICLE_RECALL_TEXT_MESSAGE')
    .replace('%VehicleRecallFromYear%', year)
    .replace('%VehicleRecallToYear%', year)
    .replace('%VehicleRecallMakeId%', VEHICLE_MAKES_ID[make.replace(' ', '-').replace('-', '$').toUpperCase()])
    .replace('%VehicleRecallModel%', model.toUpperCase())
}

module.exports = {
  InProgress: InProgressSearchForVehicleRecallIntentHandler,
  ComfirmedCompleted: ComfirmedCompletedSearchForVehicleRecallIntentHandler,
  DeniedCompleted: DeniedCompletedSearchForVehicleRecallIntentHandler,
  ReadVehicleRecallDetails: ReadVehicleRecallDetailsHandler,
  SearchForAnotherRecallHandler: AskWouldYouLikeToSearchForAnotherRecallHandler,
  SearchForNewVehicleRecallHandler: AskTellMeYourMakeHandler,
  MoveToNextRecallHandler,
  MoveToPreviousRecallHandler,
  AmbigiousHandler
}
