// CONSTANTS
const QUERY_STRING = `%%QueryString%%`

const MAKE = `%%VehicleRecallMake%%`
const MODEL = `%%VehicleRecallModel%%`
const YEAR = `%%VehicleRecallYear%%`

const VEHICLE_MAKE_MODEL_YEAR = `${MAKE} ${MODEL} ${YEAR}`
const RECALL_COUNT = `%%RecallCount%%`
const RECALL_DATE = `%%VehicleRecallDate%%`
const RECALL_COMPONENT = `%%VehicleRecallComponent%%`
const RECALL_DETAILS = `%%VehicleRecallDetails%%`
const AMBIGIOUS_MODELS = `%%AmbigiousModelsList%%`
const TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER = `<say-as interpret-as="telephone">18003330510</say-as>`

// ALEXA'S PRONUNCIATION
// const PHONEMES = { }

module.exports = {
  translation: {
    // LAUNCH STRING
    SPEECH_TXT_VEHICLE_WELCOME_MSG: [
      `Bonjour! Je suis votre assistante pour les rappels de sécurité. Je peux t'informer sur les rappels de sécurité au Canada.`,
      `Salut! Je suis votre assistante pour les rappels de sécurité, et je peux t'informer sur les rappels de sécurité de ton véhicule.`
    ],
    // LAUNCH REPROMPT
    SPEECH_TXT_VEHICLE_MAKE_REPROMPT: `Quelle est la marque de ton véhicule?`,

    // GOODBYE STRING
    SPEECH_TXT_VEHCILE_RECALLS_GOODBYE: `OK! Passe une bonne journée!`,

    // COMFIRMATION OF MAKE, MODEL, AND YEAR
    SPEECH_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR: `Juste pour vérifier, est-ce que tu cherches un ${VEHICLE_MAKE_MODEL_YEAR}?`,
    CARD_TXT_VEHCILE_COMFIRM_MAKE_MODEL_YEAR: `Juste pour vérifier, est-ce que tu cherches un ${VEHICLE_MAKE_MODEL_YEAR}?`,

    // SEARCH RESULT STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE: `Je n’ai pas trouvé de rappels associés avec ton véhicule dans notre système.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE: `J’ai trouvé un rappel qui pourrait affecter ton ${VEHICLE_MAKE_MODEL_YEAR}. Je t'ai envoyé l’information sur les rappels par texto.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `J’ai trouvé ${RECALL_COUNT} rappels qui pourraient affecter ton ${VEHICLE_MAKE_MODEL_YEAR}. Je t'ai envoyé l’information sur les rappels par texto.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `Je m'excuse. Je n’ai pas d’information sur ton ${VEHICLE_MAKE_MODEL_YEAR} en ce moment. Je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER}.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Humm...J’ai besoin de plus d’information sur le modèle.`,
    SPEECH_TXT_VEHICLE_SLOT_VALUES_NOT_FOUND: `Humm...Je n’ai pas trouvé ton ${VEHICLE_MAKE_MODEL_YEAR} dans notre base de données. Pour m’aider à chercher, je te demanderais de seulement inclure le nom du modèle de ton véhicule sans le niveau d’équipement. Quel est le nom du modèle de ton véhicule?`,

    // SEARCH RESULT FOLLOW UP QUESTION STRINGS
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Veux-tu que je trouve les rappels de sécurité d’un autre véhicule?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `Veux-tu que je lise les rappels?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `Veux-tu que je lise les rappels?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Est-ce que le tien est un ${AMBIGIOUS_MODELS}?`,

    // READING RECALLS STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_READING_INTRO: `Lorsque je vais lire l’information sur les rappels de véhicules, tu pourras sauter au prochain rappel à n’importe quel moment en disant Alexa, prochain.`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DETAILS: `Le ${RECALL_DATE}, il y avait un rappel de sécurité affectant le ${RECALL_COMPONENT}.<break time="500ms"/>${RECALL_DETAILS}.`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DONE: `C’est tout ce que j’ai comme information sur ton ${VEHICLE_MAKE_MODEL_YEAR}. Veux-tu que je répète l’information sur les rappels de sécurité pour ce véhicule?`,
    SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL: `Veux-tu entendre le prochain rappel?`,

    // MISCELLANEOUS STRINGS
    SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN: `Veux-tu essayer de chercher encore une fois?`,
    SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL: `Veux-tu que je trouve les rappels de sécurité d’un autre véhicule?`,

    // ERROR STRINGS
    SPEECH_TXT_VEHICLE_ERROR_MODEL_VALIDATION_FAILED: `Je m'excuse. Je n’ai pas d’information sur ton ${VEHICLE_MAKE_MODEL_YEAR} en ce moment. Je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_UNEXPECTED_UTTERANCE: `Je ne suis pas certaine. Je m'excuse, je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT: `Humm... I was not expecting that response, you can say start over`,
    SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE: `Je m'excuse. Je suis encore un assistant vocal en formation et j’ai quelques difficultés de compréhension. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_SEARCH_MAX_ATTEMPT_REACH: `Je m'excuse. J'ai de la difficulté à identifier ton véhicule. As-tu besoin de plus d'aide?`,
    SPEECH_TXT_VEHICLE_GET_HELP: `Ok. Pour de l'aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER}. Passe une bonne journée.`,
    SPEECH_TXT_VEHICLE_ERROR_YEAR_INTENT_TRIGGERED_NO_MODEL_MAKE_PROVIDED: `Sorry, that was not the information I was looking for`,

    // SMS MESSAGE
    VEHICLE_RECALL_TEXT_FOUND_NONE_MESSAGE: `From Transport Canada: Hi! I'm your Vehicle Recall Assistant. Your ${VEHICLE_MAKE_MODEL_YEAR} has 0 recalls. You can find them at, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&${QUERY_STRING}&ft=&ls=0&sy=0`,
    VEHICLE_RECALL_TEXT_FOUND_ONE_MESSAGE: `From Transport Canada: Hi! I'm your Vehicle Recall Assistant. Your ${VEHICLE_MAKE_MODEL_YEAR} has 1 recall. You can find them at, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&${QUERY_STRING}&ft=&ls=0&sy=0`,
    VEHICLE_RECALL_TEXT_FOUND_MULTIPLE_MESSAGE: `From Transport Canada: Hi! I'm your Vehicle Recall Assistant. Your ${VEHICLE_MAKE_MODEL_YEAR} has ${RECALL_COUNT} recalls. You can find them at, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=eng&${QUERY_STRING}&ft=&ls=0&sy=0`
  }
}
