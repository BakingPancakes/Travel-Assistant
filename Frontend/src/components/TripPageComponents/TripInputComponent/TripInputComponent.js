import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';

export class TripInputComponent extends BaseComponent {
  _container = null;
  _hub = null;
  _editMode = false;
  _selectedTripId = null;

  constructor() {
    super();
    this._hub = EventHub.getInstance();
  }

  render() {
    this._container = document.createElement('div');
    this._container.id = 'trip-input-container';
    this._container.classList.add('trip-form');
    this._container.style.display = 'none';

    this._container.innerHTML = `
      <h2 id="trip-form-title">Plan Your Trip</h2>
      <div class="form-row">
        <label for="tripName">Trip Name:</label>
        <input type="text" id="tripName" placeholder="Enter trip name">
      </div>
      <div class="form-row">
        <label for="destination">Destination:</label>
        <input type="text" id="destination" placeholder="Where are you going?">
      </div>
      <div class="form-row">
        <label for="traveler">Your Name:</label>
        <input type="text" id="traveler" placeholder="Your name">
      </div>
      <div class="form-row">
        <label for="companionsCount">Number of Companions:</label>
        <select id="companionsCount" class="styled-select">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div id="companions-container"></div>
      <div class="form-row">
        <label for="departureDate">Departure Date:</label>
        <input type="date" id="departureDate">
      </div>
      <div class="form-row">
        <label for="returnDate">Return Date:</label>
        <input type="date" id="returnDate">
      </div>
      <div class="form-actions">
        <button id="cancelTrip" class="btn-cancel">Cancel</button>
        <button id="saveTrip" class="btn-create">Save Trip</button>
      </div>
    `;

    this.attachEventListeners();
    this.loadCSS('TripInputComponent');
    
    return this._container;
  }

  attachEventListeners() {
    // change companions
    const companionsCount = this._container.querySelector('#companionsCount');
    companionsCount.addEventListener('change', () => {
      this.renderCompanionInputs(parseInt(companionsCount.value));
    });

    // cancel button
    const cancelBtn = this._container.querySelector('#cancelTrip');
    cancelBtn.addEventListener('click', () => {
      this._container.style.display = 'none';
      this._hub.publish(Events.TRIP_FORM_CANCELLED);
    });

    // Trip save button
    const saveTripBtn = this._container.querySelector('#saveTrip');
    saveTripBtn.addEventListener('click', () => {
      if (this.validateTripForm()) {
        const tripData = this.getTripDataFromForm();
        
        if (this._editMode) {
          this._hub.publish(Events.TRIP_UPDATED, {
            tripId: this._selectedTripId,
            tripData
          });
        } else {
          this._hub.publish(Events.TRIP_CREATED, { tripData });
        }
        
        this._container.style.display = 'none';
        
        // checking 
        console.log("Trip data sent to event hub:", 
          this._editMode ? "TRIP_UPDATED" : "TRIP_CREATED", 
          tripData);
      }
    });

    // subscribe event
    this._hub.subscribe(Events.CREATE_NEW_TRIP, () => {
      this.showCreateForm();
    });

    this._hub.subscribe(Events.TRIP_EDIT, (data) => {
      this.showEditForm(data.tripId);
    });
  }

  renderCompanionInputs(count) {
    const companionsContainer = this._container.querySelector('#companions-container');
    companionsContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const companionRow = document.createElement('div');
      companionRow.classList.add('form-row');
      companionRow.innerHTML = `
        <label for="companion${i}">Companion ${i + 1}:</label>
        <input type="text" id="companion${i}" class="companion-input" placeholder="Companion name">
      `;
      companionsContainer.appendChild(companionRow);
    }
  }

  showCreateForm() {
    this._editMode = false;
    this._selectedTripId = null;
    
    // reset from
    this.resetForm();
    
    // show trip form
    this._container.style.display = 'block';
    this._container.querySelector('#trip-form-title').textContent = 'Plan Your Trip';
  }

  showEditForm(tripId) {
    this._editMode = true;
    this._selectedTripId = tripId;
    
    // get saved trip data
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[tripId]) return;
    
    const trip = savedTrips[tripId];
    
    // fill form
    this._container.querySelector('#trip-form-title').textContent = 'Edit Trip';
    this._container.querySelector('#tripName').value = trip.name || '';
    this._container.querySelector('#destination').value = trip.destination || '';
    this._container.querySelector('#traveler').value = trip.traveler || '';
    this._container.querySelector('#departureDate').value = trip.from || '';
    this._container.querySelector('#returnDate').value = trip.to || '';
    
    // companions edit
    let companionsCount = 0;
    if (trip.companions) {
      const companions = trip.companions.split(', ');
      companionsCount = companions.length;
      this._container.querySelector('#companionsCount').value = companionsCount;
      
      // field render
      this.renderCompanionInputs(companionsCount);
      
      // fill input
      const companionInputs = this._container.querySelectorAll('.companion-input');
      companions.forEach((companion, index) => {
        if (index < companionInputs.length) {
          companionInputs[index].value = companion.trim();
        }
      });
    } else {
      this._container.querySelector('#companionsCount').value = '0';
      this._container.querySelector('#companions-container').innerHTML = '';
    }
    
    this._container.style.display = 'block';
  }

  validateTripForm() {
    const tripName = this._container.querySelector('#tripName').value.trim();
    const destination = this._container.querySelector('#destination').value.trim();
    const traveler = this._container.querySelector('#traveler').value.trim();
    const departureDate = this._container.querySelector('#departureDate').value;
    const returnDate = this._container.querySelector('#returnDate').value;
    
    if (!tripName || !destination || !traveler || !departureDate || !returnDate) {
      alert('Please fill in all required fields');
      return false;
    }
    
    if (new Date(departureDate) > new Date(returnDate)) {
      alert('Departure date must be before return date');
      return false;
    }
    
    return true;
  }

  getTripDataFromForm() {
    // get companion
    const companionInputs = this._container.querySelectorAll('.companion-input');
    const companions = Array.from(companionInputs)
      .map(input => input.value.trim())
      .filter(value => value !== '')
      .join(', ');
    
    return {
      name: this._container.querySelector('#tripName').value.trim(),
      destination: this._container.querySelector('#destination').value.trim(),
      traveler: this._container.querySelector('#traveler').value.trim(),
      companions: companions,
      from: this._container.querySelector('#departureDate').value,
      to: this._container.querySelector('#returnDate').value,
      budget: 0,
      accommodations: [],
      todoItems: {
        before: [],
        during: [],
        after: []
      }
    };
  }

  resetForm() {
    // reset form
    this._container.querySelector('#tripName').value = '';
    this._container.querySelector('#destination').value = '';
    this._container.querySelector('#traveler').value = '';
    this._container.querySelector('#companionsCount').value = '0';
    this._container.querySelector('#companions-container').innerHTML = '';
    this._container.querySelector('#departureDate').value = '';
    this._container.querySelector('#returnDate').value = '';
  }

  loadCSS(fileName) {
    if(this.cssLoaded) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./components/TripPageComponents/TripInputComponent/${fileName}.css`;
    document.head.appendChild(link);
    this.cssLoaded = true;
  }
}