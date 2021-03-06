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
const API_SEARCH_RESULT = require('../../constants').API_SEARCH_RESULT
const HELPER = require('../../utils/helper')

const VehicleRecallConversation = require('../../models/vehicleRecallConversation').VehicleRecallConversation
const VehicleConversationContextBuilder = require('../../models/vehicleRecallConversation').ConversationContextBuilder
const ApiPerformanceLog = require('../../models/apiPerformanceLog').ApiPerformanceLog

const SERVICES = {
  TC_RECALLS_API: require('../../services/vehicleRecalls.api'),
  ALEXA_DIRECTIVES_API: require('../../services/alexaDirective.api'),
  AMAZON_SNS_API: require('../../services/amazon.sns.api'),
  ALEXA_PROFILE_API: require('../../services/alexaProfile.api')
}

class IsSuccessLog {
  constructor ({ sessionId, makeModelYearIsVerified, targetedVehicle, isAmbiguous, otherModels }) {
    this.sessionId = sessionId
    this.makeModelYearIsVerified = makeModelYearIsVerified
    this.vehicle = targetedVehicle
    this.isAmbiguous = isAmbiguous
    this.otherModels = otherModels
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
  async handle (handlerInput) {
    const { attributesManager, requestEnvelope } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionId = requestEnvelope.session.sessionId
    const currentRecallIndex = 0 // set to zero, as the current index in the array of recalls

    // get vehicle recall conversation started from the comfirmation dialog created in the "comfirmVehicleMakeModelYearHandler"
    const vehicleRecallConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    // for stats

    // look for recalls based on previously collected slot values.
    const recalls = await SERVICES.TC_RECALLS_API.GetRecalls(vehicleRecallConversation.vehicle.make, vehicleRecallConversation.vehicle.model, vehicleRecallConversation.vehicle.year, sessionId)

    const recallsDetails = await GetRecallsListWithDetails(recalls, handlerInput.requestEnvelope.request.locale, sessionId)

    // Return findings of search and retrieves the appropriate follow up question
    const VehicleRecallConvo = new VehicleConversationContextBuilder({
      vehicle: vehicleRecallConversation.vehicle,
      requestAttributes: requestAttributes,
      currentRecallIndex: currentRecallIndex,
      recalls: recalls,
      recallsDetails: recallsDetails })
      .saySearchFinding()
      .askFollowUpQuestion({ convoContext: CONVERSATION_CONTEXT.GettingSearchResultFindingsState, userPhoneNumber: sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER] })
      .buildSpeech()

    console.log(new IsSuccessLog({ sessionId: sessionId, makeModelYearIsVerified: true, targetedVehicle: vehicleRecallConversation.vehicle, isAmbiguous: VehicleRecallConvo.searchFindings === SEARCH_FINDINGS.AmbigiousModelFound, recalls: VehicleRecallConvo.recalls }))

    SendMessageToUser(sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER], VehicleRecallConvo.searchFindings, requestAttributes, VehicleRecallConvo)

    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConvo
    sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex] = currentRecallIndex
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    HELPER.SetTrace({
      handlerName: 'ComfirmedCompletedSearchForVehicleRecallIntentHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    const speechText = VehicleRecallConvo.getSpeechText()
    const cardText = VehicleRecallConvo.getCardText()
      .replace('%VehicleRecallMake%', vehicleRecallConversation.vehicle.make)
      .replace('%VehicleRecallModel%', vehicleRecallConversation.vehicle.model)
      .replace('%VehicleRecallYear%', vehicleRecallConversation.vehicle.year)

    const cardTitle = requestAttributes.t('CARD_TXT_VEHICLE_RECALLS_SEARCH_RESULT_TITLE')


    // dont show permission card if the search is not complete.
    // when result is ambigious, the user must state which model before sms is attempted to be sent, therefore the permission card (if applicable is not required) 
    if (VehicleRecallConvo.searchFindings === SEARCH_FINDINGS.AmbigiousModelFound)
    {
      return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
      .reprompt(`<speak>${speechText}</speak>`)
      .withSimpleCard(cardTitle, cardText)
      .withShouldEndSession(false)
      .getResponse()
    }
    
    // displays permission card if applicable.
    switch (sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER].apiRetrievalResult) {
      case API_SEARCH_RESULT.Found:
        return handlerInput.responseBuilder
          .speak(`<speak>${speechText}</speak>`)
          .reprompt(`<speak>${speechText}</speak>`)
          .withSimpleCard(cardTitle, cardText)
          .withShouldEndSession(false)
          .getResponse()
      case API_SEARCH_RESULT.NoPermission:

        return handlerInput.responseBuilder
          .speak(`<speak>${speechText}</speak>`)
          .reprompt(`<speak>${speechText}</speak>`)
        // .withSimpleCard(cardTitle, cardText)
          .withShouldEndSession(false)
          .withAskForPermissionsConsentCard(SERVICES.ALEXA_PROFILE_API.PERMISSIONS)
          .getResponse()
      case API_SEARCH_RESULT.NotFound:
        return handlerInput.responseBuilder
          .speak(`<speak>${speechText}</speak>`)
          .reprompt(`<speak>${speechText}</speak>`)
          .withSimpleCard(cardTitle, cardText)
          .withShouldEndSession(false)
          .getResponse()
      case API_SEARCH_RESULT.Error:
        return handlerInput.responseBuilder
          .speak(`<speak>${speechText}</speak>`)
          .reprompt(`<speak>${speechText}</speak>`)
          .withSimpleCard(cardTitle, cardText)
          .withShouldEndSession(false)
          .getResponse()
      default:
        break
    }
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
    const { attributesManager, requestEnvelope } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const sessionId = requestEnvelope.session.sessionId

    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'DeniedCompletedSearchForVehicleRecallIntentHandler'

    HELPER.SetTrace({
      handlerName: 'DeniedCompletedSearchForVehicleRecallIntentHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    const vehicleRecallConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    // for stats
    console.log(new IsSuccessLog({ sessionId: sessionId, makeModelYearIsVerified: false, targetedVehicle: vehicleRecallConversation.vehicle, isAmbiguous: false, recalls: null }))

    // increment attempt
    sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT]++

    if (sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT] === CONFIG.MAX_SEARCH_ATTEMPS) {
      vehicleRecallConversation.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WOULD_YOU_LIKE_HELP
      sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleRecallConversation
      sessionAttributes[SESSION_KEYS.VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT] = 0 // reset max attempt
      const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_ERROR_SEARCH_MAX_ATTEMPT_REACH')

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse()
    } else {
      return SearchAgainRecallHandler.handle(handlerInput)
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
    const { attributesManager, requestEnvelope } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionId = requestEnvelope.session.sessionId

    const currentRecallIndex = 0 // set to zero, as the current index in the array of recalls

    const vehicleRecallConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    let recalls = await SERVICES.TC_RECALLS_API.GetRecalls(vehicleRecallConversation.vehicle.make, vehicleRecallConversation.vehicle.model, vehicleRecallConversation.vehicle.year, sessionId)
    recalls = recalls.filter(x => {
      return x.modelName.toUpperCase() === vehicleRecallConversation.vehicle.model.toUpperCase()
    })

    const recallsDetails = await GetRecallsListWithDetails(recalls, handlerInput.requestEnvelope.request.locale, sessionId)

    const VehicleRecallConvo = new VehicleConversationContextBuilder({
      vehicle: vehicleRecallConversation.vehicle,
      requestAttributes: requestAttributes,
      currentRecallIndex: currentRecallIndex,
      recalls: recalls,
      recallsDetails: recallsDetails })
      .saySearchFinding({ skipAmbigiousCheck: true })
      .askFollowUpQuestion({ convoContext: CONVERSATION_CONTEXT.GettingSearchResultFindingsState, userPhoneNumber: sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER], skipAmbigiousCheck: true })
      .buildSpeech()

    SendMessageToUser(sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER], VehicleRecallConvo.searchFindings, requestAttributes, VehicleRecallConvo)

    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConvo
    sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex] = currentRecallIndex
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    HELPER.SetTrace({
      handlerName: 'AmbigiousHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    const speechText = VehicleRecallConvo.getSpeechText()
    const cardText = VehicleRecallConvo.getCardText()
      .replace('%VehicleRecallMake%', vehicleRecallConversation.vehicle.make)
      .replace('%VehicleRecallModel%', vehicleRecallConversation.vehicle.model)
      .replace('%VehicleRecallYear%', vehicleRecallConversation.vehicle.year)

    const cardTitle = requestAttributes.t('CARD_TXT_VEHICLE_RECALLS_SEARCH_RESULT_TITLE')
   // displays permission card if applicable.
   switch (sessionAttributes[SESSION_KEYS.USER_PHONE_NUMBER].apiRetrievalResult) {
    case API_SEARCH_RESULT.Found:
      return handlerInput.responseBuilder
        .speak(`<speak>${speechText}</speak>`)
        .reprompt(`<speak>${speechText}</speak>`)
        .withSimpleCard(cardTitle, cardText)
        .withShouldEndSession(false)
        .getResponse()
    case API_SEARCH_RESULT.NoPermission:

      return handlerInput.responseBuilder
        .speak(`<speak>${speechText}</speak>`)
        .reprompt(`<speak>${speechText}</speak>`)
      // .withSimpleCard(cardTitle, cardText)
        .withShouldEndSession(false)
        .withAskForPermissionsConsentCard(SERVICES.ALEXA_PROFILE_API.PERMISSIONS)
        .getResponse()
    case API_SEARCH_RESULT.NotFound:
      return handlerInput.responseBuilder
        .speak(`<speak>${speechText}</speak>`)
        .reprompt(`<speak>${speechText}</speak>`)
        .withSimpleCard(cardTitle, cardText)
        .withShouldEndSession(false)
        .getResponse()
    case API_SEARCH_RESULT.Error:
      return handlerInput.responseBuilder
        .speak(`<speak>${speechText}</speak>`)
        .reprompt(`<speak>${speechText}</speak>`)
        .withSimpleCard(cardTitle, cardText)
        .withShouldEndSession(false)
        .getResponse()
    default:
      break
  }
  }
}

/**
 * handler makes Alexa read the recall details.
 * @param {*} handlerInput
 * @returns
 */
const ReadVehicleRecallDetailsHandler = {
  async handle (handlerInput, userAction) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    // get session variables.
    const vehicleRecallConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])
    const currentRecallIndex = sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]

    // get speech text
    const VehicleRecallConvo = new VehicleConversationContextBuilder({
      vehicle: vehicleRecallConversation.vehicle,
      requestAttributes: requestAttributes,
      currentRecallIndex: currentRecallIndex,
      recalls: vehicleRecallConversation.recalls,
      recallsDetails: vehicleRecallConversation.recallsDetails })
      .sayIntroIntructionsBeforeReadingRecallDescription({
        omitSpeech: currentRecallIndex !== 0 || // include intro only if the first recall is being read
        userAction === USER_ACTION.RespondedYesToRepeatRecallInfo || // do not include intro if the user responds yes to repeating the recalls information
        userAction === USER_ACTION.SaidNextWhenNoMoreRecallsToLookUp || // do not include intro if the user trigger next intent (skip, next) and no more recalls are found
        vehicleRecallConversation.recalls.length === 1 }) // if only one recall, do not include intructions, command to say skip
      .sayRecallDescription({ currentIndex: currentRecallIndex, omitSpeech: userAction === USER_ACTION.SaidNextWhenNoMoreRecallsToLookUp })
      .askFollowUpQuestion({ convoContext: CONVERSATION_CONTEXT.ReadingRecallState, currentRecallIndex: currentRecallIndex })
      .buildSpeech()

    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'ReadVehicleRecallHandler'
    sessionAttributes[SESSION_KEYS.VehicleConversation] = VehicleRecallConvo

    HELPER.SetTrace({
      handlerName: 'ReadVehicleRecallDetailsHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    const speechText = VehicleRecallConvo.getSpeechText()
    const cardText = VehicleRecallConvo.getCardText()
    const cardTitle = requestAttributes.t('CARD_TXT_VEHICLE_RECALLS_QUERY_DETAILS_TITLE')
      .replace('%VehicleRecallMake%', vehicleRecallConversation.vehicle.make)
      .replace('%VehicleRecallModel%', vehicleRecallConversation.vehicle.model)
      .replace('%VehicleRecallYear%', vehicleRecallConversation.vehicle.year)
      .replace('%VehicleRecallComponent%', vehicleRecallConversation.recallsDetails[currentRecallIndex].componentType)

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
      .withSimpleCard(cardTitle, cardText)
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
    const requestAttributes = attributesManager.getRequestAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]++
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    const vehicleConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    HELPER.SetTrace({
      handlerName: 'MoveToNextRecallHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    if (typeof (vehicleConversation.recalls[sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]]) === 'undefined') {
      // bring index into range and return to last recall
      // code logic will re-state "that's all the info I have and prompt folow-up question
      sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex] = vehicleConversation.recalls.length - 1

      return ReadVehicleRecallDetailsHandler.handle(handlerInput, USER_ACTION.SaidNextWhenNoMoreRecallsToLookUp)
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
    const requestAttributes = attributesManager.getRequestAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]--
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForVehicleRecallIntent'

    const vehicleConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    HELPER.SetTrace({
      handlerName: 'MoveToPreviousRecallHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    if (typeof (vehicleConversation.recalls[sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex]]) === 'undefined') {
      // bring index into range and return to first recall
      // code logic will re-state "that's all the info I have and prompt folow-up question
      sessionAttributes[SESSION_KEYS.VehicleCurrentRecallIndex] = 0

      return ReadVehicleRecallDetailsHandler.handle(handlerInput, USER_ACTION.SaidPreviousWhenNoMoreRecallsToLookUp)
    }
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

    const vehicleConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    vehicleConversation.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
    const speechText = requestAttributes.t('SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL')

    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleConversation
    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchForAnotherRecallHandler'

    HELPER.SetTrace({
      handlerName: 'SearchForAnotherRecallHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
      .withShouldEndSession(false)

      // .reprompt(speechText)
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const SearchAgainRecallHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    const vehicleRecallConversation = new VehicleRecallConversation(sessionAttributes[SESSION_KEYS.VehicleConversation])

    vehicleRecallConversation.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToTryAndSearchAgain

    const speechText = requestAttributes.t('SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN')

    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleRecallConversation

    HELPER.SetTrace({
      handlerName: 'SearchAgainRecallHandler',
      sessionAttributes: sessionAttributes,
      requestAttributes: requestAttributes })

    sessionAttributes[SESSION_KEYS.CurrentIntentLocation] = 'SearchAgainRecallHandler'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse()
  }
}

async function SendMessageToUser (profilePhoneNumber, recallSearchResult, requestAttributes, vehicleRecallConversation) {
  if ((
    recallSearchResult === SEARCH_FINDINGS.SingleRecallFound ||
    recallSearchResult === SEARCH_FINDINGS.MultipleRecallsFound ||
    recallSearchResult === SEARCH_FINDINGS.NoRecallsFound)) {
    const message = GetVehicleRecallSMSMessage({ vehicle: vehicleRecallConversation.vehicle, recalls: vehicleRecallConversation.recalls, requestAttributes: requestAttributes })

    // stop the process early if unit testing, unable to mock profile phone number retrieval and SNS API through bespoken test framework
    if (process.env.UNIT_TEST) {
      return
    }

    // if phone number found, send text message.
    if (profilePhoneNumber.apiRetrievalResult === API_SEARCH_RESULT.Found) {
      // no need to await as will have to wait for response which adds to total execution time
      SERVICES.AMAZON_SNS_API.SendSMS({ message: message, phoneNumber: profilePhoneNumber.phoneNumber })
    }
  }
}

async function GetRecallsListWithDetails (recalls, locale, sessionId) {
  const apiStart = (new Date()).getTime()

  const recallsDetails = []
  for (let i = 0; i < recalls.length; i++) {
    const details = await SERVICES.TC_RECALLS_API.GetRecallDetails(recalls[i].recallNumber, locale, sessionId)

    recallsDetails.push(details)
  }
  const apiEnd = (new Date()).getTime()

  console.log(new ApiPerformanceLog({ sessionId: sessionId, measuring: 'GetRecallsListWithDetails Total Execution Time', executionTimeMilliSeconds: apiEnd - apiStart, notes: 'measures time it takes to retrieve a list of recalls with details info, multiple API calls required.' }))

  const relevantRecalls = recallsDetails.filter(x => {
    return (!CONFIG.IGNORE_RECALLS_TYPE.includes(x.notificationTypeEtxt.toUpperCase()))
  })
  return relevantRecalls
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

  if (recalls.length > 1) {
    return requestAttributes.t('VEHICLE_RECALL_TEXT_FOUND_MULTIPLE_MESSAGE')
      .replace('%QueryString%', queryString)
      .replace('%VehicleRecallYear%', vehicle.year)
      .replace('%VehicleRecallMake%', vehicle.make)
      .replace('%VehicleRecallModel%', vehicle.model)
      .replace('%RecallCount%', recalls.length)
  } else if (recalls.length === 1) {
    return requestAttributes.t('VEHICLE_RECALL_TEXT_FOUND_ONE_MESSAGE')
      .replace('%QueryString%', queryString)
      .replace('%VehicleRecallYear%', vehicle.year)
      .replace('%VehicleRecallMake%', vehicle.make)
      .replace('%VehicleRecallModel%', vehicle.model)
      .replace('%RecallCount%', recalls.length)
  } else if (recalls.length === 0) {
    return requestAttributes.t('VEHICLE_RECALL_TEXT_FOUND_NONE_MESSAGE')
      .replace('%QueryString%', queryString)
      .replace('%VehicleRecallYear%', vehicle.year)
      .replace('%VehicleRecallMake%', vehicle.make)
      .replace('%VehicleRecallModel%', vehicle.model)
      .replace('%RecallCount%', recalls.length)
  }
}

//

module.exports = {
  ComfirmedCompleted: ComfirmedCompletedSearchForVehicleRecallIntentHandler,
  DeniedCompleted: DeniedCompletedSearchForVehicleRecallIntentHandler,
  ReadVehicleRecallDetails: ReadVehicleRecallDetailsHandler,
  SearchForAnotherRecallHandler,
  MoveToNextRecallHandler,
  MoveToPreviousRecallHandler,
  AmbigiousHandler
}
