'use strict'

// TODO: install flow for some strong typing
// TODO: Add linter

const RECALL_API = require('../../services/TCSafetyRecalls.api')
const HELPER = require('../../utils/Helper')
const SESSION_KEYS = require('../../Constants').sessionKeys
const USER_ACTION = require('../../Constants').userAction
const SearchVehicleRecallIntentYesNoQuestions = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions
const CONVERSATION_CONTEXT = require('../../Constants').VehicleConversationContext
const SEARCH_FINDINGS = require('../../Constants').VehicleSearchFindings

const PR_DIRECTIVES = require('../../services/AlexaDirective.api')
const AmazonSNS = require('../../services/AmazonSNS')
const Conversation = require('../../models/conversation')

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

    let speechText = requestAttributes.t('VEHICLE_RECALLS_TRY_SEARCH_AGAIN')
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'DeniedCompletedSearchForVehicleRecallIntentHandler'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    // .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const GetSearchForAnotherRecallQuestionHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'GetSearchForAnotherRecallQuestionHandler'
    const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]

    vehicleConversation.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToSearchForAnotherRecall
    const speechText = requestAttributes.t('VEHCILE_RECALLS_LOOK_FOR_ANOTHER_RECALL')
    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleConversation

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const MoveToNextRecallHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'SearchForVehicleRecallIntent'
    sessionAttributes[SESSION_KEYS.CurrentRecallIndex]++
    const currentIndex = sessionAttributes[SESSION_KEYS.CurrentRecallIndex]

    // TODO: add defensive coding to when skip is said when no more recalls exist
    if (currentIndex === 'undefined') {
      console.log('skip out not working')
    }

    return ReadVehicleRecallHandler.handle(handlerInput, USER_ACTION.InitiatedSkip)
  }
}

const SearchForNewVehicleRecallHandler = {
  handle (handlerInput) {
    const { attributesManager } = handlerInput
    const requestAttributes = attributesManager.getRequestAttributes()
    const sessionAttributes = attributesManager.getSessionAttributes()

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'SearchForVehicleRecallIntent'

    const speechText = requestAttributes.t('TELL_ME_YOUR_MAKE')
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
    //  .withSimpleCard('Hello World', speechText)
      .getResponse()
  }
}

const ResolveAmbigiousVehicleModelHandler = {
  async handle (handlerInput) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    // get session variables.
    const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]

    let recalls = await RECALL_API.GetRecalls(vehicleConversation.make, vehicleConversation.model, vehicleConversation.year)
    let recallsSummaries = await GetRecallsDetails(recalls)

    const convoObj = new Conversation(sessionAttributes[SESSION_KEYS.Conversation])

    let vehicleSpeek = new VehicleRecallSpeakText.Builder({
      requestAttributes: requestAttributes,
      year: vehicleConversation.year,
      make: vehicleConversation.make,
      model: vehicleConversation.model,
      recalls: recalls,
      currentIndex: 0,
      recallsSummaries: recallsSummaries
    })
      .withConversation(convoObj)
      .withFindings()
      .withFollowUpQuestion(CONVERSATION_CONTEXT.GettingSearchResultFindingsState)
      .withUserAction(USER_ACTION.ResolvingAmbiguousModel)

    const speechText = vehicleSpeek.speech()

    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'SearchForVehicleRecallIntent'
    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleSpeek

    if ((convoObj.sendSMS && (vehicleSpeek.searchFindings === SEARCH_FINDINGS.SingleRecallFound || vehicleSpeek.searchFindings === SEARCH_FINDINGS.MultipleRecallsFound))) {
      AmazonSNS.SendSMS({ phoneNumber: convoObj.phoneNumber })
    }

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
    //  .withSimpleCard('Reading Recalls')
      .withShouldEndSession(false)
      .getResponse()
  }
}

const ReadVehicleRecallHandler = {
  handle (handlerInput, userAction) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    // get session variables.
    const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]
    const currentIndex = sessionAttributes[SESSION_KEYS.CurrentRecallIndex]
    // get speech text
    let vehicleSpeek = new VehicleRecallSpeakText.Builder({
      requestAttributes: requestAttributes,
      recalls: vehicleConversation.recalls,
      recallsSummaries: vehicleConversation.recallsSummaries,
      currentIndex: currentIndex,
      make: vehicleConversation.make,
      model: vehicleConversation.model,
      year: vehicleConversation.year
    })
      .withIntro(currentIndex === 0 && userAction !== 'undefined' && userAction !== USER_ACTION.RespondedYesToRepeatRecallInfo)
      .withDetails()
      .withFollowUpQuestion(CONVERSATION_CONTEXT.ReadingRecallState)

    const speechText = vehicleSpeek.speech()

    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'ReadVehicleRecallHandler'
    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleSpeek

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
    //  .withSimpleCard('Reading Recalls')
      .withShouldEndSession(false)
      .getResponse()
  }
}

const ComfirmedCompletedSearchForVehicleRecallIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SearchForVehicleRecallIntent' &&
      handlerInput.requestEnvelope.request.dialogState === 'COMPLETED' &&
      handlerInput.requestEnvelope.request.intent.confirmationStatus === 'CONFIRMED'
  },
  async handle (handlerInput, userAction) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    const requestAttributes = attributesManager.getRequestAttributes()

    const requestId = handlerInput.requestEnvelope.request.requestId

    // send progresive response, call Alexa API and send directive.
    try {
      const directive = {
        header: {
          requestId
        },
        directive: {
          type: 'VoicePlayer.Speak',
          speech: requestAttributes.t('VEHICLE_IN_PROGRESS_SEARCHING_MSG_1')
        }
      }
      await PR_DIRECTIVES.callDirectiveService(handlerInput, directive)
    } catch (err) {
      // if it failed we can continue, just the user will wait longer for first response
      console.log('error: ' + err)
    }

    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'SearchForVehicleRecallIntent'

    // default user action to initiated vehicle recall search
    // userAction = (typeof userAction === 'undefined') ? USER_ACTION.InitiatedRecallSearch : userAction
    userAction = userAction || USER_ACTION.InitiatedRecallSearch
    let currentRecallIndex = 0
    let speechText
    let vehicleSpeek = null

    // collect slot values
    const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)
    const recallRequestDTO = {
      year: slotValues.year.resolved,
      make: slotValues.VehicleMakeType.resolved,
      model: slotValues.VehicleModelType.resolved
    }

    let recalls = await RECALL_API.GetRecalls(recallRequestDTO.make, recallRequestDTO.model, recallRequestDTO.year)
    let recallsSummaries = await GetRecallsDetails(recalls)

    const convoObj = new Conversation(sessionAttributes[SESSION_KEYS.Conversation])

    // Return findings
    vehicleSpeek = new VehicleRecallSpeakText.Builder({
      requestAttributes: requestAttributes,
      year: slotValues.year.resolved,
      make: slotValues.VehicleMakeType.resolved,
      model: slotValues.VehicleModelType.resolved,
      recalls: recalls,
      currentIndex: currentRecallIndex,
      recallsSummaries: recallsSummaries
    })
      .withConversation(convoObj)
      .withFindings()
      .withFollowUpQuestion(CONVERSATION_CONTEXT.GettingSearchResultFindingsState)
      .withUserAction()

    speechText = vehicleSpeek.speech()

    sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleSpeek

    sessionAttributes[SESSION_KEYS.CurrentRecallIndex] = currentRecallIndex

    if ((convoObj.sendSMS && (vehicleSpeek.searchFindings === SEARCH_FINDINGS.SingleRecallFound || vehicleSpeek.searchFindings === SEARCH_FINDINGS.MultipleRecallsFound))) {
      AmazonSNS.SendSMS({ phoneNumber: convoObj.phoneNumber })
    }

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
    //  .withSimpleCard('Welcome to Canadian Safety Recalls', 'Recalls have been found')
      .withShouldEndSession(false)
      .getResponse()
  }
}

function hasSimilarModelsAffectedByRecall (recalls, targetedModelName) {
  let similarModelCount = 0
  for (let index = 0; index < recalls.length; index++) {
    if (recalls[index].modelName.includes(targetedModelName)) {
      similarModelCount++
    }
  }

  if (similarModelCount > 1) {
    return true
  }
  return false
}

function BuildSimilarModelsString (recalls, targetedModelName) {
  if (Array.isArray(recalls)) {
    let similarModels = []

    for (let index = 0; index < recalls.length; index++) {
      if (recalls[index].modelName.includes(targetedModelName)) {
        similarModels.push(recalls[index].modelName)
      }
    }

    let uniqueModels = [...new Set(similarModels)]

    return `${uniqueModels.slice(0, -1).join(', ')}${(uniqueModels.length > 1 ? ' or ' : '')}${uniqueModels.slice(-1)[0]}`
  }
}

// TODO: Move this to business service.
async function GetRecallsDetails (recalls) {
  console.log('function: GetRecalls')

  let recallsDetails = []
  // get
  for (let i = 0; i < recalls.length; i++) {
    let details = await RECALL_API.GetRecallDetails(recalls[i].recallNumber)

    recallsDetails.push(details)
  }
  return recallsDetails
}

class VehicleRecallSpeakText {
  constructor () {
    this.result = ''
    this.overview = ''
    this.description = ''
    this.followUpQuestion = ''
    this.followUpQuestionEnum = null
    this.hasfollowUpQuestion = false

    this.year = ''
    this.make = ''
    this.model = ''
    this.recalls = []
    this.currentIndex = 0
  }

  static get Builder () {
    class Builder {
      constructor ({ year, make, model, recalls, recallsSummaries, currentIndex, requestAttributes }) {
        this.year = year
        this.make = make
        this.model = model
        this.recallsSummaries = recallsSummaries
        this.recalls = recalls
        this.currentIndex = currentIndex
        this.followUpQuestion = ''
        this.followUpQuestionEnum = null
        this.hasfindings = false
        this.hasOverviewText = false
        this.hasdetails = false
        this.hasfollowUpQuestion = false
        this.requestAttributes = requestAttributes
        this.userAction = false
        this.searchFindings = SEARCH_FINDINGS.SearchNotConducted
        this.conversation = null
      }

      withConversation (conversation) {
        this.conversation = conversation
        return this
      }

      withFindings () {
        if (this.recalls.length === 0) {
          this.searchFindings = SEARCH_FINDINGS.NoRecallsFound
          this.findings = this.requestAttributes.t(`VEHICLE_RECALLS_FOUND_NONE`)
        } else {
          if (hasSimilarModelsAffectedByRecall(this.recalls, this.model) &&
               (this.userAction !== 'undefined' && this.userAction !== USER_ACTION.ResolvingAmbiguousModel)) {
            this.searchFindings = SEARCH_FINDINGS.AmbigiousModelFound
            this.findings = this.requestAttributes.t(`VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL`)
              .replace('%VehicleRecallYear%', this.year)
              .replace('%VehicleRecallMake%', this.make)
              .replace('%VehicleRecallModel%', this.model)
          } else {
            if (this.recalls.length === 1) {
              this.searchFindings = SEARCH_FINDINGS.SingleRecallFound
              this.findings = this.requestAttributes.t(`VEHICLE_RECALLS_FOUND_ONE`)
                .replace('%VehicleRecallYear%', this.year)
                .replace('%VehicleRecallMake%', this.make)
                .replace('%VehicleRecallModel%', this.model)
                .replace('%SentSMSMsg%', this.conversation.sendSMS ? this.requestAttributes.t(`VEHICLE_RECALLS_SENT_SMS`) : '')
            } else if (this.recalls.length > 1) {
              this.searchFindings = SEARCH_FINDINGS.MultipleRecallsFound
              this.findings = this.requestAttributes.t(`VEHICLE_RECALLS_FOUND_MULTIPLE`)
                .replace('%RecallCount%', this.recalls.length)
                .replace('%VehicleRecallYear%', this.year)
                .replace('%VehicleRecallMake%', this.make)
                .replace('%VehicleRecallModel%', this.model)
                .replace('%SentSMSMsg%', this.conversation.sendSMS ? this.requestAttributes.t(`VEHICLE_RECALLS_SENT_SMS`) : '')
            } else if (this.recalls.length > 99999) {
              this.searchFindings = SEARCH_FINDINGS.NonValidModelFound
              this.findings = this.requestAttributes.t(`VEHICLE_RECALLS_FOUND_NON_VALID`)
                .replace('%VehicleRecallYear%', this.year)
                .replace('%VehicleRecallMake%', this.make)
                .replace('%VehicleRecallModel%', this.model)
            }
          }
        }

        console.log(this.findings)
        this.hasfindings = true
        return this
      }
      withIntro (includeIntro) {
        if (includeIntro) {
          this.overview = this.requestAttributes.t(`VEHICLE_RECALL_READING_INTRO_USAGE`)
          this.hasOverviewText = true
        }
        return this
      }
      withDetails () {
        if (this.recalls.length > 0) {
          this.details = this.requestAttributes.t(`VEHICLE_DETAILS_MSG`)
            .replace('%VehicleRecallDate%', this.recallsSummaries[this.currentIndex].recallDate)
            .replace('%VehicleRecallComponent%', this.recallsSummaries[this.currentIndex].componentType)
            .replace('%VehicleRecallDetails%', this.recallsSummaries[this.currentIndex].description)

          this.hasdetails = true
        }
        return this
      }
      withFollowUpQuestion (convoContext) {
        switch (convoContext) {
          case CONVERSATION_CONTEXT.ReadingRecallState:
            if (this.recalls.length !== 0) {
              if (this.currentIndex === this.recalls.length - 1) {
                this.followUpQuestion = this.requestAttributes
                  .t(`VEHICLE_RECALLS_END_MSG`)
                  .replace('%VehicleRecallYear%', this.year)
                  .replace('%VehicleRecallMake%', this.make)
                  .replace('%VehicleRecallModel%', this.model)
                this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeTheRecallInformationRepeated
              } else {
                this.followUpQuestion = this.requestAttributes.t(`VEHCILE_RECALLS_FOLLOW_UP_QUESTION_LISTEN_TO_NEXT_RECALL_MSG`)
                this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToHearTheNextRecall
              }
            } else {
              this.followUpQuestion = this.requestAttributes.t(`VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE`)
              this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToSearchForAnotherRecall
            }
            break
          case CONVERSATION_CONTEXT.GettingSearchResultFindingsState:

            if (this.recalls.length === 0) {
              this.followUpQuestion = this.requestAttributes.t(`VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE`)
              this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToSearchForAnotherRecall
            } else {
              if (hasSimilarModelsAffectedByRecall(this.recalls, this.model) &&
               (this.userAction !== 'undefined' && this.userAction !== USER_ACTION.ResolvingAmbiguousModel)) {
                this.followUpQuestion = this.requestAttributes
                  .t(`VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL`)
                  .replace('%AmbigiousModelsList%', BuildSimilarModelsString(this.recalls, this.model))
                this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.IsItModelAOrModelB
              } else {
                if (this.recalls.length === 1) {
                  this.followUpQuestion = this.requestAttributes.t(`VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE`)
                  this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToMeReadTheRecall
                } else if (this.recalls.length > 1) {
                  this.followUpQuestion = this.requestAttributes.t(`VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE`)
                  this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToMeReadTheRecall
                } else if (this.recalls.length > 99999) {
                  this.followUpQuestion = this.requestAttributes.t(`VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NON_VALID`)
                  this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToSearchForAnotherRecall
                }
              }
            }
            break
          default:
            break
        }

        this.hasfollowUpQuestion = true
        console.log(this.followUpQuestion)
        return this
      }

      withUserAction (userAction) {
        this.userAction = userAction
        return this
      }

      speech () {
        console.log('speech', this.findings + this.overview + this.details + this.followUpQuestion)

        let msg = ''
        if (this.hasfindings) {
          msg += this.findings
        }
        if (this.hasOverviewText) {
          msg += this.overview
        }
        if (this.hasdetails) {
          msg += this.details
        }
        if (this.hasfollowUpQuestion) {
          msg += this.followUpQuestion
        }

        return msg
      }
      build () {
        return new VehicleRecallSpeakText(this)
      }
    }
    return Builder
  }
}



module.exports = {
  InProgress: InProgressSearchForVehicleRecallIntentHandler,
  ComfirmedCompleted: ComfirmedCompletedSearchForVehicleRecallIntentHandler,
  DeniedCompleted: DeniedCompletedSearchForVehicleRecallIntentHandler,
  ReadVehicleRecallDetails: ReadVehicleRecallHandler,
  ResolveAmbigiousVehicleModelHandler,
  SearchForAnotherRecallHandler: GetSearchForAnotherRecallQuestionHandler,
  SearchForNewVehicleRecallHandler,
  MoveToNextRecallHandler
}
