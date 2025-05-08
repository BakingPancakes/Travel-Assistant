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

    // ======= this is unimplemented in messages page
    AcceptChatInvitation: 'AcceptChatInvitation',
    AcceptChatInvitationSuccess: 'AcceptChatInvitationSuccess',
    AcceptChatInvitationFailure: 'AcceptChatInvitationFailure',
    // ========

    RequestUserData: 'RequestUserData',
    RequestUserDataSuccess: 'RequestUserDataSuccess',
    RequestUserDataFailure: 'RequestUserDataFailure',

    RequestChatData: 'RequestChatData',
    RequestChatDataSuccess: 'RequestChatDataSuccess',
    RequestChatDataFailure: 'RequestChatDataFailure',

    // delete below, is redundant
    RetrieveChatData: 'RetrieveChatData',
    RetrieveChatDataSuccess: 'RetrieveChatDataSuccess',
    RetrieveChatDataFailure: 'RetrieveChatDataFailure',

    // Message Display Events
    StoreNewMessage: 'StoreNewMessage',
    LoadNewMessage: 'LoadNewMessage',

    // View Switching Events
    SwitchToHomePage: 'SwitchToHomePage',
    SwitchToTripPage: 'SwitchToTripPage',
    SwitchToMessagePage: 'SwitchToMessagePage',

    // select trip
    TRIP_SELECTED: 'trip_selected',
    TRIP_EDIT: 'trip_edit',
    TRIP_DELETED: 'trip_deleted',
    
    // Create Trip with edit 
    CREATE_NEW_TRIP: 'create_new_trip',
    TRIP_CREATED: 'trip_created',
    TRIP_UPDATED: 'trip_updated',
    TRIPS_UPDATED: 'trips_updated',
    TRIP_FORM_CANCELLED: 'trip_form_cancelled',
    
    // Trip specific detail
    TRIP_DETAILS_SAVE_REQUESTED: 'trip_details_save_requested',
    ACCOMMODATION_DATA_UPDATED: 'accommodation_data_updated',
    TODO_DATA_UPDATED: 'todo_data_updated'
    
}
