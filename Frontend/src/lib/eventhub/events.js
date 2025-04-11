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

    // View Switching Events
    SwitchToHome: 'SwitchToHomePage',
    SwitchToTripPage: 'SwitchToTripPage',
    SwitchToMessagePage: 'SwitchToMessagePage'
}