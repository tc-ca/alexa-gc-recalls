module.exports = Object.freeze({

  // vehicle makes id to build links sent via sms.
  // replace $ with hypen and _ with space
  VEHICLE_MAKE_ID: {
    ACURA: '4146',
    ALFA_ROMEO: '2220!22636!2686!36276',
    AM_GENERAL: '6076',
    ASTON_MARTIN: '5855',
    AUDI: '1878',
    BENTLEY: '4366!7510',
    BMW: '2341',
    BRAUN: '13136',
    BUICK: '1893',
    CADILLAC: '1870!6869',
    CHEVROLET: '1896!3229!4804!5359!6128',
    CHRYSLER: '1872!27999!34917!37305!5986!6181!6402',
    CRESTLINE: '8901',
    DAEWOO: '6371',
    DEMERS: '2759',
    DODGE: '1849!24277!2444!28000!33038!3714!37304!4864!5115!6400',
    EAGLE: '4136!5617!6404',
    ELDORADO_BUS: '33236!35880',
    ELDORADO_MOBILITY: '27997',
    EXECUTIVE_COACH: '8369',
    FERRARI: '2469',
    FIAT: '17978!2086',
    FISKER: '20657',
    FORD: '17580!1867!34816!3592!36441!36891!3712!4273!4745!4800!4862!5164!5711!6126!8659',
    FRONTLINE: '17877',
    GENESIS: '36902',
    GEO: '4933',
    GMC: '11122!1899!3231!4802!4860!5001!5620',
    HONDA: '1954!35936!4785',
    HUMMER: '7273',
    HYUNDAI: '3759',
    INFINITI: '5746',
    IOWA_MOLD_TOOLING: '30398',
    ISUZU: '11121!4776',
    JAGUAR: '1862!2887',
    JEEP: '1927!4116!6480',
    KARMA: '36601',
    KIA: '6597',
    LAMBORGHINI: '5633',
    LAND_ROVER: '2419!4794!9587',
    LEXUS: '4874',
    LINCOLN: '17577!1913!36892!6871',
    LOTUS: '11792!2631!8137!8180!8259',
    MASERATI: '7705',
    MAZDA: '2891',
    MERCEDES$BENZ: '2118!2471!34716',
    MERCURY: '1865',
    MINI: '7157',
    MITSUBISHI: '7355',
    MOBILITY_VENTURES: '36562!36578',
    MORGAN_OLSON: '9552',
    MULTI$VANS: '4556',
    NISSAN: '3415',
    OLDSMOBILE: '1888',
    PASSPORT: '4168',
    PLYMOUTH: '1875!6408',
    PONTIAC: '1890',
    PORSCHE: '2003',
    RAM: '15695!37306',
    RANGE_ROVER: '5472',
    ROADTREK: '11001!3370',
    ROLLS$ROYCE: '2386!8478',
    SAAB: '15441!2192!2580!2866!4006',
    SALEEN: '9283',
    SATURN: '3553!5062',
    SCION: '16416',
    SMART: '9259',
    SRT: '25696',
    STERLING: '10391!6413',
    SUBARU: '2510',
    SUZUKI: '2241!36017!4781',
    TESLA: '14602',
    TOYOTA: '2474!2734',
    UNION_CITY_BODY_COMPANY: '9454',
    UTILIMASTER: '27776!7649',
    VAN$ACTION: '12977',
    VMI: '18357',
    VOLKSWAGEN: '2154!24279',
    VOLVO: '1838!4876'
  },

  VEHICLE_MAZDA_MODEL_SPEECH_CORRECTION: {
    MAZDA2: 'two',
    MAZDA3: 'three',
    MAZDA5: 'five',
    MAZDA6: 'six',
    MAZDASPEED3: 'speed three',
    MAZDASPEED6: 'speed six'
  },

  // Desribes what action the end user has undertaken.
  USER_ACTION: {
    InitiatedRecallSearch: 0,
    InitiatedSkip: 1,
    RequestingNextRecallInfo: 2,
    RestartRecallSearch: 3,
    ResolvingAmbiguousModel: 4,
    ResolvingInValidModel: 5,
    ResponsedYesToWantingToReceiveSMS: 6,
    ResponsedNoToWantingToReceiveSMS: 7,
    ResponsedYesToCorrectPhoneNumberFoundOnAccount: 8,
    ResponsedNoToCorrectPhoneNumberFoundOnAccount: 9,
    ResponsedYesToWantingRecallRead: 10,
    ResponsedNoToWantingRecallRead: 11,
    RespondedYesToRepeatRecallInfo: 12,
    RespondedNoToRepeatRecallInfo: 13,
    SaidNextWhenNoMoreRecallsToLookUp: 14,
    SaidPreviousWhenNoMoreRecallsToLookUp: 15

  },

  // Questions posed to the user.
  // Questions prefixed with 'VEHICLE' are vehicle recall related follow-up questions
  FOLLOW_UP_QUESTIONS: {
    WouldYouLikeToSearchForAnotherRecall: 0,
    WouldYouLikeToTryAndSearchAgain: 1,
    WouldYouLikeToHearTheNextRecall: 2,
    IsYourPhoneNumberFiveFiveFiveBlahBlah: 3,
    WouldYouLikeToRecieveSMSMessage: 4,
    WouldYouLikeToMeReadTheRecall: 5,
    WouldYouLikeTheRecallInformationRepeated: 6,
    VEHICLE_IsItModelAOrModelB: 7,
    ARE_YOU_LOOKING_FOR_VEHICLE_X: 8,
    WOULD_YOU_LIKE_HELP: 9

  },

  // Describes the vehicle recall interaction context, Alexa follow up questions to the user differ based on the below states.
  VEHICLE_CONVERSATION_CONTEXT: {
    ComfirmingMakeModelYear: 0,
    GettingSearchResultFindingsState: 1, // inital state, Alexa searching for for recalls
    ReadingRecallState: 2 // Alexa is reading the recall
  },

  // Describes the recall API search result findings
  VEHICLE_SEARCH_FINDINGS: {
    SearchNotConducted: -1,
    NoRecallsFound: 0,
    SingleRecallFound: 1,
    MultipleRecallsFound: 2,
    NonValidMakeOrModelFound: 3,
    AmbigiousModelFound: 4
  },

  // Key value to save and retrieve session variables.
  SESSION_KEYS: {
    VehicleCurrentRecallIndex: 'VehicleCurrentRecallIndex', // current index within array of recalls
    UserAction: 'UserAction', // desribes what action the end user has undertaken.
    CurrentIntentLocation: 'CurrentIntentLocation', // like a breadcrumb trail, last intent to be excuted.
    VehicleConversation: 'VehicleConversation', // holds the vehicle convo obj
    VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT: 'VEHICLE_MAKE_MODEL_YEAR_COMFIRM_ATTEMPT',
    VEHICLE_MAKE: 'VEHICLE_MAKE',
    VEHICLE_MODEL: 'VEHICLE_MODEL',
    VEHICLE_YEAR: 'VEHICLE_YEAR',
    USER_PHONE_NUMBER: 'USER_PHONE_NUMBER',
    USER_EMAIL: 'USER_EMAIL',
    HANDLER_TRACE: 'HANDLER_TRACE',
    TRACE: 'TRACE',
    MESSAGE_SENT: 'MESSAGE_SENT'

  },

  API_SEARCH_RESULT: {
    Found: 0,
    NotFound: 1,
    NoPermission: 2,
    Error: 3
  }

}
)
