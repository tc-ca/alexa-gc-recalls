'use strict'

class Vehicle {
  constructor ({ make, model, year }) {
    this.make = make.slotId
    this.makeSpeechText = make.slotValue

    this.model = model.slotId
    this.modelSpeechText = model.slotValue

    this.year = year.slotValue

    this.isValidMakeAndModel = make.isValid && model.isValid
  }
}

class Make {
  constructor ({ makeSlotId, makeSlotValue, makeIsValid }) {
    // if we dont have an id, means the entity resolution did not resolve values. present the spoken capture values to user instead.
    this.slotId = makeSlotId ? makeSlotId.replace(/_/g, ' ') : makeSlotValue
    this.slotValue = makeSlotValue
    this.isValid = makeIsValid
  }
}

class Model {
  constructor ({ modelSlotId, modelSlotValue, modelIsValid }) {
    // if we dont have an id, means the entity resolution did not resolve values. present the spoken capture values to user instead.
    this.slotId = modelSlotId ? modelSlotId.replace(/_/g, ' ') : modelSlotValue

    this.slotValue = modelSlotValue
    this.isValid = modelIsValid
  }
}

class Year {
  constructor ({ yearSlotValue, yearIsValid }) {
    this.slotValue = yearSlotValue
    this.isValid = yearIsValid
  }
}

// helper object
class MakeModelYearMapper {
  constructor (obj = {}) {
    this.slotId = null
    this.slotValue = null
    this.isValid = false

    obj && Object.assign(this, obj)
  }
}

module.exports = { Vehicle, Make, Model, Year, MakeModelYearMapper }
