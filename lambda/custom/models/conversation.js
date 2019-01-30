
class Convoversation {
  constructor (obj = {}) {
    this.followUpQuestionEnum = -1
    this.userAction = 2
    this.sendSMS = false
    this.phoneNumber = -1

    obj && Object.assign(this, obj)
  }

  withFollowUpQuestion (followUpQuestionEnum) {
    this.followUpQuestionEnum = followUpQuestionEnum
    return this
  }

  withUserAction (userAction) {
    this.userAction = userAction
    return this
  }
  withManuallyProvidedPhoneNumber (userAction) {
    this.userAction = userAction
    return this
  }
  sendSMS (sendSMS) {
    this.sendSMS = sendSMS
    return this
  }
}

module.exports = Convoversation
