const SEARCH_FINDINGS = require('../constants').VehicleSearchFindings
const CONVERSATION_CONTEXT = require('../constants').VehicleConversationContext
const FOLLOW_UP_QUESTIONS = require('../constants').FollowUpQuestions

module.exports = class VehicleConversation {
  constructor () {
    this.result = ''
    this.overview = ''
    this.description = ''
    this.followUpQuestion = ''
    this.followUpQuestionCode = null
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
        this.followUpQuestionCode = null
        this.hasfindings = false
        this.hasOverviewText = false
        this.hasdetails = false
        this.hasfollowUpQuestion = false
        this.requestAttributes = requestAttributes
        this.userAction = false
        this.searchFindings = SEARCH_FINDINGS.SearchNotConducted
        this.conversation = null
        this.validVehicleModel = false
      }

      withConversation (conversation) {
        this.conversation = conversation
        return this
      }

      withFindings () {
        if (this.validVehicleModel) {
          if (this.recalls.length === 0) {
            this.searchFindings = SEARCH_FINDINGS.NoRecallsFound
            this.findings = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE`)
          } else {
            if (hasSimilarModelsAffectedByRecall(this.recalls, this.model)) {
              this.searchFindings = SEARCH_FINDINGS.AmbigiousModelFound
              this.findings = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL`)
                .replace('%VehicleRecallYear%', this.year)
                .replace('%VehicleRecallMake%', this.make)
                .replace('%VehicleRecallModel%', this.model)
            } else {
              if (this.recalls.length === 1) {
                this.searchFindings = SEARCH_FINDINGS.SingleRecallFound
                this.findings = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE`)
                  .replace('%VehicleRecallYear%', this.year)
                  .replace('%VehicleRecallMake%', this.make)
                  .replace('%VehicleRecallModel%', this.model)
              } else if (this.recalls.length > 1) {
                this.searchFindings = SEARCH_FINDINGS.MultipleRecallsFound
                this.findings = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE`)
                  .replace('%RecallCount%', this.recalls.length)
                  .replace('%VehicleRecallYear%', this.year)
                  .replace('%VehicleRecallMake%', this.make)
                  .replace('%VehicleRecallModel%', this.model)
              }
            }
          }
        } else {
          this.searchFindings = SEARCH_FINDINGS.NonValidModelFound
          this.findings = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SLOT_VALUES_NOT_FOUND`)
            .replace('%VehicleRecallYear%', this.year)
            .replace('%VehicleRecallMake%', this.make)
            .replace('%VehicleRecallModel%', this.model)
        }
        console.log('Vehicle Recall Search Result =', this.findings)
        this.hasfindings = true
        return this
      }

      withIntro (includeIntro) {
        if (includeIntro) {
          this.overview = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALL_READING_INTRO`)
          this.hasOverviewText = true
        }
        return this
      }
      modelIsValid (isValidModel) {
        if (isValidModel) {
          this.validVehicleModel = isValidModel
        }
        return this
      }
      withDetails () {
        if (this.recalls.length > 0) {
          this.details = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_RECALL_READING_DETAILS`)
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
                  .t(`SPEECH_TXT_VEHICLE_RECALL_READING_DONE`)
                  .replace('%VehicleRecallYear%', this.year)
                  .replace('%VehicleRecallMake%', this.make)
                  .replace('%VehicleRecallModel%', this.model)
                this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeTheRecallInformationRepeated
              } else {
                this.followUpQuestion = this.requestAttributes.t(`SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL`)
                this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToHearTheNextRecall
              }
            } else {
              this.followUpQuestion = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE`)
              this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
            }
            break
          case CONVERSATION_CONTEXT.GettingSearchResultFindingsState:
            if (this.validVehicleModel) {
              if (this.recalls.length === 0) {
                this.followUpQuestion = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE`)
                this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToSearchForAnotherRecall
              } else {
                if (hasSimilarModelsAffectedByRecall(this.recalls, this.model)) {
                  this.followUpQuestion = this.requestAttributes
                    .t(`VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL`)
                    .replace('%AmbigiousModelsList%', BuildSimilarModelsString(this.recalls, this.model))
                  this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.VEHICLE_IsItModelAOrModelB
                } else {
                  if (this.recalls.length === 1) {
                    this.followUpQuestion = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE`)
                    this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToMeReadTheRecall
                  } else if (this.recalls.length > 1) {
                    this.followUpQuestion = this.requestAttributes.t(`SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE`)
                    this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.WouldYouLikeToMeReadTheRecall
                  }
                }
              }
            } else {
              this.followUpQuestion = this.requestAttributes.t('SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NON_VALID')
              this.followUpQuestionCode = FOLLOW_UP_QUESTIONS.VEHICLE_MODEL_NON_VALID_WhatIsYourVehicleModel
            }
            break
          default:
            break
        }

        this.hasfollowUpQuestion = true
        return this
      }

      withUserAction (userAction) {
        this.userAction = userAction
        return this
      }

      speech () {
        let msg = ''
        if (this.hasfindings) {
          msg += this.findings + ' '
        }
        if (this.hasOverviewText) {
          msg += this.overview + ' '
        }
        if (this.hasdetails) {
          msg += this.details + ' '
        }
        if (this.hasfollowUpQuestion) {
          msg += this.followUpQuestion + ' '
        }
        return msg
      }
      build () {
        return new VehicleConversation(this)
      }
    }
    return Builder
  }
}

function hasSimilarModelsAffectedByRecall (recalls, targetedModelName) {
  let similarModelCount = 0
  for (let index = 0; index < recalls.length; index++) {
    if (recalls[index].modelName !== targetedModelName && recalls[index].modelName.includes(targetedModelName)) {
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

    for (let index = 0; index < recalls.length; index++) {
      if (recalls[index].modelName.includes(targetedModelName)) {
        similarModels.push(recalls[index].modelName)
      }
    }

    let uniqueModels = [...new Set(similarModels)]

    return `${uniqueModels.slice(0, -1).join(', <break time="200ms"/> ')}${(uniqueModels.length > 1 ? ' <break time="200ms"/> or  ' : '')}${uniqueModels.slice(-1)[0]}`
  }
}
