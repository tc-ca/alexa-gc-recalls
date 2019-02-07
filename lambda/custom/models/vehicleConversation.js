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
              I'll start with the most recent. At any time you skip to the next recall. </p><break time ="3"/> `
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

function BuildSimilarModelsString (recalls) {
  if (Array.isArray(recalls)) {
    let uniqueModels = [...new Set(recalls.map(x => x.modelName))]

    console.log(`${uniqueModels.slice(0, -1).join(', ')}${(uniqueModels.length > 1 ? ' or ' : '')}${uniqueModels.slice(-1)[0]}`)
    return `${uniqueModels.slice(0, -1).join(', ')}${(uniqueModels.length > 1 ? ' or ' : '')}${uniqueModels.slice(-1)[0]}`
  }
}

module.exports = VehicleRecallSpeakText
