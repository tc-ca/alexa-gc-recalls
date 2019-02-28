
// CONSTANTS
const TELL_ME_YOUR_MAKE = `Let's get started. What is the make of your vehicle?`
const MAKE_ID = `%%VehicleRecallMakeId%%`
const MAKE = `%%VehicleRecallMake%%`
const MODEL = `%%VehicleRecallModel%%`
const YEAR = `%%VehicleRecallYear%%`
const FROM_YEAR = `%%VehicleRecallFromYear%%`
const TO_YEAR = `%%VehicleRecallToYear%%`
const VEHICLE_MAKE_MODEL_YEAR = `${YEAR} ${MAKE} ${MODEL}`
const RECALL_COUNT = `%%RecallCount%%`
const RECALL_DATE = `%%VehicleRecallDate%%`
const RECALL_COMPONENT = `%%VehicleRecallComponent%%`
const RECALL_DETAILS = `%%VehicleRecallDetails%%`
const AMBIGIOUS_MODELS = `%%AmbigiousModelsList%%`

const TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER = `<say-as interpret-as="telephone">18003330510</say-as>`

// ALEXA'S PRONUNCIATION
const PHONEMES = {
  recall: `<phoneme alphabet="ipa" ph="ri.kɔ:l">recall</phoneme>`,
  recalls: `<phoneme alphabet="ipa" ph="ri.kɔ:lz">recalls</phoneme>` }

module.exports = {
  translation: {
    // HELLO STRING
    SPEECH_TXT_VEHICLE_WELCOME_MSG: `Hello! I'm your Canadian Safety Recalls Assistant. I can help you find vehicle ${PHONEMES.recall} information. ${TELL_ME_YOUR_MAKE}`,

    // GOODBYE STRING
    SPEECH_TXT_VEHCILE_RECALLS_GOODBYE: `OK! Have a good day!`,

    // SEARCH RESULT STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE: `There are no ${PHONEMES.recalls} associated with your vehicle in our system.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE: `<p>I've found a ${PHONEMES.recall} potentially affecting your ${VEHICLE_MAKE_MODEL_YEAR}. I've sent you a text message with your vehicle ${PHONEMES.recall} information.</p>`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `<p>I've found ${RECALL_COUNT} ${PHONEMES.recalls} potentially affecting your ${VEHICLE_MAKE_MODEL_YEAR}. I've sent you a text message with your vehicle ${PHONEMES.recall} information.</p>`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `I'm sorry. I don't have any information on your ${VEHICLE_MAKE_MODEL_YEAR} at the moment. I'm still a voice assistant in training. Please contact my human friends at Transport Canada Recalls customer suppport at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER} for more help.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm... I've found a few different models of ${VEHICLE_MAKE_MODEL_YEAR}.`,
    SPEECH_TXT_VEHICLE_SLOT_VALUES_NOT_FOUND: `Hmm...I didn't find your ${VEHICLE_MAKE_MODEL_YEAR} in my database. To help me with my search please only include the vehicle model name and not any trim packages.`,

    // SEARCH RESULT FOLLOW UP QUESTION STRINGS
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Would you like to search for another vehicle ${PHONEMES.recall}?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `Would you like me to read it to you?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `Would you like me to read it to you?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NON_VALID: `What is your vehicle model?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Is yours a ${AMBIGIOUS_MODELS}?`,

    // READING RECALLS STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_READING_INTRO: `While I'm reading you the ${PHONEMES.recall} information, at any point you can skip to the next ${PHONEMES.recall} by saying "Alexa skip". `,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DETAILS: `<p>On ${RECALL_DATE} there was a ${PHONEMES.recall} affecting the ${RECALL_COMPONENT}.<break time="500ms"/> ${RECALL_DETAILS}</p>`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DONE: `<p>That's all the information I have for your ${VEHICLE_MAKE_MODEL_YEAR} vehicle. Do you want me to repeat the ${PHONEMES.recall} information for this vehicle?  </p>`,
    SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL: `Would you like to hear the next ${PHONEMES.recall}?`,

    // MISCELLANEOUS STRINGS
    SPEECH_TXT_VEHICLE_TELL_ME_YOUR_MAKE: `${TELL_ME_YOUR_MAKE}`,
    SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN: `Would you like to try to search again?`,
    SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL: `Do you want me to look for ${PHONEMES.recalls} for another vehicle?`,

    // ERROR STRINGS
    SPEECH_TXT_VEHICLE_ERROR_MODEL_VALIDATION_FAILED: `I'm sorry, I don't have any information on your ${VEHICLE_MAKE_MODEL_YEAR} at the moment. I'm still a voice assistant in training. Please contact my human friends at Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER} for more help.`,
    SPEECH_TXT_VEHICLE_ERROR_UNEXPECTED_UTTERANCE: `I'm not sure. I'm sorry, I'm still a voice assistant in training. Please contact my human friends at Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER} for more help.`,
    SPEECH_TXT_VEHICLE_ERROR_FAILED_MAX_ATTEMPTS: `I'm sorry. I’m still a voice assistant in training and I'm having trouble understanding. Please contact my human friends at Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER} for more help.`,
    SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT: `Hmm... I was not expecting that response, you can say start over`,
    SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE: `I'm sorry. I’m still a voice assistant in training and I'm having trouble understanding. Please contact my human friends at Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER} for more help.`,

    // SMS MESSAGE
    VEHICLE_RECALL_TEXT_MESSAGE: `From Transport Canada: Here's your recall information, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&mk=${MAKE_ID}&md=${MODEL}&fy=${FROM_YEAR}&ty=${TO_YEAR}&ft=&ls=0&sy=0`

  }
}
