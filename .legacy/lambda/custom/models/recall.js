'use strict'

class Recall {
  constructor (obj = {}) {
    this.recallNumber = null
    this.modelName = null

    obj && Object.assign(this, obj)
  }
}

class RecallSummary {
  constructor (obj = {}) {
    this.componentType = null
    this.unitsAffected = null
    this.description = null
    this.makeName = null
    this.modelName = null
    this.notificationTypeEtxt = null
    this.recallNumber = null

    obj && Object.assign(this, obj)
  }
}

module.exports = { Recall, RecallSummary }
