
const SKILL_NAME = 'American Safety Recalls'

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
    `Hi I'm your ` +
    SKILL_NAME +
    `, Assistant. I help Canadians like you find information on different kinds of recalls.
      <break time ="1s"/>
      If you would like information on vehicle recalls, say vehicle.
    `,
    WOULD_YOU_LIKE_TO_RECIEVE_TXT_MSG_ON_PHONE: `Great! I can help you find %%RecallCategory%% recall info by reading it out loud, texting it to you, or both.
                        <break time ="1s"/>        
                        Would you like to get the recall information by text on your phone?
                        `,
    IS_YOUR_PHONE_NUMBER_1_XXX_XXX_XXXX: `Alright, I can send any vehicle recall info we find to the phone number associated with your Alexa Account. Is your phone number %%PhoneNumber%%?`
    // ...more...
  }
}
