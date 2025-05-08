import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';

export class AccommodationComponent extends BaseComponent {
  _container = null;
  _hub = null;
  _accommodations = [];
  _totalBudget = 0;
  _tripData = null;
  _currentTripId = null; 

  constructor() {
    super();
    this._hub = EventHub.getInstance();
  }

  render() {
    this._container = document.createElement('div');
    this._container.id = 'accommodation-section';
    this._container.classList.add('section-card');

    this._container.innerHTML = `
      <h2>Accommodation</h2>
      <div class="divider"></div>
      
      <!-- accommodation table -->
      <div id="accommodation-container" class="accommodation-table">
        <div class="acc-header">
          <div class="acc-cell">Traveler</div>
          <div class="acc-cell">Type</div>
          <div class="acc-cell">Price</div>
          <div class="acc-cell actions">Actions</div>
        </div>
        <div id="acc-content">
          <div class="acc-row empty-message">
            <div class="acc-cell" colspan="4">No accommodations added yet.</div>
          </div>
        </div>
      </div>
      
      <!-- add accommodation form -->
      <div class="add-form">
        <h3>Add Accommodation</h3>
        <div class="form-row">
          <label for="acc-traveler">Traveler:</label>
          <select id="acc-traveler" class="styled-select">
            <!-- dynamic fill -->
          </select>
        </div>
        <div class="form-row">
          <label for="acc-type">Type:</label>
          <select id="acc-type" class="styled-select">
            <option value="hotel">Hotel ($200)</option>
            <option value="condo">Condo ($100)</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-row" id="other-price-row" style="display: none;">
          <label for="acc-price">Price:</label>
          <input type="number" id="acc-price" min="0" placeholder="Enter price">
        </div>
        <button id="add-acc-btn" class="btn-add">Add Accommodation</button>
      </div>
      
      <!-- summary budgets -->
      <div class="budget-summary-section">
        <h3>Budget Summary</h3>
        <div class="budget-item total">
          <span>Total Budget:</span>
          <span id="total-budget">$0</span>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.loadCSS('AccommodationComponent');
    
    return this._container;
  }

  attachEventListeners() {
    // add trip button
    const addAccBtn = this._container.querySelector('#add-acc-btn');
    addAccBtn.addEventListener('click', () => {
      this.addAccommodation();
    });

    // select place event set up
    const accTypeSelect = this._container.querySelector('#acc-type');
    const accPriceRow = this._container.querySelector('#other-price-row');
    
    accTypeSelect.addEventListener('change', () => {
      if (accTypeSelect.value === 'other') {
        accPriceRow.style.display = 'block';
      } else {
        accPriceRow.style.display = 'none';
      }
    });

    // subscribe event 
    this._hub.subscribe(Events.TRIP_SELECTED, (data) => {
      this.loadTripData(data.tripId);
    });

    this._hub.subscribe(Events.TRIP_DETAILS_SAVE_REQUESTED, () => {
      this._hub.publish(Events.ACCOMMODATION_DATA_UPDATED, {
        accommodations: this._accommodations,
        totalBudget: this._totalBudget
      });
    });
  }

  loadTripData(tripId) {
    // Skip if we're already displaying this trip
    if (this._currentTripId === tripId) {
      return;
    }
    
    this._currentTripId = tripId;
    
    // load trip data
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[tripId]) return;
    
    this._tripData = savedTrips[tripId];
    
    // regenerate data structure 
    this._accommodations = this._tripData.accommodations || [];
    
    // update display
    this.updateAccommodationDisplay();
    
    // add select travelers for add accommodation
    this.updateTravelerOptions();
  }

  updateTravelerOptions() {
    if (!this._tripData) return;
    
    const travelerSelect = this._container.querySelector('#acc-traveler');
    travelerSelect.innerHTML = '';
    
    // add main traveler
    const mainOption = document.createElement('option');
    mainOption.value = this._tripData.traveler;
    mainOption.textContent = this._tripData.traveler;
    travelerSelect.appendChild(mainOption);
    
    // add companion
    if (this._tripData.companions) {
      const companions = this._tripData.companions.split(', ');
      companions.forEach(companion => {
        if (companion.trim()) {
          const option = document.createElement('option');
          option.value = companion.trim();
          option.textContent = companion.trim();
          travelerSelect.appendChild(option);
        }
      });
    }
  }

  updateAccommodationDisplay() {
    const accContent = this._container.querySelector('#acc-content');
    accContent.innerHTML = '';
    
    if (!this._accommodations || this._accommodations.length === 0) {
      accContent.innerHTML = `
        <div class="acc-row empty-message">
          <div class="acc-cell" colspan="4">No accommodations added yet.</div>
        </div>
      `;
      this._container.querySelector('#total-budget').textContent = '$0';
      this._totalBudget = 0;
      return;
    }
    
    let totalBudget = 0;
    
    this._accommodations.forEach((acc, index) => {
      const row = document.createElement('div');
      row.classList.add('acc-row');
      
      let typeText = 'Other';
      if (acc.type === 'hotel') typeText = 'Hotel';
      else if (acc.type === 'condo') typeText = 'Condo';
      
      row.innerHTML = `
        <div class="acc-cell">${acc.person}</div>
        <div class="acc-cell">${typeText}</div>
        <div class="acc-cell">$${acc.price}</div>
        <div class="acc-cell actions">
          <button class="delete-acc-btn" data-index="${index}">×</button>
        </div>
      `;
      
      accContent.appendChild(row);
      totalBudget += acc.price;
    });
    
    // add event listener for delete button
    this._container.querySelectorAll('.delete-acc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        this.deleteAccommodation(index);
      });
    });
    
    // update total budgets
    this._totalBudget = totalBudget;
    this._container.querySelector('#total-budget').textContent = `$${totalBudget}`;
  }

  addAccommodation() {
    if (!this._tripData) return;
    
    const traveler = this._container.querySelector('#acc-traveler').value;
    const accType = this._container.querySelector('#acc-type').value;
    let price = 0;
    
    if (accType === 'hotel') {
      price = 200;
    } else if (accType === 'condo') {
      price = 100;
    } else if (accType === 'other') {
      price = parseFloat(this._container.querySelector('#acc-price').value);
      if (isNaN(price) || price < 0) {
        alert('Please enter a valid price');
        return;
      }
    }
    
    // check if the traveler has accommodation
    const existingIndex = this._accommodations.findIndex(
      acc => acc.person === traveler
    );
    
    if (existingIndex >= 0) {
      // update exist
      this._accommodations[existingIndex] = {
        person: traveler,
        type: accType,
        price: price
      };
    } else {
      // add new
      this._accommodations.push({
        person: traveler,
        type: accType,
        price: price
      });
    }
    
    // update display
    this.updateAccommodationDisplay();
    
    // reset other value accommodation
    if (accType === 'other') {
      this._container.querySelector('#acc-price').value = '';
    }
    
    this._container.querySelector('#other-price-row').style.display = 'none';
    
    // reset hotel for selection
    this._container.querySelector('#acc-type').value = 'hotel';
  }

  deleteAccommodation(index) {
    // update data
    this._accommodations.splice(index, 1);
    
    // update display
    this.updateAccommodationDisplay();
  }

  loadCSS(fileName) {
    if(this.cssLoaded) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./components/TripPageComponents/AccommodationComponent/${fileName}.css`;
    document.head.appendChild(link);
    this.cssLoaded = true;
  }
}