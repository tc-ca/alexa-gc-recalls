// Load the AWS SDK for Node.js
const AWS = require('aws-sdk')
// Set region
AWS.config.update({ region: 'us-east-1' })

// Create publish parameters

function SendSMS ({ message, phoneNumber }) {
  const params = {
    Message: message, /* required */
    PhoneNumber: `+1${phoneNumber}`
  }

  // Create promise and SNS service object
  let publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise()

  // Handle promise's fulfilled/rejected states
  publishTextPromise.then(
    function (data) {
      console.log('SMS delivered, message id: ' + data.MessageId)
      return true
    }).catch(
    function (err) {
      console.error(err, err.stack)
      return false
    })
}

module.exports = { SendSMS }
