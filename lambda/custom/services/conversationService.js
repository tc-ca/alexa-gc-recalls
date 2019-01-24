const implementjs = require('implement-js')
const implement = implementjs.default
const INTERFACES = require('../interfaces.js')
const Conversation = require('../models/conversation')

function GetConversationObj () {
  // checks to see if properties are implemented
  const obj = implement(INTERFACES.IConversation)(new Conversation())
  // to get intelli sense cast as Conversation object type.
  return new Conversation(obj)
}

module.exports = { GetConversationObj: GetConversationObj }
