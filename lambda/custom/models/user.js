'use strict'

/**
 * Data transfer object which contains information on retrieval of Alexa account phone number from Alexa API
 *
 * @class PhoneNumber
 */
class PhoneNumber {
  constructor (obj = {}) {
    // the result of Alexa API get request for end user phone number.
    this.apiRetrievalResult = -1
    // country code of phone number
    this.countryCode = -1

    this.phoneNumber = null

    obj && Object.assign(this, obj)
  }
}

class Email {
  constructor (obj = {}) {
    // the result of Alexa API get request for end user phone number.
    this.apiRetrievalResult = -1

    this.email = null

    obj && Object.assign(this, obj)
  }
}

class User {
  constructor ({ email, phoneNumber }) {
    // the result of Alexa API get request for end user phone number.
    this.email = email

    this.email = phoneNumber

  }
}

module.exports = { PhoneNumber, Email, User }
