
// CONSTANTS
const QUERY_STRING = `%%QueryString%%`
const MAKE = `%%VehicleRecallMake%%`
const MODEL = `%%VehicleRecallModel%%`
const YEAR = `%%VehicleRecallYear%%`
const VEHICLE = `${YEAR} ${MAKE} ${MODEL}`
const RECALL_COUNT = `%%RecallCount%%`
const RECALL_DATE = `%%VehicleRecallDate%%`
const RECALL_COMPONENT = `%%VehicleRecallComponent%%`
const RECALL_DETAILS = `%%VehicleRecallDetails%%`
const AMBIGIOUS_MODELS = `%%AmbigiousModelsList%%`

const TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION = `<say-as interpret-as="telephone">18003330510</say-as>`
const TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_CARD_VERSION = `1-800-333-0510`

// ALEXA'S PRONUNCIATION
const PHONEMES = {
  recall: `<phoneme alphabet='ipa' ph='ri.ka:l'>recall</phoneme>`,
  recalls: `<phoneme alphabet='ipa' ph='ri.ka:lz'>recalls</phoneme>` }

module.exports = {
  translation: {
    // LAUNCH STRING
    SPEECH_TXT_VEHICLE_WELCOME_MSG: [
      `Hello! I'm your Canadian Safety ${PHONEMES.recalls} Assistant. I can help you find vehicle ${PHONEMES.recall} information. Let's get started.`,
      `Hi there! I'm your Canadian Safety ${PHONEMES.recalls} Assistant, and I can help you find your vehicle ${PHONEMES.recall}information. Let's start.`
    ],
    // LAUNCH REPROMPT
    SPEECH_TXT_VEHICLE_MAKE_REPROMPT: `What brand makes your model?`,

    // GOODBYE STRING
    SPEECH_TXT_VEHCILE_RECALLS_GOODBYE: `OK! Have a good day!`,

    // COMFIRMATION OF MAKE, MODEL, AND YEAR
    SPEECH_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR: `Just to make sure I understood correctly, are you looking for a ${VEHICLE}?`,

    // What is your make? Your answer was: 

    // SEARCH RESULT STRINGS FOR SPEECH
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE: `There are no ${PHONEMES.recalls} associated with your vehicle in our system.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE: `I've found a ${PHONEMES.recall} that may affect your ${VEHICLE}. I've sent you a text message with your vehicle ${PHONEMES.recall} information.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `I've found ${RECALL_COUNT} ${PHONEMES.recalls} that may affect your ${VEHICLE}. I've sent you a text message with your vehicle ${PHONEMES.recall} information.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `I'm sorry. I don't have any information on your ${VEHICLE} at the moment. I'm still a voice assistant in training. Please contact my human friends at Transport Canada Recalls customer suppport at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION} for more help.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm... I've found a few different models of ${VEHICLE}.`,



    // SEARCH RESULT FOLLOW UP QUESTION STRINGS
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Would you like to search for another vehicle ${PHONEMES.recall}?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `Would you like me to read it to you?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `Would you like me to read it to you?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Is yours a ${AMBIGIOUS_MODELS} or none of these?`,

    // READING RECALLS STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_READING_INTRO: `While I'm reading you the ${PHONEMES.recall} information, at any point you can skip to the next ${PHONEMES.recall} by saying "Alexa skip". `,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DETAILS: `On ${RECALL_DATE} there was a ${PHONEMES.recall} affecting the ${RECALL_COMPONENT}.<break time="500ms"/> ${RECALL_DETAILS}`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DONE: `That's all the information I have for your ${VEHICLE} vehicle. Do you want me to repeat the ${PHONEMES.recall} information for this vehicle? `,
    SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL: `Would you like to hear the next ${PHONEMES.recall}?`,

    // MISCELLANEOUS STRINGS
    SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN: `Would you like to try to search again?`,
    SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL: `Do you want me to look for ${PHONEMES.recalls} for another vehicle?`,

    // ERROR STRINGS
    SPEECH_TXT_VEHICLE_ERROR_MODEL_VALIDATION_FAILED: `I'm sorry, I don't have any information on your ${VEHICLE} at the moment. I'm still a voice assistant in training. Please contact my human friends at Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION} for more help. Have a good day.`,
    SPEECH_TXT_VEHICLE_ERROR_UNEXPECTED_UTTERANCE: `I'm not sure. I'm sorry, I'm still a voice assistant in training. Please contact my human friends at Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION} for more help. Have a good day.`,
    SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT: `Hmm... I was not expecting that response, you can say start over`,
    SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE: `I'm sorry. I’m still a voice assistant in training and I'm having trouble understanding. Please contact my human friends at Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION} for more help. Have a good day.`,
    SPEECH_TXT_VEHICLE_ERROR_SEARCH_MAX_ATTEMPT_REACH: `I'm sorry. It looks like I'm having trouble identifying the correct vehicle, would you like some additional help?`,
    SPEECH_TXT_VEHICLE_GET_HELP: `Okay, please contact my human friends at Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION} for more help. Have a good day.`,
    SPEECH_TXT_VEHICLE_ERROR_YEAR_INTENT_TRIGGERED_NO_MODEL_MAKE_PROVIDED: `Sorry, that was not the information I wasn't looking for`,

    // SMS MESSAGE
    VEHICLE_RECALL_TEXT_FOUND_NONE_MESSAGE: `From Transport Canada: Hi! I'm your Vehicle Recall Assistant. 0 recalls may affect your ${VEHICLE}. You can see this at, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&${QUERY_STRING}&ft=&ls=0&sy=0`,
    VEHICLE_RECALL_TEXT_FOUND_ONE_MESSAGE: `From Transport Canada: Hi! I'm your Vehicle Recall Assistant. 1 recall may affect your ${VEHICLE}. You can find more information at, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&${QUERY_STRING}&ft=&ls=0&sy=0`,
    VEHICLE_RECALL_TEXT_FOUND_MULTIPLE_MESSAGE: `From Transport Canada: Hi! I'm your Vehicle Recall Assistant. ${RECALL_COUNT} recalls may affect your ${VEHICLE}. You can find more information at, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&${QUERY_STRING}&ft=&ls=0&sy=0`,

    // ALEXA CARDS
    CARD_TXT_VEHICLE_RECALLS_READING_DETAILS: `On ${RECALL_DATE} there was a recall affecting the ${RECALL_COMPONENT}. ${RECALL_DETAILS}`,

    CARD_TXT_VEHCILE_SHOW_MAKE_MODEL_PROVIDED: `I heard you say: "${MAKE} ${MODEL}"`,
    CARD_TXT_VEHCILE_SHOW_MAKE_PROVIDED: ` I heard you say: "${MAKE}"`,
    CARD_TXT_VEHCILE_SHOW_MODEL_PROVIDED: `I heard you say: "${MODEL}"`,
    CARD_TXT_VEHCILE_SHOW_YEAR_PROVIDED: `I heard you say: "${YEAR}"`,
    
    CARD_TXT_VEHCILE_SHOW_COMFIRMATION_NO_TITLE: `Vehicle Not Comfirmed`,
    CARD_TXT_VEHCILE_SHOW_COMFIRMATION_NO: ` You said "no" to  "Just to make sure I understood correctly, are you looking for a ${VEHICLE}?" `,

    // SEARCH RESULT STRINGS FOR CARDS
    CARD_TXT_VEHICLE_RECALLS_FOUND_NONE: `0 recalls found in our system ${VEHICLE}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_ONE: `1 recall found that may affect your ${VEHICLE}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `${RECALL_COUNT} recalls found that may affect your ${VEHICLE}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `${VEHICLE} not in system. Need help, contact Transport Canada Recalls customer suppport at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm... I've found a few different models of ${VEHICLE}. Is yours a ${AMBIGIOUS_MODELS}?`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_TITLE: `Search Result for: ${VEHICLE}`,
    CARD_TXT_VEHICLE_RECALLS_AMBIGIOUS_MODEL_FOUND_TITLE: `Ambigious Model Found for: ${VEHICLE}`,

    CARD_TXT_VEHICLE_RECALLS_DETAILS_TITLE: `Recall Info on ${VEHICLE}`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_TITLE: `Search Query`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_MODEL_TITLE: `Search Query: Make and Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MODEL_TITLE: `Search Query: Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_TITLE: `Search Query: Make given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_YEAR_TITLE: `Search Query: Year given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_DETAILS_TITLE: `Recall Details for: ${VEHICLE}, affecting the ${RECALL_COMPONENT}`

  }
}
