
class PhoneNumber {
  constructor (obj = {}) {
    this.phoneNumberState = -1
    this.phoneNumber = null
    this.countryCode = -1

    obj && Object.assign(this, obj)
  }

}

module.exports = PhoneNumber
