import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';
import { TripListComponent } from '../TripListComponent/TripListComponent.js';
import { TripInputComponent } from '../TripInputComponent/TripInputComponent.js';
import { TripDetailComponent } from '../TripDetailComponent/TripDetailComponent.js';

export class TripPageComponent extends BaseComponent {
  _container = null;
  _hub = null;
  _trips = [];
  _tripListComponent = null;
  _tripInputComponent = null;
  _tripDetailComponent = null;

  constructor() {
    super();
    this.loadCSS('TripPageComponent');
    this._hub = EventHub.getInstance();
    
    // If no event add
    if (!Events.TRIP_SELECTED) {
      this.initEvents();
    }
    
    // For debugging
    window.tripPageComponent = this;
    
    // Create Lower Component
    this._tripListComponent = new TripListComponent();
    this._tripInputComponent = new TripInputComponent();
    this._tripDetailComponent = new TripDetailComponent();
    
    // For debug
    console.log("TripPageComponent initialized");
  }

  initEvents() {
    // Events
    if (!Events.TRIP_SELECTED) Events.TRIP_SELECTED = 'trip_selected';
    if (!Events.TRIP_EDIT) Events.TRIP_EDIT = 'trip_edit';
    if (!Events.TRIP_DELETED) Events.TRIP_DELETED = 'trip_deleted';
    if (!Events.CREATE_NEW_TRIP) Events.CREATE_NEW_TRIP = 'create_new_trip';
    if (!Events.TRIP_CREATED) Events.TRIP_CREATED = 'trip_created';
    if (!Events.TRIP_UPDATED) Events.TRIP_UPDATED = 'trip_updated';
    if (!Events.TRIPS_UPDATED) Events.TRIPS_UPDATED = 'trips_updated';
    if (!Events.TRIP_FORM_CANCELLED) Events.TRIP_FORM_CANCELLED = 'trip_form_cancelled';
    if (!Events.TRIP_DETAILS_SAVE_REQUESTED) Events.TRIP_DETAILS_SAVE_REQUESTED = 'trip_details_save_requested';
    if (!Events.ACCOMMODATION_DATA_UPDATED) Events.ACCOMMODATION_DATA_UPDATED = 'accommodation_data_updated';
    if (!Events.TODO_DATA_UPDATED) Events.TODO_DATA_UPDATED = 'todo_data_updated';
    
    // For debugging
    console.log("Events initialized in TripPageComponent", Events);
  }

  render() {
    // create main container
    this._container = document.createElement('div');
    this._container.classList.add('trip-page');

    // header
    const header = document.createElement('div');
    header.classList.add('trip-page__header');
    header.innerHTML = `
      <h1>My Trips</h1>
      <button id="new-trip-btn" class="btn-new-trip">+ New Trip</button>
    `;
    this._container.appendChild(header);
    
    // render lower components
    this._container.appendChild(this._tripListComponent.render());
    this._container.appendChild(this._tripDetailComponent.render());
    this._container.appendChild(this._tripInputComponent.render());
    
    // attach eventlistener
    this.attachEventListeners();
    
    // load prev trip data
    this.loadExistingTrips();
    
    return this._container;
  }

  attachEventListeners() {
    // add new trip button
    const newTripBtn = this._container.querySelector('#new-trip-btn');
    newTripBtn.addEventListener('click', () => {
      this._hub.publish(Events.CREATE_NEW_TRIP);
    });
    
    // subscribe create trip
    this._hub.subscribe(Events.TRIP_CREATED, (data) => {
      this.createNewTrip(data.tripData);
    });
    
    // subscribe update trip
    this._hub.subscribe(Events.TRIP_UPDATED, (data) => {
      this.updateExistingTrip(data.tripId, data.tripData);
    });
    
    // subscribe Trip button on sidebar
    this._hub.subscribe(Events.SwitchToTripPage, () => {

      this.showPage();
    });
  }
  
  // show page
  showPage() {
    
    document.querySelectorAll('.main-content > div').forEach(el => {
      if (!el.classList.contains('trip-page')) {
        el.style.display = 'none';
      }
    });
    
    this._container.style.display = 'flex';
  }

  loadExistingTrips() {
    // shows localStorage saved data
    const savedTrips = localStorage.getItem('savedTrips');
    if (savedTrips) {
      this._trips = JSON.parse(savedTrips);
      this._hub.publish(Events.TRIPS_UPDATED, { trips: this._trips });
    }
  }

  createNewTrip(tripData) {

    console.log("createNewTrip called with data:", tripData);
    
    // add saved trip
    let savedTrips = [];
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (savedTripsJson) {
      savedTrips = JSON.parse(savedTripsJson);
    }
    
    // check data 
    if (typeof tripData !== 'object' || tripData === null) {
      console.error("Invalid trip data:", tripData);
      alert("Error: Invalid trip data");
      return;
    }
    
    // 
    if (!tripData.name || !tripData.destination || !tripData.traveler) {
      console.error("Missing required fields in trip data:", tripData);
      alert("Error: Missing required trip information");
      return;
    }
    
    savedTrips.push(tripData);
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // for debugging
    console.log("Trip saved to localStorage:", tripData);
    console.log("Current trips in localStorage:", savedTrips);
    
    // update table
    this._trips = savedTrips;
    this._hub.publish(Events.TRIPS_UPDATED, { trips: savedTrips });
    
    // select new trip
    this._hub.publish(Events.TRIP_SELECTED, { tripId: savedTrips.length - 1 });
    
    // shows trip create successfully
    alert('Trip created successfully!');
  }

  updateExistingTrip(tripId, tripData) {
    // give saved data
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[tripId]) return;
    
    // maintain accommodations, todo, budgets
    if (savedTrips[tripId].accommodations) {
      tripData.accommodations = savedTrips[tripId].accommodations;
    }
    
    if (savedTrips[tripId].todoItems) {
      tripData.todoItems = savedTrips[tripId].todoItems;
    }
    
    if (savedTrips[tripId].budget) {
      tripData.budget = savedTrips[tripId].budget;
    }
    
    savedTrips[tripId] = tripData;
    
    // save update data
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // update table
    this._trips = savedTrips;
    this._hub.publish(Events.TRIPS_UPDATED, { trips: savedTrips });
    
    // select update table
    this._hub.publish(Events.TRIP_SELECTED, { tripId });
    
    // checking
    alert('Trip updated successfully!');
  }

  loadCSS(fileName) {
    if(this.cssLoaded) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./components/TripPageComponents/${fileName}/${fileName}.css`;
    document.head.appendChild(link);
    this.cssLoaded = true;
  }
}