module.exports = Object.freeze({

  states: {
    START: 0,
    MIDDLE: 1,
    END: 2
  },

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

  SearchVehicleRecallIntentYesNoQuestions: {
    WouldYouLikeToSearchForAnotherRecall: 0,
    WouldYouLikeToHearTheNextRecall: 1,
    IsItModelAOrModelB: 2,
    IsYourPhoneNumberFiveFiveFiveBlahBlah: 4,
    WouldYouLikeToRecieveSMSMessage: 5,
    WouldYouLikeToMeReadTheRecall: 6,
    WouldYouLikeTheRecallInformationRepeated: 7

  },

  VehicleConversationContext: {
    RecallInfo: 0,
    AmbiguousModel: 1,
    SearchResultFindings: 2
  },

  VehicleSearchFindings: {
    SearchNotConducted: -1,
    NoRecallsFound: 0,
    SingleRecallFound: 1,
    MultipleRecallsFound: 2,
    NonValidModelFound: 3,
    AmbigiousModelFound: 4
  },

  sessionKeys: {
    // SearchForVehicleRecallState: 'SearchForVehicleRecallState',
    // Recalls: 'Recalls',
    // RecallRequest: 'RecallRequest',
    CurrentRecallIndex: 'CurrentRecallIndex', // TODO: rename to vehicleCurrentRecallIndex
    UserAction: 'UserAction',
    LogicRoutedIntentName: 'LogicRoutedIntentName',
    VoiceRoutedIntentName: 'VoiceRoutedIntentname',
    VehicleConversation: 'VehicleConversation',
    Conversation: 'Conversation',
    UserActionPerformed: 'UserActionPerformed'

  }

}
)
