'use strict'

// TODO: double check currentIntentLocation
// TODO: should we always pass user action??
const querystring = require('querystring')

// Constants
const SESSION_KEYS = require('../../constants').SESSION_KEYS
const USER_ACTION = require('../../constants').USER_ACTION
const FOLLOW_UP_QUESTIONS = require('../../constants').FOLLOW_UP_QUESTIONS
const CONVERSATION_CONTEXT = require('../../constants').VEHICLE_CONVERSATION_CONTEXT
const SEARCH_FINDINGS = require('../../constants').VEHICLE_SEARCH_FINDINGS
const VEHICLE_MAKES_ID = require('../../constants').VEHICLE_MAKE_ID
const CONFIG = require('../../config')

const SERVICES = {
  TC_RECALLS_API: require('../../services/transportSafetyRecalls.api'),
  ALEXA_DIRECTIVES_API: require('../../services/alexaDirective.api'),
  AMAZON_SNS_API: require('../../services/amazon.sns.publishsms.api')
}

const Vehicle = require('../../models/vehicleConversation')

const HANDLERS = {
  PhoneNumberHandler: require('./getPhoneNumberHandler')
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
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    let currentRecallIndex = 0 // set to zero, as the current index in the array of recalls
    let speechText

    const vehicleConversation = new Vehicle.VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    // look for recalls based on previously collected slot values.
    let recalls = await SERVICES.TC_RECALLS_API.GetRecalls(vehicleConversation.vehicle.make, vehicleConversation.vehicle.model, vehicleConversation.vehicle.year)
    // get details on the recalls
    let recallsSummaries = await GetRecallsDetails(recalls, handlerInput.requestEnvelope.request.locale)

    // Return findings of search and retrieves the appropriate follow up question
    const VehicleRecallConversation = new Vehicle.ConversationContextBuilder({
      vehicle: vehicleConversation.vehicle,
      requestAttributes: requestAttributes,
      recalls: recalls,
      currentIndex: currentRecallIndex,
      recallsSummaries: recallsSummaries })
      .sayFinding()
      .askFollowUpQuestion({ convoContext: CONVERSATION_CONTEXT.GettingSearchResultFindingsState })
      .build()

    speechText = VehicleRecallConversation.speech()

    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConversation
    sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex] = currentRecallIndex

    if (VehicleRecallConversation.searchFindings === SEARCH_FINDINGS.AmbigiousModelFound) {
      return handlerInput.responseBuilder
        .addElicitSlotDirective('vehicleModel',
          {
            name: 'GetVehicleMakeAndModelIntent',
            confirmationStatus: 'COMPLETED',
            slots: {
              'vehicleMake': {
                'name': 'vehicleMake',
                'value': vehicleConversation.vehicle.makeSpeechText,
                'confirmationStatus': 'NONE'
              }
            } })
        .speak(`<speak>${speechText}</speak>`)
        .reprompt(`<speak>${speechText}</speak>`)
      //  .withSimpleCard('Welcome to Canadian Safety Recalls', 'Recalls have been found')
      //  .withShouldEndSession(false)
        .getResponse()
    }

    // TODO: Get phone number.
    // TODO: CAST for intellisense
    let retrievedPhoneNumber = await HANDLERS.PhoneNumberHandler.PhoneNumberHandler.handle(handlerInput)

    // only send text msg on certain conditions.
    if (retrievedPhoneNumber !== null && (VehicleRecallConversation.searchFindings === SEARCH_FINDINGS.SingleRecallFound || VehicleRecallConversation.searchFindings === SEARCH_FINDINGS.MultipleRecallsFound)) {
      const message = GetVehicleRecallSMSMessage({ vehicle: VehicleRecallConversation.vehicle, recalls: VehicleRecallConversation.recalls, requestAttributes: requestAttributes })
      SERVICES.AMAZON_SNS_API.SendSMS({ message: message, phoneNumber: retrievedPhoneNumber.phoneNumber })
    }

    // TODO: try sending by email instead.

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
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'DeniedCompletedSearchForVehicleRecallIntentHandler'

    const VehicleRecallConversation = new Vehicle.VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    // increment attempt
    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT]++

    if (sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT] === CONFIG.MAX_SEARCH_ATTEMPS) {
      VehicleRecallConversation.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WOULD_YOU_LIKE_HELP
      sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConversation
      const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_SEARCH_MAX_ATTEMPT_REACH')
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
      // .withSimpleCard('Hello World', speechText)
        .getResponse()
    } else {
      return SearchForAnotherRecallHandler.handle(handlerInput)
    }
  }
}

// TODO: ADD guard must come from search before entering into this intent.
/**
 *
 *
 * @param {*} handlerInput
 * @returns
 */
const AmbigiousHandler = {
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const previousVehicleConversation = new Vehicle.VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    let recalls = await SERVICES.TC_RECALLS_API.GetRecalls(previousVehicleConversation.vehicle.make, previousVehicleConversation.vehicle.model, previousVehicleConversation.vehicle.year)

    recalls = recalls.filter(x => {
      return x.modelName.toUpperCase() === previousVehicleConversation.vehicle.model.toUpperCase()
    })

    let recallsSummaries = await GetRecallsDetails(recalls, handlerInput.requestEnvelope.request.locale)

    const VehicleRecallConversation = new Vehicle.ConversationContextBuilder({
      vehicle: previousVehicleConversation.vehicle,
      requestAttributes: requestAttributes,
      recalls: recalls,
      currentIndex: 0,
      recallsSummaries: recallsSummaries })
      .sayFinding({ skipAmbigiousCheck: true })
      .askFollowUpQuestion({ convoContext: CONVERSATION_CONTEXT.GettingSearchResultFindingsState, skipAmbigiousCheck: true })
      .build()

    const speechText = VehicleRecallConversation.speech()
    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConversation
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    let retrievedPhoneNumber = await HANDLERS.PhoneNumberHandler.phoneNumber.handle(handlerInput)

    if (retrievedPhoneNumber !== null && (VehicleRecallConversation.searchFindings === SEARCH_FINDINGS.SingleRecallFound || VehicleRecallConversation.searchFindings === SEARCH_FINDINGS.MultipleRecallsFound)) {
      const message = GetVehicleRecallSMSMessage({ vehicle: VehicleRecallConversation.vehicle, recalls: VehicleRecallConversation.recalls, requestAttributes: requestAttributes })
      SERVICES.AMAZON_SNS_API.SendSMS({ message: message, phoneNumber: retrievedPhoneNumber.phoneNumber })
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
    const previousVehicleConversation = new Vehicle.VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])
    const currentIndex = sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]

    // get speech text
    const VehicleRecallConversation = new Vehicle.ConversationContextBuilder({
      vehicle: previousVehicleConversation.vehicle,
      requestAttributes: requestAttributes,
      recalls: previousVehicleConversation.recalls,
      currentIndex: currentIndex,
      recallsSummaries: previousVehicleConversation.recallsSummaries })
      .sayIntroIntructionsBeforeReadingRecallDescription({
        omitSpeech: currentIndex !== 0 || // include intro only if the first recall is being read
        userAction === USER_ACTION.RespondedYesToRepeatRecallInfo || // do not include intro if the user responds yes to repeating the recalls information
        userAction === USER_ACTION.SaidSkipWhenNoMoreRecallsToLookUp }) // do not include intro if the user trigger next intent (skip, next) and no more recalls are found
      .sayRecallDescription({ omitSpeech: userAction === USER_ACTION.SaidSkipWhenNoMoreRecallsToLookUp })
      .askFollowUpQuestion({ convoContext: CONVERSATION_CONTEXT.ReadingRecallState })
      .build()

    const speechText = VehicleRecallConversation.speech()

    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'ReadVehicleRecallHandler'
    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConversation

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

    const vehicleConversation = new Vehicle.VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

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
const SearchForAnotherRecallHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    const vehicleConversation = new Vehicle.VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    vehicleConversation.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
    const speechText = requestAttributes.t('SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL')

    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleConversation
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'GetSearchForAnotherRecallQuestionHandler'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)

      // .reprompt(speechText)
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
const UpdateToGetVehicleMakeAndModelIntent = {
  handle (handlerInput) {
    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'GetVehicleMakeAndModelIntent',
        confirmationStatus: 'NONE',
        slots: {}
      })
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

function GetSearchResultURL ({ makeId, model, year }) {
  //  http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&mk=${MAKE_ID}&md=${MODEL}&fy=${FROM_YEAR}&ty=${TO_YEAR}&ft=&ls=0&sy=0
  return querystring.stringify({
    mk: makeId,
    md: model,
    fy: year,
    ty: year
  })
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

function GetVehicleRecallSMSMessage ({ vehicle, recalls, requestAttributes }) {
  const queryString = GetSearchResultURL({
    makeId: VEHICLE_MAKES_ID[vehicle.make.replace(' ', '-').replace('-', '$').toUpperCase()],
    model: vehicle.model.toUpperCase(),
    year: vehicle.year })

  return requestAttributes.t('VEHICLE_RECALL_TEXT_MESSAGE')
    .replace('%QueryString%', queryString)
    .replace('%VehicleRecallYear%', vehicle.year)
    .replace('%VehicleRecallMake%', vehicle.make)
    .replace('%VehicleRecallModel%', vehicle.model)
    .replace('%RecallCount%', recalls.length)

}

//

module.exports = {
  ComfirmedCompleted: ComfirmedCompletedSearchForVehicleRecallIntentHandler,
  DeniedCompleted: DeniedCompletedSearchForVehicleRecallIntentHandler,
  ReadVehicleRecallDetails: ReadVehicleRecallDetailsHandler,
  SearchForAnotherRecallHandler,
  SearchForNewVehicleRecallHandler: UpdateToGetVehicleMakeAndModelIntent,
  MoveToNextRecallHandler,
  MoveToPreviousRecallHandler,
  AmbigiousHandler
}
