/**
 * An object containing various message types for management of the Travel Assistant.
 */
export const Events = {
    // Trip Events
    NewTrip: 'NewTrip',

    LoadTrips: 'LoadTrips',
    LoadTripsSuccess: 'LoadTripsSuccess',
    LoadTripsFailure: 'LoadTripsFailure',

    StoreTrip: 'StoreTrip',
    StoreTripSuccess: 'StoreTasksSuccess',
    StoreTripFailure: 'StoreTripFailure',

    UnStoreTrips: 'UnStoreTrips',
    UnStoreTripsSuccess: 'UnStoreTripsSuccess',
    UnStoreTripsFailure: 'UnStoreTripsFailure',

    // To-do Events

    // Budget Events

    // Message List Events
    OpenChat: 'OpenChat',
    OpenChatSuccess: 'OpenChatSuccess',
    OpenChatFailure: 'OpenChatFailure',

    AddChatIDToUserPermissions: 'AddChatIDToUserPermissions',
    AddChatIDToUserPermissionsSuccess: 'AddChatIDToUserPermissionsSuccess',
    AddChatIDToUserPermissionsFailure: 'AddChatIDToUserPermissionsFailure',

    StoreNewChatGroup: 'StoreNewChatGroup',
    StoreNewChatGroupSuccess: 'StoreNewChatGroupSuccess',
    StoreNewChatGroupFailure: 'StoreNewChatGroupFailure',

    AcceptChatInvitation: 'AcceptChatInvitation',
    AcceptChatInvitationSuccess: 'AcceptChatInvitationSuccess',
    AcceptChatInvitationFailure: 'AcceptChatInvitationFailure',

    RetrieveUserData: 'RetrieveUserData',
    RetrieveUserDataSuccess: 'RetrieveUserDataSuccess',
    RetrieveUserDataFailure: 'RetrieveUserDataFailure',

    RetrieveChatData: 'RetrieveChatData',
    RetrieveChatDataSuccess: 'RetrieveChatDataSuccess',
    RetrieveChatDataFailure: 'RetrieveChatDataFailure',

    // Message Display Events
    StoreNewMessage: 'StoreNewMessage',
    LoadNewMessage: 'LoadNewMessage',

    // View Switching Events
    SwitchToHome: 'SwitchToHomePage',
    SwitchToTripPage: 'SwitchToTripPage',
    SwitchToMessagePage: 'SwitchToMessagePage',
}