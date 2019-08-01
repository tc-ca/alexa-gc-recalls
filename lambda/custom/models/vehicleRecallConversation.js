'use strict'

const sanitizeHtml = require('sanitize-html')

const SEARCH_FINDINGS = require('../constants').VEHICLE_SEARCH_FINDINGS
const CONVERSATION_CONTEXT = require('../constants').VEHICLE_CONVERSATION_CONTEXT
const FOLLOW_UP_QUESTIONS = require('../constants').FOLLOW_UP_QUESTIONS

class VehicleRecallConversation {
  constructor (obj = {}) {
    this.recallSearchResultSpeechText = ''
    this.recallCardText = ''

    this.introToRecallDescriptionText = ''

    this.recallDescriptionSpeechText = ''

    this.followUpQuestionSpeechText = ''

    this.followUpQuestionCode = -1
    this.searchFindings = -1

    this.vehicle = null
    this.recalls = []
    this.recallsDetails = []
    this.speechString = []

    obj && Object.assign(this, obj)
  }

  getSpeechText () {
    return this.speechString.join(' ')
  }

  getCardText () {
    return this.recallCardText
  }
}

class VehicleRecallConversationContextBuilder {
  constructor ({ vehicle, requestAttributes, recalls, recallsDetails, currentRecallIndex }) {
    this.vehicle = vehicle

    this.requestAttributes = requestAttributes

    this.recalls = recalls
    this.recallsDetails = recallsDetails
    this.currentRecallIndex = currentRecallIndex

    this.followUpQuestionCode = -1

    this.searchFindings = SEARCH_FINDINGS.SearchNotConducted

    this.speechString = []

    this.recallSearchResultSpeechText = null
    this.recallCardText = null

    this.introToRecallDescriptionText = null

    this.recallDescriptionSpeechText = null

    this.followUpQuestionSpeechText = null
  }

  saySearchFinding ({ skipAmbigiousCheck = false } = {}) {
    if (this.vehicle.isValidMakeAndModel) {
      if (this.recalls.length === 0 || foundModelNameAmongRecalls(this.recalls, this.vehicle.model) === false) {
        this.searchFindings = SEARCH_FINDINGS.NoRecallsFound
        this.recallSearchResultSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE`)

        this.recallCardText = this.requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_FOUND_NONE`)
          .replace('%VehicleRecallYear%', this.vehicle.year)
          .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
          .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)
      } else {
        if (hasSimilarModelsAffectedByRecall(this.recalls, this.vehicle.model) && !skipAmbigiousCheck) {
          this.searchFindings = SEARCH_FINDINGS.AmbigiousModelFound
          this.recallSearchResultSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL`)
            .replace('%VehicleRecallYear%', this.vehicle.year)
            .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
            .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)

          this.recallCardText = this.requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL`)
            .replace('%VehicleRecallYear%', this.vehicle.year)
            .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
            .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)
            .replace('%AmbigiousModelsList%', BuildSimilarModelsString(this.recalls, this.vehicle.model, this.requestAttributes, false))
        } else {
          if (this.recalls.length === 1) {
            this.searchFindings = SEARCH_FINDINGS.SingleRecallFound
            this.recallSearchResultSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE`)
              .replace('%VehicleRecallYear%', this.vehicle.year)
              .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
              .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)

            this.recallCardText = this.requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_FOUND_ONE`)
              .replace('%VehicleRecallYear%', this.vehicle.year)
              .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
              .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)
          } else if (this.recalls.length > 1) {
            this.searchFindings = SEARCH_FINDINGS.MultipleRecallsFound
            this.recallSearchResultSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE`)
              .replace('%RecallCount%', this.recalls.length)
              .replace('%VehicleRecallYear%', this.vehicle.year)
              .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
              .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)

            this.recallCardText = this.requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE`)
              .replace('%RecallCount%', this.recalls.length)
              .replace('%VehicleRecallYear%', this.vehicle.year)
              .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
              .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)
          }
        }
      }
    } else {
      this.searchFindings = SEARCH_FINDINGS.NonValidMakeOrModelFound
      this.recallSearchResultSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID`)
        .replace('%VehicleRecallYear%', this.vehicle.year)
        .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
        .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)

      this.recallCardText = this.requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_FOUND_NON_VALID`)
        .replace('%RecallCount%', this.recalls.length)
        .replace('%VehicleRecallYear%', this.vehicle.year)
        .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
        .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)
    }

    this.speechString.push(this.recallSearchResultSpeechText)
    return this
  }

  sayIntroIntructionsBeforeReadingRecallDescription ({ omitSpeech }) {
    if (!omitSpeech) {
      this.introToRecallDescriptionText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_READING_INTRO`)
      this.speechString.push(this.introToRecallDescriptionText)
    }
    return this
  }
  sayRecallDescription ({ omitSpeech = false }) {
    if (!omitSpeech) {
      if (this.recalls.length > 0) {
        this.recallDescriptionSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_READING_DETAILS`)
          .replace('%VehicleRecallDate%', this.recallsDetails[this.currentRecallIndex].recallDate)
          .replace('%VehicleRecallComponent%', this.recallsDetails[this.currentRecallIndex].componentType)
          .replace('%VehicleRecallDetails%', sanitizeHtml(this.recallsDetails[this.currentRecallIndex].description, { allowedTags: [], allowedAttributes: {} }))

        this.recallCardText = this.requestAttributes.t(`CARD_TXT_VEHICLE_RECALLS_READING_DETAILS`)
          .replace('%VehicleRecallDate%', this.recallsDetails[this.currentRecallIndex].recallDate)
          .replace('%VehicleRecallComponent%', this.recallsDetails[this.currentRecallIndex].componentType)
          .replace('%VehicleRecallDetails%', sanitizeHtml(this.recallsDetails[this.currentRecallIndex].description, { allowedTags: [], allowedAttributes: {} }))

        this.speechString.push(this.recallDescriptionSpeechText)
      }
    }

    return this
  }
  askFollowUpQuestion ({ convoContext, skipAmbigiousCheck = false }) {
    switch (convoContext) {
      case CONVERSATION_CONTEXT.ComfirmingMakeModelYear:
        this.followUpQuestionSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR`)
          .replace('%VehicleRecallYear%', this.vehicle.year)
          .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
          .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)

        this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.ARE_YOU_LOOKING_FOR_VEHICLE_X

        break
      case CONVERSATION_CONTEXT.ReadingRecallState:
        if (this.recalls.length !== 0) {
          if (this.currentRecallIndex === this.recalls.length - 1) {
            this.followUpQuestionSpeechText = this.requestAttributes
              .t(`SPEECH_TXT_VEHICLE_RECALLS_READING_DONE`)
              .replace('%VehicleRecallYear%', this.vehicle.year)
              .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
              .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)
            this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeTheRecallInformationRepeated
          } else {
            this.followUpQuestionSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL`)
            this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToHearTheNextRecall
          }
        } else {
          this.followUpQuestionSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE`)
          this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
        }
        break
      case CONVERSATION_CONTEXT.GettingSearchResultFindingsState:
        if (this.vehicle.isValidMakeAndModel) {
          if (this.recalls.length === 0 || foundModelNameAmongRecalls(this.recalls, this.vehicle.model) === false) {
            this.followUpQuestionSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE`)
            this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
          } else {
            if (hasSimilarModelsAffectedByRecall(this.recalls, this.vehicle.model) && !skipAmbigiousCheck) {
              this.followUpQuestionSpeechText = this.requestAttributes
                .t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL`)
                .replace('%AmbigiousModelsList%', BuildSimilarModelsString(this.recalls, this.vehicle.model, this.requestAttributes))

              this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.VEHICLE_IsItModelAOrModelB
            } else {
              if (this.recalls.length === 1) {
                this.followUpQuestionSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE`)
                this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToMeReadTheRecall
              } else if (this.recalls.length > 1) {
                this.followUpQuestionSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE`)
                this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToMeReadTheRecall
              }
            }
          }
        } else {
          this.followUpQuestionSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE`)
          this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
        }
        break
      default:
        break
    }

    this.speechString.push(this.followUpQuestionSpeechText)

    return this
  }

  buildSpeech () {
    return new VehicleRecallConversation(this)
  }
}

/**
 *
 * https://vrdb-tc-apicast-production.api.canada.ca/eng/vehicle-recall-database/v1/recall/make-name/DODGE/model-name/CARAVAN/year-range/2015-2015
 * The above search will retrieve results containing Dodge Grand Caravan and no results for the actual targeted make and model Dodge Caravan
 * This function ensures the targeted model is found within recalls array list i.e. API result set.
 * @param {*} recalls
 * @param {*} targetedModelName
 * @returns
 */
function foundModelNameAmongRecalls (recalls, targetedModelName) {
  let modelCount = 0

  for (let index = 0; index < recalls.length; index++) {
    if (recalls[index].modelName.toUpperCase() === targetedModelName.toUpperCase()) {
      modelCount++
    }
  }
  if (modelCount >= 1) {
    return true
  }

  return false
}
function hasSimilarModelsAffectedByRecall (recalls, targetedModelName) {
  let similarModelCount = 0

  for (let index = 0; index < recalls.length; index++) {
    if (recalls[index].modelName.toUpperCase() !== targetedModelName.toUpperCase() &&
    recalls[index].modelName.toUpperCase().includes(targetedModelName.toUpperCase())) {
      similarModelCount++
    }
  }

  if (similarModelCount >= 1) {
    return true
  }
  return false
}

function BuildSimilarModelsString (recalls, targetedModelName, requestAttributes, forSpeech = true) {
  if (Array.isArray(recalls)) {
    let similarModels = []
    // TODO: remove all unwanted characters.
    const unWantedCharacters = /\\|\//g // removes forward and backward slashes

    for (let index = 0; index < recalls.length; index++) {
      const model = recalls[index].modelName.replace(unWantedCharacters, ' ').toUpperCase()

      if (model.includes(targetedModelName.toUpperCase())) {
        similarModels.push(model)
      }
    }

    let uniqueModels = [...new Set(similarModels)]

    const noToMultipleChoiceString = (uniqueModels.length === 2 ? requestAttributes.t(`AMBIGIOUS_MODEL_COMMAND_OPTION_NEITHER`) : requestAttributes.t(`AMBIGIOUS_MODEL_COMMAND_OPTION_NONE_OF_THESE`))

    if (forSpeech) {
      const multipleChoice = `${uniqueModels.slice(0, -1).join(', <break time="200ms"/> ')}${(uniqueModels.length > 1 ? ` <break time="200ms"/> ${requestAttributes.t(`OR`)} ` : '')}${uniqueModels.slice(-1)[0]}`
      return `${multipleChoice} ${requestAttributes.t(`OR`)} <break time="100ms"/> ${noToMultipleChoiceString}`
    } else {
      const multipleChoice = `${uniqueModels.slice(0, -1).join(', ')}${(uniqueModels.length > 1 ? ` ${requestAttributes.t(`OR`)} ` : '')}${uniqueModels.slice(-1)[0]}`
      return `${multipleChoice} ${requestAttributes.t(`OR`)} ${noToMultipleChoiceString}`
    }
  }
}

module.exports = { VehicleRecallConversation, ConversationContextBuilder: VehicleRecallConversationContextBuilder }
