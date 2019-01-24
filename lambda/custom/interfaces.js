const implementjs = require('implement-js')
const { Interface, type } = implementjs

const IConversation = Interface('Conversation')({
  // recallCategory: type('string'),
  // followUpQuestion: type('string'),
  followUpQuestionEnum: type('number'), // TODO: add specific interface.
  userAction: type('number') // TODO: add specific interface.

  // hasfollowUpQuestion: type('boolean')
  // sendText: type('boolean'),
  // hasNumber: type('boolean')

}, {
  error: true,
  strict: true
})

const IVehicleConversation = Interface('vehicleConversation')({
  year: type('string'),
  make: type('string'),
  model: type('string'),
  currentIndex: type('number')
}, {
  extend: IConversation
})

module.exports = { IConversation: IConversation, IVehicleConversation: IVehicleConversation }
