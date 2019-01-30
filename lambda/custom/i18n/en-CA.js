
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
    IS_YOUR_PHONE_NUMBER_1_XXX_XXX_XXXX: `Alright, I can send any vehicle recall info we find to the phone number associated with your Alexa Account. Is your phone number %%PhoneNumber%%?`,
    TELL_ME_YOUR_MAKE: `Okay. Could you please tell me the make of your vehicle for example, Honda?`,
    TELL_ME_YOUR_PHONE_NUMBER: `Alright, what is your phone number?`,
    VEHICLE_RECALLS_FOUND_NONE: `There are no recalls associated with your vehicle in our system. `,
    VEHICLE_RECALLS_FOUND_ONE: `<p>I've found a <phoneme alphabet="ipa" ph="ri.kɔ:l">recall</phoneme> potentially affecting your %%VehicleRecallYear%% %%VehicleRecallMake%% %%VehicleRecallModel%%. %%SentSMSMsg%%</p>`,
    VEHICLE_RECALLS_FOUND_MULTIPLE: `<p>I've found %%RecallCount%% <phoneme alphabet="ipa" ph="ri.kɔ:lz">recalls</phoneme> potentially affecting your %%VehicleRecallYear%% %%VehicleRecallMake%% %%VehicleRecallModel%%. %%SentSMSMsg%%</p>`,
    VEHICLE_RECALLS_FOUND_NON_VALID: `I'm sorry. I don't have any information on your %%VehicleRecallYear%% %%VehicleRecallMake%% %%VehicleRecallModel%% at the moment. I'm still a voice assistant in training. Please contact my human friends at Transport Canada Recalls customer suppport at <say-as interpret-as="telephone">18003330510 for more help.</say-as>`,
    VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `I've found a few different models of %%VehicleRecallYear%% %%VehicleRecallMake%% %%VehicleRecallModel%%.`,
    VEHICLE_RECALLS_FOUND_READ_COMFIRMATION: `Would you like me to read it to you?`,
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Would you like to search for another vehicle recall?`,
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `Would you like me to read it to you?`,
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `Would you like me to read it to you?`,
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NON_VALID: `Would you like to search for another recall?`,
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Is yours a %%AmbigiousModelsList%%?`,
    VEHICLE_IN_PROGRESS_SEARCHING_MSG_1: `Ok, let me look for your vehicle.<break time="500ms"/>`,
    VEHICLE_IN_PROGRESS_SEARCHING_MSG_2: `Alright, let me check that our for you.<break time="500ms"/>`,
    VEHICLE_RECALL_READING_INTRO_USAGE: `Alright, if you find that I'm rambling too much, just say skip, and I'll  skip to the next recall. At any point you can leave the skill by saying exit<break time="500ms"/>`,
    VEHICLE_DETAILS_MSG: `<p>On %%VehicleRecallDate%% there was a recall affecting the %%VehicleRecallComponent%%.<break time="500ms"/>%%VehicleRecallDetails%%.</p>`,
    VEHICLE_RECALLS_END_MSG: `<p>That's all the information I have for your %%VehicleRecallYear%% %%VehicleRecallMake%% %%VehicleRecallModel%% vehicle. Do you want me to repeat the recall information for this vehicle?  </p>`,
    VEHICLE_RECALLS_SENT_SMS: `I've sent you a text message with your vehicle recall information.`,
    VEHICLE_RECALLS_TRY_SEARCH_AGAIN: `Would you like to try to search again?`,
    VEHCILE_RECALLS_GOODBYE_MSG: `OK! Have a good day!`,
    VEHCILE_RECALLS_LOOK_FOR_ANOTHER_RECALL: `Do you want me to look for recalls for another recall?`

    // ...more...
  }
}
