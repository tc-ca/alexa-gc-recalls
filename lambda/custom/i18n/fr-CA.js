// CONSTANTS
const QUERY_STRING = `%%QueryString%%`

const MAKE = `%%VehicleRecallMake%%`
const MODEL = `%%VehicleRecallModel%%`
const YEAR = `%%VehicleRecallYear%%`

const VEHICLE_SPEECH_VERSION = `${MAKE} ${MODEL} <break time="100ms"/> ${YEAR}`
const VEHICLE_CARD_VERSION = `${MAKE} ${MODEL} ${YEAR}`

const RECALL_COUNT = `%%RecallCount%%`
const RECALL_DATE = `%%VehicleRecallDate%%`
const RECALL_COMPONENT = `%%VehicleRecallComponent%%`
const RECALL_DETAILS = `%%VehicleRecallDetails%%`
const AMBIGIOUS_MODELS = `%%AmbigiousModelsList%%`

const TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION = `<say-as interpret-as="telephone">18003330510</say-as>`
const TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_CARD_VERSION = `1-800-333-0510`

// ALEXA'S PRONUNCIATION
// const PHONEMES = { }





module.exports = {
  translation: {
    // LAUNCH STRING
    SPEECH_TXT_VEHICLE_WELCOME_MSG: [
      `Bonjour! Je suis votre assistante pour les rappels de sécurité. Je peux t'informer sur les rappels de sécurité au Canada.`,
      `Salut! Je suis votre assistante pour les rappels de sécurité, et je peux t'informer sur les rappels de sécurité de ton véhicule.`
    ],

    CARD_TXT_VEHICLE_WELCOME_FOLLOW_UP_QUESTION: 'Quelle est la marque de ton véhicule?', // I need translation (Lisa: The reprompt here in French was just a repetition)
    // LAUNCH REPROMPT
    SPEECH_TXT_VEHICLE_MAKE_REPROMPT: `Quelle est la marque de ton véhicule?`,

    // GOODBYE STRING
    SPEECH_TXT_VEHCILE_RECALLS_GOODBYE: `OK! Passe une bonne journée!`,

    // COMFIRMATION OF MAKE, MODEL, AND YEAR
    SPEECH_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR: `Juste pour vérifier, est-ce que tu cherches un ${VEHICLE_SPEECH_VERSION}?`,

    // SEARCH RESULT STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE: `Je n’ai pas trouvé de rappels associés avec ton véhicule dans notre système.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE: `J’ai trouvé un rappel qui pourrait affecter ton ${VEHICLE_SPEECH_VERSION}. Je t'ai envoyé l’information sur les rappels par texto.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `J’ai trouvé ${RECALL_COUNT} rappels qui pourraient affecter ton ${VEHICLE_SPEECH_VERSION}. Je t'ai envoyé l’information sur les rappels par texto.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `Je m'excuse. Je n’ai pas d’information sur ton ${VEHICLE_SPEECH_VERSION} en ce moment. Je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Humm...J’ai besoin de plus d’information sur le modèle.`,

    // SEARCH RESULT FOLLOW UP QUESTION STRINGS
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Veux-tu que je trouve les rappels de sécurité d’un autre véhicule?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `Veux-tu que je lise les rappels?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `Veux-tu que je lise les rappels?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Est-ce que le tien est un ${AMBIGIOUS_MODELS}?`,
    AMBIGIOUS_MODEL_COMMAND_OPTION_NEITHER: `aucun de ces modèles`, // I need translation (Lisa: as discussed, here I would translate both "netiher" and "none of these" as " aucun de ces modèles")
    AMBIGIOUS_MODEL_COMMAND_OPTION_NONE_OF_THESE: `aucun de ces modèles`, // I need translation (Lisa: same) 
    
    // READING RECALLS STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_READING_INTRO: `Lorsque je vais lire l’information sur les rappels de véhicules, tu pourras sauter au prochain rappel à n’importe quel moment en disant Alexa, prochain.`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DETAILS: `Le ${RECALL_DATE}, il y avait un rappel de sécurité affectant le ${RECALL_COMPONENT}.<break time="500ms"/>${RECALL_DETAILS}.`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DONE: `C’est tout ce que j’ai comme information sur ton ${VEHICLE_SPEECH_VERSION}. Veux-tu que je répète l’information sur les rappels de sécurité pour ce véhicule?`,
    SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL: `Veux-tu entendre le prochain rappel?`,

    // MISCELLANEOUS STRINGS
    SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN: `Veux-tu essayer de chercher encore une fois?`,
    SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL: `Veux-tu que je trouve les rappels de sécurité d’un autre véhicule?`,

    // HELP
    SPEECH_TXT_VEHICLE_HELP: `Bienvenue dans le mode d'Aide. Si tu as besoin de chercher un autre véhicule, dit "recherche"`,

    // ERROR STRINGS
    SPEECH_TXT_VEHICLE_ERROR_MODEL_VALIDATION_FAILED: `Je m'excuse. Je n’ai pas d’information sur ton ${VEHICLE_SPEECH_VERSION} en ce moment. Je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_UNEXPECTED_UTTERANCE: `Je ne suis pas certaine. Je m'excuse, je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT: `Humm...Je ne m'attendais pas à cette réponse. Si tu veux faire une autre recherche pour ton véhicle, dit "véhicule"`,
    SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE: `Je m'excuse. Je suis encore un assistant vocal en formation et j’ai quelques difficultés de compréhension. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_SEARCH_MAX_ATTEMPT_REACH: `Je m'excuse. J'ai de la difficulté à identifier ton véhicule. As-tu besoin de plus d'aide?`,
    SPEECH_TXT_VEHICLE_GET_HELP: `Ok. Pour de l'aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_YEAR_INTENT_TRIGGERED_NO_MODEL_MAKE_PROVIDED: `Désolé, ce n'est pas l'information que je cherchais.`, // I need translation (Lisa: I translated, but the context is still a bit unclear)

    // SMS MESSAGE
    VEHICLE_RECALL_TEXT_FOUND_NONE_MESSAGE: `De Transports Canada: Bonjour! Je suis votre assistant pour les rappels de sécurité des véhicules. Votre ${VEHICLE_CARD_VERSION} a 0 rappels. Vous pouvez voir cela à http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&${QUERY_STRING}&ft=&ls=0&sy=0`, 
    VEHICLE_RECALL_TEXT_FOUND_ONE_MESSAGE: `De Transports Canada: Bonjour! Je suis votre assistant pour les rappels de sécurité des véhicules. Votre ${VEHICLE_CARD_VERSION} a 1 rappel. Vous pouvez voir plus d'information à http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&${QUERY_STRING}&ft=&ls=0&sy=0`,
    VEHICLE_RECALL_TEXT_FOUND_MULTIPLE_MESSAGE: `De Transports Canada: Bonjour! Je suis votre assistant pour les rappels de sécurité des véhicules. Votre ${VEHICLE_CARD_VERSION} a ${RECALL_COUNT} rappels. Vous pouvez voir plus d'information à http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&${QUERY_STRING}&ft=&ls=0&sy=0`,

    /// //// ALEXA CARDS \\\\\\
    CARD_TXT_VEHICLE_RECALLS_READING_DETAILS: `Le ${RECALL_DATE} un rappel affectait la ${RECALL_COMPONENT}. ${RECALL_DETAILS}`, // I need translation (Lisa: I translated, but more context would be helpful here too - how is the date presented? does it fit into this sentence structure?)

    // SEARCH RESULT CARDS
    CARD_TXT_VEHICLE_RECALLS_FOUND_NONE: `On n'a trouvé aucun rappel dans le système ${VEHICLE_SPEECH_VERSION}.`, // I need translation (Lisa: is it ok to use "aucun" in this case instead of 0?) 
    CARD_TXT_VEHICLE_RECALLS_FOUND_ONE: `1 recall found that may affect your ${VEHICLE_SPEECH_VERSION}.`, // I need translation
    CARD_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `${RECALL_COUNT} recalls found that may affect your ${VEHICLE_SPEECH_VERSION}.`, // I need translation
    CARD_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `${VEHICLE_SPEECH_VERSION} not in system. Need help, contact Transport Canada Recalls customer suppport at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_CARD_VERSION}.`, // I need translation
    CARD_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm... I've found a few different models of ${VEHICLE_SPEECH_VERSION}. Is yours a ${AMBIGIOUS_MODELS}?`, // I need translation
    CARD_TXT_VEHICLE_RECALLS_QUERY_DETAILS_TITLE: `Recall Details for: ${VEHICLE_SPEECH_VERSION}, affecting the ${RECALL_COMPONENT}`, // I need translation

    // DEBUG CARDS
    CARD_TXT_VEHCILE_SHOW_MAKE_MODEL_PROVIDED: `utterance resolved to: "${MAKE} ${MODEL}"`,
    CARD_TXT_VEHCILE_SHOW_MAKE_PROVIDED: `utterance resolved to: "${MAKE}"`,
    CARD_TXT_VEHCILE_SHOW_MODEL_PROVIDED: `utterance resolved to: "${MODEL}"`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_MODEL_TITLE: `Search Query: Make and Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MODEL_TITLE: `Search Query: Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_TITLE: `Search Query: Make given`

  }
}
