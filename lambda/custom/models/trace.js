class Trace {
  constructor (obj = {}) {
    this.location = []

    obj && Object.assign(this, obj)
  }
}

module.exports = { Trace }
