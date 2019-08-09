// CONSTANTS
const QUERY_STRING = `%%QueryString%%`

const MAKE = `%%VehicleRecallMake%%`
const MODEL = `%%VehicleRecallModel%%`
const YEAR = `%%VehicleRecallYear%%`

const VEHICLE_SPEECH_VERSION = `${YEAR} ${MAKE} ${MODEL}`
const VEHICLE_CARD_VERSION = `${YEAR} ${MAKE} ${MODEL}`

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
  recalls: `<phoneme alphabet='ipa' ph='ri.ka:lz'>recalls</phoneme>`,
  transportCanadaRecalls: `Transport Canada <phoneme alphabet='ipa' ph='ri.ka:lz'>Recalls</phoneme>`
}

module.exports = {
  translation: {
    // LAUNCH STRING
    SPEECH_TXT_VEHICLE_WELCOME_MSG: [
      `Hello! I'm your Canadian Safety ${PHONEMES.recalls} Assistant. I can help you find vehicle ${PHONEMES.recall} information. Let's get started.`,
      `Hi there! I'm your Canadian Safety ${PHONEMES.recalls} Assistant, and I can help you find your vehicle ${PHONEMES.recall} information. Let's start.`
    ],

    SPEECH_VEHICLE_WELCOME_FOLLOW_UP_QUESTION: 'what is the make of your vehicle?', // only used for the AMAZON.REPEAT_INTENT

    CARD_TXT_VEHICLE_WELCOME_FOLLOW_UP_QUESTION: 'What make is your vehicle?',
    CARD_TXT_VEHICLE_WELCOME_TITLE: 'Recall Search',

    // LAUNCH REPROMPT
    SPEECH_TXT_VEHICLE_MAKE_REPROMPT: `What brand makes your model?`,

    // GOODBYE STRING
    SPEECH_TXT_VEHCILE_RECALLS_GOODBYE: `OK! Have a good day!`,

    // COMFIRMATION OF MAKE, MODEL, AND YEAR
    SPEECH_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR: `Just to make sure I understood correctly, are you looking for a ${VEHICLE_SPEECH_VERSION}?`,
    CARD_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR: `Just to make sure I understood correctly, are you looking for a ${VEHICLE_CARD_VERSION}?`,
    CARD_TXT_VEHCILE_COMFIRM_TITLE: `Confirmation`,

    // SEARCH RESULT STRINGS FOR SPEECH
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE: `There are no ${PHONEMES.recalls} associated with your vehicle in our system.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE: `I've found a ${PHONEMES.recall} that may affect your ${VEHICLE_SPEECH_VERSION}. `,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `I've found ${RECALL_COUNT} ${PHONEMES.recalls} that may affect your ${VEHICLE_SPEECH_VERSION}.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `I'm sorry. I don't have any information on your ${VEHICLE_SPEECH_VERSION} at the moment. I'm still a voice assistant in training. Please contact my human friends at ${PHONEMES.transportCanadaRecalls} customer suppport at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION} for more help.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm... I've found a few different models of ${VEHICLE_SPEECH_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_SEARCH_RESULT_TITLE: `Search Results`,

    // SPEECH PHONE NUMBER
    SPEECH_TXT_PHONE_NUMBER_RETRIEVED: `I've sent you a text message with your vehicle ${PHONEMES.recall} information,`,
    SPEECH_TXT_PHONE_NUMBER_RETRIEVAL_NO_ACCESS: `If you'd like to receive a text message with the search results, you'll need to provide permission to access your mobile number through the skill settings. I've sent some information to your Alexa app to help you get started. In the meantime,`,
    SPEECH_TXT_PHONE_NUMBER_NOT_FOUND: `If you'd like to receive a text message with your search results, you'll need to add a phone number to your Alexa account. In the meantime`,
    SPEECH_TXT_PHONE_NUMBER_RETRIEVAL_ERROR: ``,



    // SEARCH RESULT FOLLOW UP QUESTION STRINGS
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Would you like to search for another vehicle ${PHONEMES.recall}?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `would you like me to read them to you?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `would you like me to read them to you?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Is yours a ${AMBIGIOUS_MODELS}?`,

    // Hmm... I've found a few different models of 2009 honda civic. Is yours a CIVIC or CIVIC HYBRID or neither?
    AMBIGIOUS_MODEL_COMMAND_OPTION_NEITHER: `neither`,
    // Hmm... I've found a few different models of 2009 honda civic. Is yours a CIVIC or CIVIC HYBRID, CIVIC SI or none of these?
    AMBIGIOUS_MODEL_COMMAND_OPTION_NONE_OF_THESE: `none of these`,
    OR: 'or',
    // READING RECALLS STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_READING_INTRO: `While I'm reading you the ${PHONEMES.recall} information, at any point you can skip to the next ${PHONEMES.recall} by saying "Alexa skip". `,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DETAILS: `On ${RECALL_DATE} there was a ${PHONEMES.recall} affecting the ${RECALL_COMPONENT}.<break time="500ms"/> ${RECALL_DETAILS}`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DONE: `That's all the information I have for your ${VEHICLE_SPEECH_VERSION}. Do you want me to repeat the ${PHONEMES.recall} information for this vehicle? `,
    SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL: `Would you like to hear the next ${PHONEMES.recall}?`,

    // MISCELLANEOUS STRINGS
    SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN: `Would you like to try to search again?`,
    SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL: `Do you want me to look for ${PHONEMES.recalls} for another vehicle?`,

    // HELP
    SPEECH_TXT_VEHICLE_HELP: `Welcome to the help mode. If you need to search for a new vehicle, say "search"`,

    // ERROR STRINGS
    SPEECH_TXT_VEHICLE_ERROR_FALLBACK_INTENT: `Sorry, I didn't understand that. You can search for vehicle recalls by saying "search". If you can't find what you're looking for, you can contact my human friends at Transport Canada by calling ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}`,
    SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT: `Hmm... I was not expecting that response, if you want to search for your vehicle again, say "search"`,
    SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE: `I'm sorry. I’m still a voice assistant in training and I'm having trouble understanding. Please contact my human friends at ${PHONEMES.transportCanadaRecalls} customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION} for more help. Have a good day.`,
    SPEECH_TXT_VEHICLE_ERROR_SEARCH_MAX_ATTEMPT_REACH: `I'm sorry. It looks like I'm having trouble identifying the correct vehicle, would you like some additional help?`,
    SPEECH_TXT_VEHICLE_GET_HELP: `Okay, please contact my human friends at ${PHONEMES.transportCanadaRecalls} customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION} for more help. Have a good day.`,
    SPEECH_TXT_VEHICLE_ERROR_YEAR_INTENT_TRIGGERED_NO_MODEL_MAKE_PROVIDED: `Sorry, that was not the information I was looking for.`,
    CARD_TXT_VEHICLE_ERROR_CONTACT_HELP: `Please contact Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_CARD_VERSION} for more help.`,
    CARD_TXT_VEHICLE_ERROR_CONTACT_HELP_TITLE: `Help`,

    // SMS MESSAGE
    VEHICLE_RECALL_TEXT_FOUND_NONE_MESSAGE: `From Transport Canada: Hi! I'm your Vehicle Recall Assistant. 0 recalls may affect your ${VEHICLE_CARD_VERSION}. You can see this at, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&${QUERY_STRING}&ft=&ls=0&sy=0`,
    VEHICLE_RECALL_TEXT_FOUND_ONE_MESSAGE: `From Transport Canada: Hi! I'm your Vehicle Recall Assistant. 1 recall may affect your ${VEHICLE_CARD_VERSION}. You can find more information at, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&${QUERY_STRING}&ft=&ls=0&sy=0`,
    VEHICLE_RECALL_TEXT_FOUND_MULTIPLE_MESSAGE: `From Transport Canada: Hi! I'm your Vehicle Recall Assistant. ${RECALL_COUNT} recalls may affect your ${VEHICLE_CARD_VERSION}. You can find more information at, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&${QUERY_STRING}&ft=&ls=0&sy=0`,

    /// //// ALEXA CARDS \\\\\\
    CARD_TXT_VEHICLE_RECALLS_READING_DETAILS: `On ${RECALL_DATE} there was a recall affecting the ${RECALL_COMPONENT}. ${RECALL_DETAILS}`,

    // SEARCH RESULT CARDS
    CARD_TXT_VEHICLE_RECALLS_FOUND_NONE: `0 recalls found in our system ${VEHICLE_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_ONE: `1 recall found that may affect your ${VEHICLE_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `${RECALL_COUNT} recalls found that may affect your ${VEHICLE_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `${VEHICLE_CARD_VERSION} not in system. Need help, contact Transport Canada Recalls customer suppport at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm... I've found a few different models of ${VEHICLE_CARD_VERSION}. Is yours a ${AMBIGIOUS_MODELS}?`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_DETAILS_TITLE: `Recall Details for: ${VEHICLE_CARD_VERSION}, affecting the ${RECALL_COMPONENT}`,

    // DEBUG CARDS
    CARD_TXT_VEHCILE_SHOW_MAKE_MODEL_PROVIDED: `utterance resolved to: "${MAKE} ${MODEL}"`,
    CARD_TXT_VEHCILE_SHOW_MAKE_PROVIDED: `utterance resolved to: "${MAKE}"`,
    CARD_TXT_VEHCILE_SHOW_MODEL_PROVIDED: `utterance resolved to: "${MODEL}"`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_MODEL_TITLE: `Search Query: Make and Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MODEL_TITLE: `Search Query: Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_TITLE: `Search Query: Make given`
  }
}
