
class Convoversation {
  constructor (obj = {}) {
    this.followUpQuestionEnum = -1
    this.userAction = 2
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
}

module.exports = Convoversation
