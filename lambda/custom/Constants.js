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
    ResolvingAmbiguousModel: 4
  },

  SearchVehicleRecallIntentYesNoQuestions: {
    WouldYouLikeToSearchForAnotherRecall: 0,
    WouldYouLikeToHearTheNextRecall: 1,
    ProvideComfirmationOfAmbiguousModel: 2
  },

  VehicleConversationContext: {
    RecallInfo: 0,
    AmbiguousModel: 1
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
    UserActionPerformed: 'UserActionPerformed'

  }

}
)
