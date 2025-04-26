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

    // Message Events
    // TODO: error handling
    OpenChat: 'OpenChat',
    UpdateChatGroup: 'UpdateChatGroup',
    StoreNewChatGroup: 'StoreNewChatGroup',
    StoreNewMessage: 'StoreNewMessage', // stores as soon as sent
    LoadNewMessage: 'LoadNewMessage',

    // View Switching Events
    SwitchToHome: 'SwitchToHomePage',
    SwitchToTripPage: 'SwitchToTripPage',
    SwitchToMessagePage: 'SwitchToMessagePage'
}