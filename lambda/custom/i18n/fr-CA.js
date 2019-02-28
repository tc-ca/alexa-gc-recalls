// CONSTANTS
const TELL_ME_YOUR_MAKE = `On peut commencer. Quelle est la marque de ton véhicule?`
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
// const PHONEMES = { }

module.exports = {
  translation: {
    // HELLO STRING
    SPEECH_TXT_VEHICLE_WELCOME_MSG: `Bonjour! Je suis votre assistante pour les rappels de sécurité. Je peux t'informer sur les rappels de sécurité au Canada. ${TELL_ME_YOUR_MAKE}`,

    // GOODBYE STRING
    SPEECH_TXT_VEHCILE_RECALLS_GOODBYE: `OK! Passe une bonne journée!`,

    // SEARCH RESULT STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NONE: `Je n’ai pas trouvé de rappels associés avec ton véhicule dans notre système.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_ONE: `<p>J’ai trouvé un rappel qui pourrait affecter ton ${VEHICLE_MAKE_MODEL_YEAR}. Je t'ai envoyé l’information sur les rappels par texto.</p>`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_MULTIPLE: `<p>J’ai trouvé ${RECALL_COUNT} rappels qui pourraient affecter ton ${VEHICLE_MAKE_MODEL_YEAR}. Je t'ai envoyé l’information sur les rappels par texto.</p>`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_NON_VALID: `Je m'excuse. Je n’ai pas d’information sur ton ${VEHICLE_MAKE_MODEL_YEAR} en ce moment. Je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER}.`,
    SPEECH_TXT_VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm...J’ai besoin de plus d’information sur le modèle.`,
    SPEECH_TXT_VEHICLE_SLOT_VALUES_NOT_FOUND: `Hmm...Je n’ai pas trouvé ton ${VEHICLE_MAKE_MODEL_YEAR} dans notre base de données. Pour m’aider à chercher, je te demanderais de seulement inclure le nom du modèle de ton véhicule sans le niveau d’équipement. Quel est le nom du modèle de ton véhicule?`,

    // SEARCH RESULT FOLLOW UP QUESTION STRINGS
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Veux-tu que je trouve les rappels de sécurité d’un autre véhicule?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `Veux-tu que je lise les rappels?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `Veux-tu que je lise les rappels?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NON_VALID: `What is your vehicle model?`,
    SPEECH_TXT_VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Est-ce que le tien est un ${AMBIGIOUS_MODELS}?`,

    // READING RECALLS STRINGS
    SPEECH_TXT_VEHICLE_RECALLS_READING_INTRO: `Lorsque je vais lire l’information sur les rappels de véhicules, tu pourras sauter au prochain rappel à n’importe quel moment en disant Alexa, prochain.`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DETAILS: `<p>Le ${RECALL_DATE}, il y avait un rappel de sécurité affectant le ${RECALL_COMPONENT}.<break time="500ms"/>${RECALL_DETAILS}.</p>`,
    SPEECH_TXT_VEHICLE_RECALLS_READING_DONE: `<p>C’est tout ce que j’ai comme information sur ton ${VEHICLE_MAKE_MODEL_YEAR}. Veux-tu que je répète l’information sur les rappels de sécurité pour ce véhicule?</p>`,
    SPEECH_TXT_VEHCILE_RECALLS_READING_FOLLOW_UP_QUESTION_WOULD_YOU_LIKE_TO_HEAR_NEXT_RECALL: `Veux-tu entendre le prochain rappel?`,

    // MISCELLANEOUS STRINGS
    SPEECH_TXT_VEHICLE_TELL_ME_YOUR_MAKE: `${TELL_ME_YOUR_MAKE}`,
    SPEECH_TXT_VEHICLE_WOULD_YOU_LIKE_TO_SEARCH_AGAIN: `Veux-tu essayer de chercher encore une fois?`,
    SPEECH_TXT_VEHCILE_SEARCH_FOR_ANOTHER_RECALL: `Veux-tu que je trouve les rappels de sécurité d’un autre véhicule?`,

    // ERROR STRINGS
    SPEECH_TXT_VEHICLE_ERROR_MODEL_VALIDATION_FAILED: `Je m'excuse. Je n’ai pas d’information sur ton ${VEHICLE_MAKE_MODEL_YEAR} en ce moment. Je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER}.`,
    SPEECH_TXT_VEHICLE_ERROR_UNEXPECTED_UTTERANCE: `Je ne suis pas certaine. Je m'excuse, je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER}.`,
    SPEECH_TXT_VEHICLE_ERROR_FAILED_MAX_ATTEMPTS: `Je m'excuse. Je suis encore un assistant vocal en formation et j’ai quelques difficultés de compréhension. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER}.`,
    SPEECH_TXT_VEHICLE_ERROR_COMMAND_OUT_OF_CONTEXT: `Hmm... I was not expecting that response, you can say start over`,
    SPEECH_TXT_VEHICLE_ERROR_GENERIC_MESSAGE: `I'm sorry. I’m still a voice assistant in training and I'm having trouble understanding. Please contact my human friends at Transport Canada Recalls customer support at ${TC_VEHICLE_RECALL_HELP_LINE_PHONE_NUMBER} for more help.`,

    // SMS MESSAGE
    VEHICLE_RECALL_TEXT_MESSAGE: `From Transport Canada: Here's your recall information, http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/search-recherche/results-resultats.aspx?lang=fra&mk=${MAKE_ID}&md=${MODEL}&fy=${FROM_YEAR}&ty=${TO_YEAR}&ft=&ls=0&sy=0`
  }
}
