'use strict'

const i18n = require('i18next') 
const sprintf = require('i18next-sprintf-postprocessor')

const languageStrings = {
  'en-CA': require('../i18n/en-CA'),
  'en-US': require('../i18n/en-US'),
  'fr-CA': require('../i18n/fr-CA')

  // ... etc
}

const LocalizationInterceptor = {
  process (handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en-CA', // fallback to EN if locale doesn't exist
      resources: languageStrings
    })

    localizationClient.localize = function () {
      const args = arguments
      let values = []

      for (let i = 1; i < args.length; i++) {
        values.push(args[i])
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: 'sprintf',
        sprintf: values
      })

      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)]
      } else {
        return value
      }
    }

    const attributes = handlerInput.attributesManager.getRequestAttributes()
    attributes.t = function (...args) { // pass on arguments to the localizationClient
      return localizationClient.localize(...args)
    }
  }
}
module.exports = LocalizationInterceptor
