module.exports = Object.freeze({

  // Desribes what action the end user has undertaken.
  userAction: {
    InitiatedRecallSearch: 0,
    InitiatedSkip: 1,
    RequestingNextRecallInfo: 2,
    RestartRecallSearch: 3,
    ResolvingAmbiguousModel: 4,
    ResponsedYesToWantingToReceiveSMS: 5,
    ResponsedNoToWantingToReceiveSMS: 6,
    ResponsedYesToCorrectPhoneNumberFoundOnAccount: 7,
    ResponsedNoToCorrectPhoneNumberFoundOnAccount: 8,
    ResponsedYesToWantingRecallRead: 9,
    ResponsedNoToWantingRecallRead: 10,
    RespondedYesToRepeatRecallInfo: 11,
    RespondedNoToRepeatRecallInfo: 12
  },

  // Questions posed to the user.
  // Questions prefixed with 'VEHICLE' are vehicle recall related follow-up questions
  FollowUpQuestions: {
    WouldYouLikeToSearchForAnotherRecall: 0,
    WouldYouLikeToHearTheNextRecall: 1,
    IsYourPhoneNumberFiveFiveFiveBlahBlah: 2,
    WouldYouLikeToRecieveSMSMessage: 3,
    WouldYouLikeToMeReadTheRecall: 4,
    WouldYouLikeTheRecallInformationRepeated: 5,
    VEHICLE_IsItModelAOrModelB: 6
  },

  // Describes the vehicle recall interaction context, Alexa follow up questions to the user differ based on the below states.
  VehicleConversationContext: {
    GettingSearchResultFindingsState: 0, // inital state, Alexa searching for for recalls
    ReadingRecallState: 1 // Alexa is reading the recall
  },

  // Describes the recall API search result findings
  VehicleSearchFindings: {
    SearchNotConducted: -1,
    NoRecallsFound: 0,
    SingleRecallFound: 1,
    MultipleRecallsFound: 2,
    NonValidModelFound: 3,
    AmbigiousModelFound: 4
  },

  // Key value to save and retrieve session variables.
  sessionKeys: {
    VehicleCurrentRecallIndex: 'VehicleCurrentRecallIndex', // current index within array of recalls
    UserAction: 'UserAction', // desribes what action the end user has undertaken.
    CurrentIntentLocation: 'CurrentIntentLocation', // like a breadcrumb trail, last intent to be excuted.
    VehicleConversation: 'VehicleConversation', // holds the vehicle convo obj
    GeneralConversation: 'GeneralConversation' // holds the general convo obj
  }

}
)
