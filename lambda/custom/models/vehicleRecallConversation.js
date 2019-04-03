'use strict'

const SEARCH_FINDINGS = require('../constants').VEHICLE_SEARCH_FINDINGS
const CONVERSATION_CONTEXT = require('../constants').VEHICLE_CONVERSATION_CONTEXT
const FOLLOW_UP_QUESTIONS = require('../constants').FOLLOW_UP_QUESTIONS

class VehicleRecallConversation {
  constructor (obj = {}) {
    this.recallSearchResultSpeechText = ''
    this.introToRecallDescriptionText = ''
    this.recallDescriptionSpeechText = ''
    this.followUpQuestionSpeechText = ''

    this.followUpQuestionCode = -1
    this.searchFindings = -1

    this.vehicle = null
    this.recalls = []
    this.speechString = []

    obj && Object.assign(this, obj)
  }

  getSpeechText () {
    return this.speechString.join(' ')
  }
}

class VehicleRecallConversationContextBuilder {
  constructor ({ vehicle, requestAttributes, recalls, currentRecallIndex }) {
    this.vehicle = vehicle

    this.requestAttributes = requestAttributes

    this.recalls = recalls
    this.currentRecallIndex = currentRecallIndex

    this.followUpQuestionCode = -1

    this.searchFindings = SEARCH_FINDINGS.SearchNotConducted

    this.speechString = []

    this.recallSearchResultSpeechText = null
    this.introToRecallDescriptionText = null
    this.recallDescriptionSpeechText = null
    this.followUpQuestionSpeechText = null
  }

  saySearchFinding ({ skipAmbigiousCheck = false } = {}) {
    if (this.vehicle.isValidMakeAndModel) {
      if (this.recalls.length === 0) {
        this.searchFindings = SEARCH_FINDINGS.NoRecallsFound
        this.recallSearchResultSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE`)
      } else {
        if (hasSimilarModelsAffectedByRecall(this.recalls, this.vehicle.model) && !skipAmbigiousCheck) {
          this.searchFindings = SEARCH_FINDINGS.AmbigiousModelFound
          this.recallSearchResultSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL`)
            .replace('%VehicleRecallYear%', this.vehicle.year)
            .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
            .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)
        } else {
          if (this.recalls.length === 1) {
            this.searchFindings = SEARCH_FINDINGS.SingleRecallFound
            this.recallSearchResultSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE`)
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
          }
        }
      }
    } else {
      this.searchFindings = SEARCH_FINDINGS.NonValidMakeOrModelFound
      this.recallSearchResultSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID`)
        .replace('%VehicleRecallYear%', this.vehicle.year)
        .replace('%VehicleRecallMake%', this.vehicle.makeSpeechText)
        .replace('%VehicleRecallModel%', this.vehicle.modelSpeechText)
    }

    console.log('Vehicle Recall Search Result =', this.recallSearchResultSpeechText)
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
          .replace('%VehicleRecallDate%', this.recalls[this.currentRecallIndex].recallDate)
          .replace('%VehicleRecallComponent%', this.recalls[this.currentRecallIndex].componentType)
          .replace('%VehicleRecallDetails%', this.recalls[this.currentRecallIndex].description)

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
          if (this.recalls.length === 0) {
            this.followUpQuestionSpeechText = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE`)
            this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
          } else {
            if (hasSimilarModelsAffectedByRecall(this.recalls, this.vehicle.model) && !skipAmbigiousCheck) {
              this.followUpQuestionSpeechText = this.requestAttributes
                .t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL`)
                .replace('%AmbigiousModelsList%', BuildSimilarModelsString(this.recalls, this.vehicle.model))
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

function hasSimilarModelsAffectedByRecall (recalls, targetedModelName) {
  let similarModelCount = 0

  for (let index = 0; index < recalls.length; index++) {
    if (recalls[index].modelName.toUpperCase() !== targetedModelName.toUpperCase() && recalls[index].modelName.toUpperCase().includes(targetedModelName.toUpperCase())) {
      similarModelCount++
    }
  }

  if (similarModelCount >= 1) {
    return true
  }
  return false
}

function BuildSimilarModelsString (recalls, targetedModelName) {
  if (Array.isArray(recalls)) {
    let similarModels = []
    // TODO: remove all unwanted characters.
    const unWantedCharacters = /\\|\//g

    for (let index = 0; index < recalls.length; index++) {
      const model = recalls[index].modelName.replace(unWantedCharacters, ' ').toUpperCase()

      if (model.includes(targetedModelName.toUpperCase())) {
        similarModels.push(model)
      }
    }

    let uniqueModels = [...new Set(similarModels)]

    return `${uniqueModels.slice(0, -1).join(', <break time="200ms"/> ')}${(uniqueModels.length > 1 ? ' <break time="200ms"/> or  ' : '')}${uniqueModels.slice(-1)[0]}`
  }
}

module.exports = { VehicleRecallConversation, ConversationContextBuilder: VehicleRecallConversationContextBuilder }
