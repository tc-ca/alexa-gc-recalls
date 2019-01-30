const implementjs = require('implement-js')
const { Interface, type } = implementjs

const IConversation = Interface('Conversation')({
  followUpQuestionEnum: type('number'), // TODO: add specific interface.
  userAction: type('number'), // TODO: add specific interface.
  sendSMS: type('boolean'),
  phoneNumber: type('number')

  // recallCategory: type('string'),
  // followUpQuestion: type('string'),
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
