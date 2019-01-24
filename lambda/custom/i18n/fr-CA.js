
const SKILL_NAME = 'Canadian Safety Recalls'

module.exports = {
  translation: {
    'SKILL_NAME': 'Super Welcome', // <- can either be a string...
    'GREETING': [ // <- or an array of strings.
      'Hello there',
      'Hey',
      'Hi!'
    ],
    'GREETING_WITH_NAME': [
      'Hey %s', // --> That %s is a wildcard. It will
      'Hi there, %s', //     get turned into a name in our code.
      'Hello, %s' //     e.g. requestAttributes.t('GREETING_WITH_NAME', 'Andrea')
    ],
    WELCOME_LONG:
    `Translation required`,
    RECIEVE_SMS_QUESTION: `Translation required`
    // ...more...
  }
}
