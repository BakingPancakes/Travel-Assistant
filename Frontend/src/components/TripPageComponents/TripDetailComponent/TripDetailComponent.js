import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';
import { AccommodationComponent } from '../AccommodationComponent/AccommodationComponent.js';
import { TodoComponent } from '../TodoComponent/TodoComponent.js';

export class TripDetailComponent extends BaseComponent {
  _container = null;
  _hub = null;
  _selectedTripId = null;
  _accommodationComponent = null;
  _todoComponent = null;
  _tripData = null;
  _isProcessingSelection = false; // Flag to prevent recursive calls

  constructor() {
    super();
    this._hub = EventHub.getInstance();
    this._accommodationComponent = new AccommodationComponent();
    this._todoComponent = new TodoComponent();
  }

  render() {
    this._container = document.createElement('div');
    this._container.id = 'trip-details-section';
    this._container.classList.add('trip-details-section');
    this._container.style.display = 'none';

    this._container.innerHTML = `
      <h2 id="selected-trip-name">Trip Details</h2>
      <div class="flexible-container">
        <!-- accommodation and todo render -->
      </div>
      <div class="save-button-container">
        <button id="save-trip-details" class="btn-save">Save Trip Details</button>
      </div>
    `;

    // add lower components 
    const flexContainer = this._container.querySelector('.flexible-container');
    flexContainer.appendChild(this._accommodationComponent.render());
    flexContainer.appendChild(this._todoComponent.render());

    this.attachEventListeners();
    this.loadCSS('TripDetailComponent');
    
    return this._container;
  }

  attachEventListeners() {
    // trip detail button
    const saveTripDetailsBtn = this._container.querySelector('#save-trip-details');
    saveTripDetailsBtn.addEventListener('click', () => {
      this.saveTripDetails();
    });

    // Modify this event subscription to prevent recursive calls
    this._hub.subscribe(Events.TRIP_SELECTED, (data) => {
      // Skip if already processing this trip or it's the same trip
      if (this._isProcessingSelection || this._selectedTripId === data.tripId) {
        return;
      }
      this.selectTrip(data.tripId);
    });

    this._hub.subscribe(Events.TRIP_CREATED, () => {
      this._container.style.display = 'none';
    });

    this._hub.subscribe(Events.TRIP_UPDATED, () => {
      if (this._selectedTripId !== null) {
        this.selectTrip(this._selectedTripId);
      }
    });

    this._hub.subscribe(Events.TRIP_DELETED, (data) => {
      if (this._selectedTripId === data.tripId) {
        this._container.style.display = 'none';
        this._selectedTripId = null;
      }
    });

    this._hub.subscribe(Events.TRIP_FORM_CANCELLED, () => {
      if (this._selectedTripId !== null) {
        this._container.style.display = 'block';
      }
    });

    // update from lower components
    this._hub.subscribe(Events.ACCOMMODATION_DATA_UPDATED, (data) => {
      if (this._tripData) {
        this._tripData.accommodations = data.accommodations;
        this._tripData.budget = data.totalBudget;
      }
    });

    this._hub.subscribe(Events.TODO_DATA_UPDATED, (data) => {
      if (this._tripData) {
        this._tripData.todoItems = data.todoItems;
      }
    });
  }

  selectTrip(tripId) {
    // Set processing flag to prevent recursive calls
    this._isProcessingSelection = true;
    
    // Store the selected trip ID
    this._selectedTripId = tripId;
    
    try {
      // get data
      const savedTripsJson = localStorage.getItem('savedTrips');
      if (!savedTripsJson) {
        this._isProcessingSelection = false;
        return;
      }
      
      const savedTrips = JSON.parse(savedTripsJson);
      if (!savedTrips[tripId]) {
        this._isProcessingSelection = false;
        return;
      }
      
      this._tripData = savedTrips[tripId];
      
      // update travel section 
      this._container.querySelector('#selected-trip-name').textContent = 
        `${this._tripData.name} - ${this._tripData.destination}`;
      
      // show section 
      this._container.style.display = 'block';
      
      // Let child components know about the trip selection, but don't re-publish the same event
      if (this._accommodationComponent) {
        this._accommodationComponent.loadTripData(tripId);
      }
      
      if (this._todoComponent) {
        this._todoComponent.loadTodoItems(tripId);
      }
    } finally {
      // Reset the processing flag
      this._isProcessingSelection = false;
    }
  }

  saveTripDetails() {
    if (this._selectedTripId === null) return;
    
    // publish lower components events
    this._hub.publish(Events.TRIP_DETAILS_SAVE_REQUESTED);
    
    // get saved data
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[this._selectedTripId]) return;
    
    // update travel
    savedTrips[this._selectedTripId] = this._tripData;
    
    // save data
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // checking
    alert('Trip details saved successfully!');
    
    // update table
    this._hub.publish(Events.TRIPS_UPDATED, { trips: savedTrips });
  }

  loadCSS(fileName) {
    if(this.cssLoaded) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Use absolute path instead of relative path
    link.href = `/components/TripPageComponents/${fileName}/${fileName}.css`;
    document.head.appendChild(link);
    this.cssLoaded = true;
  }
}