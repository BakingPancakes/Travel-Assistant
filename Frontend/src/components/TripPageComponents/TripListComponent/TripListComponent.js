import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';

export class TripListComponent extends BaseComponent {
  _container = null;
  _hub = null;
  _trips = [];

  constructor() {
    super();
    this._hub = EventHub.getInstance();
  }

  render() {
    this._container = document.createElement('div');
    this._container.classList.add('trip-table');

    this._container.innerHTML = `
      <div class="table-header">
        <div class="header-cell">Trip</div>
        <div class="header-cell">Who's Going?</div>
        <div class="header-cell">When?</div>
        <div class="header-cell actions">Actions</div>
      </div>
      <div id="trip-list-body" class="table-body">
        <div class="table-row">
          <div class="table-cell" colspan="4">No trips planned yet. Create your first trip!</div>
        </div>
      </div>
    `;

    this.loadExistingTrips();
    this.attachEventListeners();
    this.loadCSS('TripListComponent');

    return this._container;
  }

  loadExistingTrips() {
    const savedTrips = localStorage.getItem('savedTrips');
    if (savedTrips) {
      this._trips = JSON.parse(savedTrips);
      this.updateTripTable();
    }
  }

  updateTripTable() {
    const tableBody = this._container.querySelector('#trip-list-body');
    
    // delete original data
    tableBody.innerHTML = '';
    
    if (!this._trips || this._trips.length === 0) {
      // if no travel 
      tableBody.innerHTML = `
        <div class="table-row">
          <div class="table-cell" colspan="4">No trips planned yet. Create your first trip!</div>
        </div>
      `;
      return;
    }
    
    // add each trip into table
    this._trips.forEach((trip, index) => {
      const row = document.createElement('div');
      row.classList.add('table-row');
      row.setAttribute('data-trip-id', index);
      
      // add dates
      const startDate = trip.from ? new Date(trip.from) : null;
      const endDate = trip.to ? new Date(trip.to) : null;
      let dateText = 'Dates not set';
      
      if (startDate && endDate) {
        const startFormatted = startDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        const endFormatted = endDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        dateText = `${startFormatted} - ${endFormatted}`;
      }
      
      row.innerHTML = `
        <div class="table-cell trip-name clickable">${trip.name}</div>
        <div class="table-cell trip-travelers clickable">${trip.companions ? `${trip.traveler} + ${trip.companions}` : trip.traveler}</div>
        <div class="table-cell trip-dates clickable">${dateText}</div>
        <div class="table-cell actions">
          <button class="edit-trip-btn" data-trip-id="${index}">Edit</button>
          <button class="delete-trip-btn" data-trip-id="${index}">×</button>
        </div>
      `;
      
      // when you click line, you can see details
      row.addEventListener('click', (e) => {
        // actions 셀 내의 버튼 클릭은 무시
        if (!e.target.closest('.actions')) {
          this._hub.publish(Events.TRIP_SELECTED, { tripId: index });
        }
      });
      
      tableBody.appendChild(row);
    });
    
    // edit % delete event listener
    this._container.querySelectorAll('.edit-trip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tripId = parseInt(btn.getAttribute('data-trip-id'));
        this._hub.publish(Events.TRIP_EDIT, { tripId });
      });
    });
    
    this._container.querySelectorAll('.delete-trip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tripId = parseInt(btn.getAttribute('data-trip-id'));
        this.deleteTrip(tripId);
      });
    });
  }

  deleteTrip(tripId) {
    // check delete
    if (!confirm('Are you sure you want to delete this trip?')) {
      return;
    }
    
    // delete 
    this._trips.splice(tripId, 1);
    
    // save update data
    localStorage.setItem('savedTrips', JSON.stringify(this._trips));
    
    // update display
    this.updateTripTable();
    
    // publish delete event
    this._hub.publish(Events.TRIP_DELETED, { tripId });
  }

  setTrips(trips) {
    this._trips = trips;
    this.updateTripTable();
  }

  attachEventListeners() {
    // update trip data event listener
    this._hub.subscribe(Events.TRIPS_UPDATED, (data) => {
      this.setTrips(data.trips);
    });
  }

  loadCSS(fileName) {
    if(this.cssLoaded) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./components/TripPageComponents/TripListComponent/${fileName}.css`;
    document.head.appendChild(link);
    this.cssLoaded = true;
  }
}