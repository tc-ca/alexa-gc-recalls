// Load the AWS SDK for Node.js
const AWS = require('aws-sdk')
// Set region
AWS.config.update({ region: 'us-east-1' })

// Create publish parameters

async function SendSMS ({ message, phoneNumber, sessionId }) {
  const params = {
    Message: message, /* required */
    PhoneNumber: `+1${phoneNumber}`
  }

  // Create promise and SNS service object
  const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise()

  // Handle promise's fulfilled/rejected states
  publishTextPromise.then(
    function (data) {
      console.log({ sessionId: sessionId, textMessageSent: true, messageId: data.MessageId })
      return true
    }).catch(
    function (err) {
      console.error({ sessionId: sessionId, textMessageSent: false, error: err, errorStack: err.stack })
      return false
    })
}

module.exports = { SendSMS }
