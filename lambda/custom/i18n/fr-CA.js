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
      `Bonjour! Je suis ton assistante pour les rappels de sécurité. Je peux t'informer sur les rappels de sécurité des véhicules au Canada. Veux-tu commencer ?`,
      `Salut! Je suis ton assistante pour les rappels de sécurité, et je peux t'informer sur les rappels de sécurité des véhicules. Veux-tu commencer ?`,
    ],

    SPEECH_VEHICLE_WELCOME_FOLLOW_UP_QUESTION:
      "quelle est la marque de ton véhicule?", // only used for the AMAZON.REPEAT_INTENT

    CARD_TXT_VEHICLE_WELCOME_TITLE: "Recherche",

    // LAUNCH REPROMPT
    SPEECH_TXT_VEHICLE_MAKE_REPROMPT: `Quelle est la marque de ton véhicule?`,

    // GOODBYE STRING
    SPEECH_TXT_VEHCILE_RECALLS_GOODBYE: `OK! Passe une bonne journée!`,

    // COMFIRMATION OF MAKE, MODEL, AND YEAR
    SPEECH_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR: `Juste pour confirmer, est-ce que tu cherches un véhicule ${VEHICLE_SPEECH_VERSION}?`,
    CARD_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR: `Juste pour confirmer, est-ce que tu cherches un véhicule ${VEHICLE_CARD_VERSION}?`,
    CARD_TXT_VEHCILE_COMFIRM_TITLE: `Vérification`,

    // SEARCH RESULT STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE: `Je n’ai trouvé aucun rappel associé à ton véhicule dans notre système.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE: `J’ai trouvé un rappel qui pourrait affecter ton véhicule ${VEHICLE_SPEECH_VERSION}.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `J’ai trouvé ${RECALL_COUNT} rappels qui pourraient affecter ton véhicule ${VEHICLE_SPEECH_VERSION}.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `Désolé, je n’ai aucune information sur ton véhicule ${VEHICLE_SPEECH_VERSION} en ce moment. Je suis encore une assistante vocale en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle des Rappels de Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Humm... J’ai trouvé plusieurs modèles pour ${VEHICLE_SPEECH_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_SEARCH_RESULT_TITLE: `Résultats`,

    // SPEECH PHONE NUMBER
    SPEECH_TXT_PHONE_NUMBER_RETRIEVED: `Je t'ai envoyé un message texte avec les résultats de ta recherche,`,
    SPEECH_TXT_PHONE_NUMBER_RETRIEVAL_NO_ACCESS: `Si tu veux que je t'envoie un message texte avec les résultats de ta recherche, tu dois donner ta permission pour que je puisse accéder ton numéro de téléphone via les paramètres de la Skill. Je t'ai envoyé des renseignements sur ton application Alexa pour t'aider. En attendant,`,
    SPEECH_TXT_PHONE_NUMBER_NOT_FOUND: `Si tu veux que je t'envoie un message texte avec les résultats de ta recherche, tu dois ajuter un numéro de téléphone à ton compte Alexa. En attendant,`,
    SPEECH_TXT_PHONE_NUMBER_RETRIEVAL_ERROR: ``,

    // SEARCH RESULT FOLLOW UP QUESTION STRINGS
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Veux-tu que je trouve les rappels de sécurité pour un autre véhicule?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `veux-tu que je te lis le rappel?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `veux-tu que te je lise les rappels?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Est-ce que le tien est un ${AMBIGIOUS_MODELS}?`,
    AMBIGIOUS_MODEL_COMMAND_OPTION_NEITHER: `aucun de ces modèles`,
    AMBIGIOUS_MODEL_COMMAND_OPTION_NONE_OF_THESE: `aucun de ces modèles`,
    OR: "ou",
    // READING RECALLS STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_READING_INTRO: `Lorsque je te lis l’information sur les rappels de véhicules, tu peux sauter au rappel suivant à n’importe quel moment en disant Alexa, prochain.`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DETAILS: `Le ${RECALL_DATE}, un rappel de sécurité affectant le système d' ${RECALL_COMPONENT} a été émit.<break time="500ms"/>${RECALL_DETAILS}.`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DONE: `C’est tout ce que j’ai comme information sur ton véhicule ${VEHICLE_SPEECH_VERSION}. Veux-tu que je répète l’information sur les rappels de sécurité pour ce véhicule?`,
    SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL: `Veux-tu entendre le prochain rappel?`,

    // MISCELLANEOUS STRINGS
    SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN: `Veux-tu essayer de chercher encore une fois?`,
    SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL: `Veux-tu que je trouve les rappels de sécurité pour un autre véhicule?`,

    // HELP
    SPEECH_TXT_VEHICLE_HELP: `Bienvenue dans le mode d'Aide. Si tu as besoin de chercher un autre véhicule, dit "recherche"`,

    // ERROR STRINGS
    SPEECH_TXT_VEHICLE_ERROR_FALLBACK_INTENT: `Désolé, je n’ai pas bien compris. Tu peux chercher les rappels en disant « recherche ». Si tu ne peux pas trouver ce que tu cherches, tu peux contacter mes collègues humains aux services à la clientèle des Rappels de Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}.`,
    CARD_TXT_VEHICLE_ERROR_FALLBACK_INTENT: `Désolé, je n’ai pas bien compris. Tu peux chercher les rappels en disant « recherche ». Si tu ne peux pas trouver ce que tu cherches, tu peux contacter mes collègues humains aux services à la clientèle des Rappels de Transports Canada en composant le  ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}.`,
    CARD_TXT_VEHICLE_ERROR_FALLBACK_INTENT_TITLE: `Aide`,
    SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT: `Humm...Je ne m'attendais pas à cette réponse. Si tu veux faire une autre recherche pour ton véhicle, dit "recherche"`,
    SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE: `Désolé, je suis encore une assistante vocale en formation et j’ai quelques difficultés de compréhension. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle des Rappels de Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_SEARCH_MAX_ATTEMPT_REACH: `Désolé, j'ai de la difficulté à identifier ton véhicule. As-tu besoin de plus d'aide?`,
    SPEECH_TXT_VEHICLE_GET_HELP: `Ok. Pour de l'aide, tu peux contacter mes collègues humains aux services à la clientèle des Rappels de Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_SPEECH_VERSION}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_YEAR_INTENT_TRIGGERED_NO_MODEL_MAKE_PROVIDED: `Désolé, ce n'est pas l'information que je cherchais.`,
    CARD_TXT_VEHICLE_ERROR_CONTACT_HELP: `Si tu as besoin d'aide, tu peux contacter Transport Canada au ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_ERROR_CONTACT_HELP_TITLE: `Contacte-nous`,

    // SMS MESSAGE
    VEHICLE_RECALL_TEXT_FOUND_NONE_MESSAGE: `De Transports Canada: Bonjour! Je suis ton assistante pour les rappels de sécurité de véhicules. 0 rappels pouvant affecter ton véhicule ${VEHICLE_CARD_VERSION} ont été trouvé. Tu peux voir cela à http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&${QUERY_STRING}&ft=&ls=0&sy=0.`,
    VEHICLE_RECALL_TEXT_FOUND_ONE_MESSAGE: `De Transports Canada: Bonjour! Je suis ton assistante pour les rappels de sécurité de véhicules. 1 rappel pouvant affecter ton véhicule ${VEHICLE_CARD_VERSION} à été trouvé. Tu peux voir plus d'information à http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&${QUERY_STRING}&ft=&ls=0&sy=0.`,
    VEHICLE_RECALL_TEXT_FOUND_MULTIPLE_MESSAGE: `De Transports Canada: Bonjour! Je suis ton assistante pour les rappels de sécurité de véhicules. ${RECALL_COUNT} rappels pouvant affecter ton véhicule ${VEHICLE_CARD_VERSION} ont été trouvé. Tu peux voir plus d'information à http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&${QUERY_STRING}&ft=&ls=0&sy=0.`,

    /// //// ALEXA CARDS \\\\\\
    CARD_TXT_VEHICLE_RECALLS_READING_DETAILS: `Le ${RECALL_DATE}, un rappel de sécurité affectant le système " ${RECALL_COMPONENT} " a été émit. ${RECALL_DETAILS}`,

    // SEARCH RESULT CARDS
    CARD_TXT_VEHICLE_RECALLS_FOUND_NONE: `Je n'ai trouvé aucun rappel dans le système pour ton véhicule ${VEHICLE_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_ONE: `J'ai trouvé un rappel pouvant affecter ton véhicule ${VEHICLE_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `${RECALL_COUNT} rappels pourraient affecter ton véhicule ${VEHICLE_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `Ton véhicule ${VEHICLE_CARD_VERSION} n'est pas dans notre système. Si tu as besoin d'aide, tu peux contacter Transport Canada au ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER_CARD_VERSION}.`,
    CARD_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm... J'ai trouvé plusieurs différents modèles de ton véhicule ${VEHICLE_CARD_VERSION}. Est-ce que le tien est un ${AMBIGIOUS_MODELS}?`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_DETAILS_TITLE: `Détails des rappels pour le véhicule ${VEHICLE_CARD_VERSION} qui affectent le ${RECALL_COMPONENT}`,

    // DEBUG CARDS
    CARD_TXT_VEHCILE_SHOW_MAKE_MODEL_PROVIDED: `utterance resolved to: "${MAKE} ${MODEL}"`,
    CARD_TXT_VEHCILE_SHOW_MAKE_PROVIDED: `utterance resolved to: "${MAKE}"`,
    CARD_TXT_VEHCILE_SHOW_MODEL_PROVIDED: `utterance resolved to: "${MODEL}"`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_MODEL_TITLE: `Search Query: Make and Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MODEL_TITLE: `Search Query: Model given`,
    CARD_TXT_VEHICLE_RECALLS_QUERY_MAKE_TITLE: `Search Query: Make given`,
  },
};
