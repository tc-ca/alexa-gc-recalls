const TELL_ME_YOUR_MAKE = `On peut commencer. Quelle est la marque de ton véhicule?`
const VEHICLE_MAKE_MODEL_YEAR = `%%VehicleRecallYear%% %%VehicleRecallMake%% %%VehicleRecallModel%%`
const RECALL_COUNT = `%%RecallCount%%`
const RECALL_DATE = `%%VehicleRecallDate%%`
const RECALL_COMPONENT = `%%VehicleRecallComponent%%`
const RECALL_DETAILS = `%%VehicleRecallDetails%%`
const AMBIGIOUS_MODELS = `%%AmbigiousModelsList%%`
// const PHONEMES = { }
const HELP_LINE_PHONE_NUMBER = `<say-as interpret-as="telephone">18003330510</say-as>`

module.exports = {
  translation: {
    WELCOME_MSG: `Bonjour! Je suis votre assistante pour les rappels de sécurité. Je peux t'informer sur les rappels de sécurité au Canada. ${TELL_ME_YOUR_MAKE }`,
    VEHICLE_SLOT_VALUES_NOT_FOUND: `Hmm...Je n’ai pas trouvé ton ${VEHICLE_MAKE_MODEL_YEAR} dans notre base de données. Pour m’aider à chercher, je te demanderais de seulement inclure le nom du modèle de ton véhicule sans le niveau d’équipement. Quel est le nom du modèle de ton véhicule?`,
    TELL_ME_YOUR_MAKE: `${TELL_ME_YOUR_MAKE}`,
    VEHICLE_RECALLS_FOUND_NONE: `Je n’ai pas trouvé de rappels associés avec ton véhicule dans notre système.`,
    VEHICLE_RECALLS_FOUND_ONE: `<p>J’ai trouvé un rappel qui pourrait affecter ton ${VEHICLE_MAKE_MODEL_YEAR}. %%SentSMSMsg%%</p>`,
    VEHICLE_RECALLS_FOUND_MULTIPLE: `<p>J’ai trouvé ${RECALL_COUNT} rappels qui pourraient affecter ton ${VEHICLE_MAKE_MODEL_YEAR}. %%SentSMSMsg%%</p>`,
    VEHICLE_RECALLS_FOUND_NON_VALID: `Je m'excuse. Je n’ai pas d’information sur ton ${VEHICLE_MAKE_MODEL_YEAR} en ce moment. Je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${HELP_LINE_PHONE_NUMBER}.`,
    VEHICLE_RECALLS_FOUND_AMBIGIOUS_MODEL: `Hmm...J’ai besoin de plus d’information sur le modèle.`,
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NONE: `Veux-tu que je trouve les rappels de sécurité d’un autre véhicule?`, 
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_ONE: `Veux-tu que je lise les rappels?`,
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_MULTIPLE: `Veux-tu que je lise les rappels?`,
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_NON_VALID: `What is your vehicle model?`,
    VEHICLE_SEARCH_RESULT_FOLLOW_UP_QUESTION_FOUND_AMBIGIOUS_MODEL: `Est-ce que le tien est un ${AMBIGIOUS_MODELS}?`,
    VEHICLE_RECALL_READING_INTRO_USAGE: `Lorsque je vais lire l’information sur les rappels de véhicules, tu pourras sauter au prochain rappel à n’importe quel moment en disant Alexa, prochain.`,
    VEHICLE_DETAILS_MSG: `<p>Le ${RECALL_DATE}, il y avait un rappel de sécurité affectant le ${RECALL_COMPONENT}.<break time="500ms"/>${RECALL_DETAILS}.</p>`,
    VEHICLE_RECALLS_END_MSG: `<p>C’est tout ce que j’ai comme information sur ton ${VEHICLE_MAKE_MODEL_YEAR}. Veux-tu que je répète l’information sur les rappels de sécurité pour ce véhicule?</p>`,
    VEHICLE_RECALLS_SENT_SMS: `Je t'ai envoyé l’information sur les rappels par texto/courriel`,
    VEHICLE_RECALLS_TRY_SEARCH_AGAIN: `Veux-tu essayer de chercher encore une fois?`,
    VEHCILE_RECALLS_GOODBYE_MSG: `OK! Passe une bonne journée!`,
    VEHCILE_RECALLS_LOOK_FOR_ANOTHER_RECALL: `Veux-tu que je trouve les rappels de sécurité d’un autre véhicule?`,
    VEHCILE_RECALLS_FOLLOW_UP_QUESTION_LISTEN_TO_NEXT_RECALL_MSG: `Veux-tu entendre le prochain rappel?`,
    ERROR_MISSING_PHONE_NUMBER_PERMISSIONS: 'Please enable phone number permissions in the Amazon Alexa app.',
    ERROR_MISSING_PHONE_NUMBER: 'You can set your phone number at Amazon.com, under log-in and security.',
    GENERAL_ERROR_MSG: 'Uh Oh. Looks like something went wrong.',
    VEHICLE_MODEL_VALIDATION_FAILED: `Je m'excuse. Je n’ai pas d’information sur ton ${VEHICLE_MAKE_MODEL_YEAR} en ce moment. Je suis encore un assistant vocal en formation. Si tu veux de l’aide, tu peux contacter mes collègues humains aux services à la clientèle Rappels Transports Canada en composant le ${HELP_LINE_PHONE_NUMBER}.`,
    COMMAND_OUT_OF_CONTEXT: `Hmm... I was not expecting that response, do you need help?`
    // ...more...
  }
}
