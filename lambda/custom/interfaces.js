const implementjs = require('implement-js')
const { Interface, type } = implementjs
/**
 * Conversation module/design explaination, in the context of the following recalls project, conversations between Alexa and the end users is made of
 * Two parts:
 *  1. A follow-up question asked by Alexa, after interaction with the AI.
 *  2. Response by the end user, which is a collection of inputs.
 *
 * This interaction goes back and forth until the user is statisfied and quits the skill.
 *
 * Implementation wise Alexa has been divided into two layers.
 *  1. Any conversation data outside the context of specific recall is placed into 'General Conversation'.
 *  2. Any vehicle/car related data is placed into the 'Vehicle Conversation'
 * Note: other layers should be created for categories of recalls.
 *
 * How to use: Implement where required. In most cases you should always implement from IConverstion as to stay true to the above module, see yes and no handlers for example of implementation.
 *
 *
 */

/**
 * Enforces conversation objects cotains the following properties.
 *
 */
const IConversation = Interface('IConversation')({
  followUpQuestionCode: type('number') // TODO: add specific interface.
}, {
  error: true,
  strict: true
})

// TODO: decide if this interface should be kept, not really required.
const IGeneralConversation = Interface('IGeneralConversation')({
  followUpQuestionCode: type('number'), // TODO: add specific interface.
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

// TODO: decide if this interface should be kept, not really required.
const IVehicleConversation = Interface('vehicleConversation')({
  year: type('string'),
  make: type('string'),
  model: type('string'),
  currentIndex: type('number')
}, {
  extend: IGeneralConversation
})

module.exports = {
  IConversation,
  IGeneralConversation,
  IVehicleConversation
}
