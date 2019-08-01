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
      `Bonjour! Je suis ton assistante pour les rappels de sécurité. Je peux t'informer sur les rappels de sécurité au Canada.`,
      `Salut! Je suis ton assistante pour les rappels de sécurité, et je peux t'informer sur les rappels de sécurité pour ton véhicule.`
    ],

    CARD_TXT_VEHICLE_WELCOME_FOLLOW_UP_QUESTION: 'Quelle est la marque de ton véhicule?', // I need translation (Lisa: The reprompt here in French was just a repetition)
    // LAUNCH REPROMPT
    SPEECH_TXT_VEHICLE_MAKE_REPROMPT: `Quelle est le frabriquant de ton véhicule?`,

    // GOODBYE STRING
    SPEECH_TXT_VEHCILE_RECALLS_GOODBYE: `OK! Passe une bonne journée!`,

    // COMFIRMATION OF MAKE, MODEL, AND YEAR
    SPEECH_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR: `Juste pour confirmer, est-ce que tu cherches un véhicule ${VEHICLE_SPEECH_VERSION}?`,

    // SEARCH RESULT STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE: `Je n’ai trouvé aucun rappel associé à ton véhicule dans notre système.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE: `J’ai trouvé un rappel qui pourrait affecter ton véhicule ${VEHICLE_SPEECH_VERSION}. Je t'ai envoyé l’information sur le rappel par texto.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `J’ai trouvé ${RECALL_COUNT} rappels qui pourraient affecter ton véhicule ${VEHICLE_SPEECH_VERSION}. Je t'ai envoyé l’information sur les rappels par texto.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `Désolé, je n’ai aucune information sur ton véhicule ${VEHICLE_SPEECH_VERSION} en ce moment. Je suis encore une assistante vocale en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle des Rappels de Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Humm... J’ai trouvé plusieurs modèles pour ${VEHICLE_SPEECH_VERSION}.`,

    // SEARCH RESULT FOLLOW UP QUESTION STRINGS
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Veux-tu que je trouve les rappels de sécurité pour un autre véhicule?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `Veux-tu que je te lise les rappels?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `Veux-tu que te je lise les rappels?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Est-ce que le tien est un ${AMBIGIOUS_MODELS}?`,
    AMBIGIOUS_MODEL_COMMAND_OPTION_NEITHER: `aucun de ces modèles`, // I need translation (Lisa: as discussed, here I would translate both "netiher" and "none of these" as " aucun de ces modèles")
    AMBIGIOUS_MODEL_COMMAND_OPTION_NONE_OF_THESE: `aucun de ces modèles`, // I need translation (Lisa: same) 
    OR: "ou",
    // READING RECALLS STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_READING_INTRO: `Lorsque je te lis l’information sur les rappels de véhicules, tu peux sauter au rappel suivant à n’importe quel moment en disant Alexa, prochain.`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DETAILS: `Le ${RECALL_DATE}, un rappel de sécurité affectant le ${RECALL_COMPONENT} à été émit.<break time="500ms"/>${RECALL_DETAILS}.`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DONE: `C’est tout ce que j’ai comme information sur ton véhicule ${VEHICLE_SPEECH_VERSION}. Veux-tu que je répète l’information sur les rappels de sécurité pour ce véhicule?`,
    SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL: `Veux-tu entendre le prochain rappel?`,

    // MISCELLANEOUS STRINGS
    SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN: `Veux-tu essayer de chercher encore une fois?`,
    SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL: `Veux-tu que je trouve les rappels de sécurité pour un autre véhicule?`,

    // HELP
    SPEECH_TXT_VEHICLE_HELP: `Bienvenue dans le mode d'Aide. Si tu as besoin de chercher un autre véhicule, dit "recherche"`,

    // ERROR STRINGS
    SPEECH_TXT_VEHICLE_ERROR_MODEL_VALIDATION_FAILED: `Je m'excuse. Je n’ai pas d’information sur ton véhicule ${VEHICLE_SPEECH_VERSION} en ce moment. Je suis encore une assistante vocale en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_UNEXPECTED_UTTERANCE: `Je ne suis pas certaine. Je m'excuse, je suis encore une assistante vocale en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT: `Humm...Je ne m'attendais pas à cette réponse. Si tu veux faire une autre recherche pour ton véhicle, dit "véhicule"`,
    SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE: `Je m'excuse. Je suis encore une assistante vocale en formation et j’ai quelques difficultés de compréhension. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_SEARCH_MAX_ATTEMPT_REACH: `Je m'excuse. J'ai de la difficulté à identifier ton véhicule. As-tu besoin de plus d'aide?`,
    SPEECH_TXT_VEHICLE_GET_HELP: `Ok. Pour de l'aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_YEAR_INTENT_TRIGGERED_NO_MODEL_MAKE_PROVIDED: `Désolé, ce n'est pas l'information que je cherchais.`, // I need translation (Lisa: I translated, but the context is still a bit unclear)

    // SMS MESSAGE
    VEHICLE_RECALL_TEXT_FOUND_NONE_MESSAGE: `De Transports Canada: Bonjour! Je suis ton assistante pour les rappels de sécurité des véhicules. Ton véhicule ${VEHICLE_CARD_VERSION} a 0 rappels. Tu peux voir cela à http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&${QUERY_STRING}&ft=&ls=0&sy=0`, 
    VEHICLE_RECALL_TEXT_FOUND_ONE_MESSAGE: `De Transports Canada: Bonjour! Je suis ton assistante pour les rappels de sécurité des véhicules. Ton véhicule ${VEHICLE_CARD_VERSION} a 1 rappel. Tu peux voir plus d'information à http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&${QUERY_STRING}&ft=&ls=0&sy=0`,
    VEHICLE_RECALL_TEXT_FOUND_MULTIPLE_MESSAGE: `De Transports Canada: Bonjour! Je suis ton assistante pour les rappels de sécurité des véhicules. Ton véhicule ${VEHICLE_CARD_VERSION} a ${RECALL_COUNT} rappels. Tu peux voir plus d'information à http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&${QUERY_STRING}&ft=&ls=0&sy=0`,

    /// //// ALEXA CARDS \\\\\\
    CARD_TXT_VEHICLE_RECALLS_READING_DETAILS: `Le ${RECALL_DATE} un rappel affectait la ${RECALL_COMPONENT}. ${RECALL_DETAILS}`, // I need translation (Lisa: I translated, but more context would be helpful here too - how is the date presented? does it fit into this sentence structure?)

    // SEARCH RESULT CARDS
    CARD_TXT_VEHICLE_RECALLS_FOUND_NONE: `Je n'ai trouvé aucun rappel dans le système pour ton véhicule ${VEHICLE_SPEECH_VERSION}.`, // I need translation (Lisa: is it ok to use "aucun" in this case instead of 0?) 
    CARD_TXT_VEHICLE_RECALLS_FOUND_ONE: `J'ai trouvé un rappel pour ton véhicule ${VEHICLE_SPEECH_VERSION}.`, // I need translation (Lisa: done, but would like to test in context) 
    CARD_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `${RECALL_COUNT} rappels pourraient affecter ton véhicule ${VEHICLE_SPEECH_VERSION}.`, // I need translation (Lisa: done, but would like to test in context)
    CARD_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `Ton véhicule ${VEHICLE_SPEECH_VERSION} n'est pas dans notre système. Si tu as besoin d'aide, tu peux contecter le service à la clientèle pour les rappels de véhicules Transport Canada à ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_CARD_VERSION}.`, // I need translation (Lisa: done, but would like to test in context)
    CARD_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm... J'ai trouvé plusieurs différents modèles de ton véhicule ${VEHICLE_SPEECH_VERSION}. Est-ce que le tien est un ${AMBIGIOUS_MODELS}?`, // I need translation (Lisa: done, but would like to test in context)
    CARD_TXT_VEHICLE_RECALLS_QUERY_DETAILS_TITLE: `Voici les détails sur les rappels pour ton véhicule ${VEHICLE_SPEECH_VERSION} qui affectent le ${RECALL_COMPONENT}`, // I need translation (Lisa: done, but definitly need more context here. For example, I'm not sure what "RECALL_COMPONENT" is)

    // DEBUG CARDS
    CARD_TXT_VEHCILE_SHOW_MAKE_MODEL_PROVIDED: `utterance resolved to: "${MAKE} ${MODEL}"`,
    CARD_TXT_VEHCILE_SHOW_MAKE_PROVIDED: `utterance resolved to: "${MAKE}"`,
    CARD_TXT_VEHCILE_SHOW_MODEL_PROVIDED: `utterance resolved to: "${MODEL}"`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_MODEL_TITLE: `Search Query: Make and Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MODEL_TITLE: `Search Query: Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_TITLE: `Search Query: Make given`

  }
}
