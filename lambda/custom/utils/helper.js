'use strict'

const Trace = require('../models/trace').Trace
const SESSION_KEYS = require('../constants').SESSION_KEYS

function GetSlotValues (filledSlots) {
  console.log('filled slots: ', JSON.stringify(filledSlots))
  const slotValues = {}
  try {
    Object.keys(filledSlots).forEach((item) => {
      const name = filledSlots[item].name

      if (filledSlots[item] &&
          filledSlots[item].resolutions &&
          filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
          filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
          filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
          case 'ER_SUCCESS_MATCH':
            let valueNames = []
            for (let index = 0; index < filledSlots[item].resolutions.resolutionsPerAuthority[0].values.length; index++) {
              valueNames.push(filledSlots[item].resolutions.resolutionsPerAuthority[0].values[index].value.name)
            }
            slotValues[name] = {
              valueHeard: filledSlots[item].value,
              resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
              id: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.id,
              isValidated: true,
              resolvedValues: valueNames
            }
            console.log(JSON.stringify(slotValues))
            console.log(slotValues[name])
            console.log(slotValues)

            break
          case 'ER_SUCCESS_NO_MATCH':
            slotValues[name] = {
              valueHeard: filledSlots[item].value,
              resolved: filledSlots[item].value,
              isValidated: false
            }
            console.log()
            break
          default:
            break
        }
      } else {
        slotValues[name] = {
          valueHeard: filledSlots[item].value,
          resolved: filledSlots[item].value,
          isValidated: false
        }
      }
    }, this)
  } catch (error) {
    console.log('error: ', error)
  }

  console.log('Returning slot values: ', slotValues)
  return slotValues
}

function SetTrace ({ handlerName, requestAttributes, sessionAttributes }) {
  // request attribuute only exist per request
  // add trace to request obj, only interesting in tracing which handlers the code runs through per request
  // request obj will automatically reset it self.
  // note: session last the entire lifetime of skill

  const trace = new Trace(requestAttributes[SESSION_KEYS.HANDLER_TRACE])
  trace.location.push(handlerName)
  // put into session so we can examine the value via json output.
  sessionAttributes[SESSION_KEYS.TRACE] = trace
}

module.exports = { GetSlotValues, SetTrace }
