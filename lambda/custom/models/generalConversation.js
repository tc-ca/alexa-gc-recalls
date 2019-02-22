/**
 * An object to hold general related conversations outside the context of specific recall lookup
 *
 * @class Conversation
 */
class GeneralConversation {
  constructor (obj = {}) {
    this.followUpQuestionCode = -1
    this.phoneNumber = 2
    this.sendSMS = false
    this.phoneNumber = -1
    this.userAction = -1

    obj && Object.assign(this, obj)
  }

  withFollowUpQuestion (followUpQuestionCode) {
    this.followUpQuestionCode = followUpQuestionCode
    return this
  }

  withUserAction (userAction) {
    this.userAction = userAction
    return this
  }
  withUserProvidedPhoneNumber (phoneNumber) {
    this.phoneNumber = phoneNumber
    return this
  }
  sendSMS (sendSMS) {
    this.sendSMS = sendSMS
    return this
  }
}

module.exports = GeneralConversation
