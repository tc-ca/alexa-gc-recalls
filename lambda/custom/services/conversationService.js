const implementjs = require('implement-js')
const implement = implementjs.default
const INTERFACES = require('../interfaces.js')

const MODELS = { GeneralConversation: require('../models/generalConversation') }

/**
 * functions checks to see if GeneralConversation object implements specified properties.
 *
 * @returns returns specific GeneralConversation object
 */
function GetGeneralConversationObj () {
  // checks to see if properties are implemented
  implement(INTERFACES.IConversation)(new MODELS.GeneralConversation())
  const obj = implement(INTERFACES.IGeneralConversation)(new MODELS.GeneralConversation())
  // to get intelli sense cast as Conversation object type.
  return new MODELS.GeneralConversation(obj)
}

module.exports = { GetGeneralConversationObj }
