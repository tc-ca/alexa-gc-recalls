'use strict'

// TODO: install flow for some strong typing
// TODO: Add linter

const RECALL_API = require('../../services/TCSafetyRecalls.api')
const HELPER = require('../../utils/Helper')
const SESSION_KEYS = require('../../Constants').sessionKeys
const USER_ACTION = require('../../Constants').userAction
const SearchVehicleRecallIntentYesNoQuestions = require('../../Constants').SearchVehicleRecallIntentYesNoQuestions
const CONVO_CONTEXT = require('../../Constants').VehicleConversationContext

// const PR_DIRECTIVES = require('../../services/AlexaDirective.api')

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

const CompletedSearchForVehicleRecallIntentHandler = {
  canHandle (handlerInput) {
    console.log(handlerInput.requestEnvelope.request.type)
    console.log(handlerInput.requestEnvelope.request.intent.name)
    console.log(handlerInput.requestEnvelope.request.dialogState)

    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SearchForVehicleRecallIntent' &&
      handlerInput.requestEnvelope.request.dialogState === 'COMPLETED'
  },
  async handle (handlerInput, userAction) {
    const { attributesManager } = handlerInput
    const sessionAttributes = attributesManager.getSessionAttributes()
    // const requestId = handlerInput.requestEnvelope.request.requestId

    // // send progresive response, call Alexa API and send directive.
    // try {
    //   const directive = {
    //     header: {
    //       requestId
    //     },
    //     directive: {
    //       type: 'VoicePlayer.Speak',
    //       speech: `<speak>searching <break time="1s"/> </speak>`
    //     }
    //   }
    //   await PR_DIRECTIVES.callDirectiveService(handlerInput, directive)
    // } catch (err) {
    //   // if it failed we can continue, just the user will wait longer for first response
    //   console.log('error: ' + err)
    // }

    // TODO PUT INTO FILTER
    console.log('user action: ', userAction)
    console.log('intent name: ', handlerInput.requestEnvelope.request.intent.name)
    console.log('handlerInput: ', handlerInput)


    // Must manually passed in the intent name because this intent can get invoked by another and as such that intent name will be in the property
    sessionAttributes[SESSION_KEYS.LogicRoutedIntentName] = 'SearchForVehicleRecallIntent'

    // default user action to initiated vehicle recall search
    // userAction = (typeof userAction === 'undefined') ? USER_ACTION.InitiatedRecallSearch : userAction
    userAction = userAction || USER_ACTION.InitiatedRecallSearch

    console.log('user action: ', userAction)

    let currentRecallIndex = 0
    let speechText
    let vehicleSpeek = null

    switch (userAction) {
      case USER_ACTION.InitiatedRecallSearch: {
        // collect slot values
        console.log('response', handlerInput.requestEnvelope.request)
        const slotValues = HELPER.GetSlotValues(handlerInput.requestEnvelope.request.intent.slots)
        const recallRequestDTO = {
          year: slotValues.year.resolved,
          make: slotValues.VehicleMakeType.resolved,
          model: slotValues.VehicleModelType.resolved
        }

        let targetedRecalls = await RECALL_API.GetRecalls(recallRequestDTO.make, recallRequestDTO.model, recallRequestDTO.year)

        if (hasSimilarModelsAffectedByRecall(targetedRecalls, recallRequestDTO.model)) {

          vehicleSpeek = new VehicleRecallSpeakText.Builder({
            year: slotValues.year.resolved, make: slotValues.VehicleMakeType.resolved, model: slotValues.VehicleModelType.resolved, recalls: targetedRecalls, currentIndex: currentRecallIndex
          }).withFollowUpQuestion(CONVO_CONTEXT.AmbiguousModel)

          speechText = vehicleSpeek.speech()
        } else {
          let recalls = await GetRecallsDetails(targetedRecalls)

          // build speak text
          vehicleSpeek = new VehicleRecallSpeakText.Builder({
            year: slotValues.year.resolved, make: slotValues.VehicleMakeType.resolved, model: slotValues.VehicleModelType.resolved, recalls: recalls, currentIndex: currentRecallIndex
          })
            .withResult()
            .withOverview()
            .withDescription()
            .withFollowUpQuestion(CONVO_CONTEXT.RecallInfo)

          speechText = vehicleSpeek.speech()
        }

        sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleSpeek
      } break
      case USER_ACTION.InitiatedSkip:
      case USER_ACTION.RequestingNextRecallInfo: {
        // get session variables.
        currentRecallIndex = sessionAttributes[SESSION_KEYS.CurrentRecallIndex]
        const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]

        // get speech text
        let vehicleSpeek = new VehicleRecallSpeakText.Builder({ recalls: vehicleConversation.recalls, currentIndex: sessionAttributes[SESSION_KEYS.CurrentRecallIndex] })
          .withOverview()
          .withDescription()
          .withFollowUpQuestion(CONVO_CONTEXT.RecallInfo)

        speechText = vehicleSpeek.speech()

        // set session variables.
        sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleSpeek
      } break
      case USER_ACTION.ResolvingAmbiguousModel: {
        // get session variables.
        const vehicleConversation = sessionAttributes[SESSION_KEYS.VehicleConversation]

        // setup up variables
        let targetedRecalls = await RECALL_API.GetRecalls(vehicleConversation.make, vehicleConversation.model, vehicleConversation.year)

        let recalls = await GetRecallsDetails(targetedRecalls)

        // build speak text
        vehicleSpeek = new VehicleRecallSpeakText.Builder({
          year: vehicleConversation.year, make: vehicleConversation.make, model: vehicleConversation.model, recalls: recalls, currentIndex: currentRecallIndex
        })
          .withResult()
          .withOverview()
          .withDescription()
          .withFollowUpQuestion(CONVO_CONTEXT.RecallInfo)

        speechText = vehicleSpeek.speech()

        sessionAttributes[SESSION_KEYS.VehicleConversation] = vehicleSpeek
      }
        break
      default:
        console.log('breaking in the default')
        break
    }

    sessionAttributes[SESSION_KEYS.CurrentRecallIndex] = currentRecallIndex

    return handlerInput.responseBuilder
      .speak(`<speak>${speechText}</speak>`)
      .withSimpleCard('Welcome to Canadian Safety Recalls', 'Recalls have been found')
      .withShouldEndSession(false)
      .getResponse()
  }
}

function hasSimilarModelsAffectedByRecall (recalls, targetedModelName) {
  for (let index = 0; index < recalls.length; index++) {
    if (recalls[index].modelName !== targetedModelName) {
      return true
    }
  }
  return false
}

function BuildSimilarModelsString (recalls) {
  if (Array.isArray(recalls)) {
    let uniqueModels = [...new Set(recalls.map(x => x.modelName))]

    console.log(`${uniqueModels.slice(0, -1).join(', ')}${(uniqueModels.length > 1 ? ' or ' : '')}${uniqueModels.slice(-1)[0]}`)
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
      constructor ({ year, make, model, recalls, currentIndex }) {
        this.year = year
        this.make = make
        this.model = model
        this.recalls = recalls
        this.currentIndex = currentIndex
        this.followUpQuestion = ''
        this.followUpQuestionEnum = null
        this.hasResultText = false
        this.hasOverviewText = false
        this.hasdescriptionText = false
        this.hasfollowUpQuestionText = false
      }
      withResult (result) {
        console.log('prop', this.recalls.length)
        let plural = (this.recalls.length > 1 ? 's' : '')
        // let phonemePlural = (this.recalls.length > 1 ? 'z' : '')
        let phonemeRecall = `recall${plural}`

        if (this.recalls.length === 0) {
          this.result = `I didn't find any recalls for your ${this.year} ${this.make} ${this.model}. `
        } else if (this.recalls.length === 1) {
          this.result = `<p>I've found ${this.recalls.length} ${phonemeRecall} potentially affecting your ${this.year} ${this.make} ${this.model}. </p><break time ="1s"/>`
        } else if (this.recalls.length > 1) {
          this.result = `<p>I've found ${this.recalls.length} ${phonemeRecall} potentially affecting your ${this.year} ${this.make} ${this.model}. 
            I'll start with the most recent. At any time you skip to the next recall. </p><break time ="3s"/> `
        }

        this.hasResultText = true
        return this
      }
      withOverview (overview) {
        if (this.recalls.length > 0) {
          this.overview = `<p>On ${this.recalls[this.currentIndex].recallDate} there was a recall affecting the ${this.recalls[this.currentIndex].componentType} of ${this.recalls[this.currentIndex].unitsAffected} vehicles</p>`
          this.hasOverviewText = true
        }
        return this
      }
      withDescription (description) {
        if (this.recalls.length > 0) {
          this.description = `<p>${this.recalls[this.currentIndex].description} </p>`
          this.hasdescriptionText = true
        }
        return this
      }
      withFollowUpQuestion (convoContext) {
        switch (convoContext) {
          case CONVO_CONTEXT.RecallInfo:
            if (this.recalls.length !== 0) {
              if (this.currentIndex === this.recalls.length - 1) {
                this.followUpQuestion = 'Would you like to search for another recall? '
                this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToSearchForAnotherRecall
              } else {
                this.followUpQuestion = 'Would you like to hear the next recall? '
                this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToHearTheNextRecall
              }
            } else {
              this.followUpQuestion = 'Would you like to search for another recall? '
              this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.WouldYouLikeToSearchForAnotherRecall
            }
            break
          case CONVO_CONTEXT.AmbiguousModel:
            this.followUpQuestion = `I've found a few different models of 
          ${this.year} ${this.make} ${this.model} impacted by a recall, is yours a ${BuildSimilarModelsString(this.recalls)}?`
            this.followUpQuestionEnum = SearchVehicleRecallIntentYesNoQuestions.ProvideComfirmationOfAmbiguousModel
            break
          default:
            break
        }

        this.hasfollowUpQuestionText = true

        return this
      }

      speech () {
        console.log('speech', this.result + this.overview + this.description + this.followUpQuestion)

        let msg = ''
        if (this.hasResultText) {
          msg += this.result
        }
        if (this.hasOverviewText) {
          msg += this.overview
        }
        if (this.hasdescriptionText) {
          msg += this.description
        }
        if (this.hasfollowUpQuestionText) {
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

module.exports = { InProgressSearchForVehicleRecallIntentHandler, CompletedSearchForVehicleRecallIntentHandler }
