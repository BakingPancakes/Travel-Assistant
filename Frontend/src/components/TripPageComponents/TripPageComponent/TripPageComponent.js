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
  _serverUrl = 'http://localhost:3000'; // Backend server URL

  constructor() {
    super();
    this._hub = EventHub.getInstance();
    
    // Create lower components
    this._tripListComponent = new TripListComponent();
    this._tripInputComponent = new TripInputComponent();
    this._tripDetailComponent = new TripDetailComponent();
    
    // For debugging
    window.tripPageComponent = this;
  }

  render() {
    // Create main container
    this._container = document.createElement('div');
    this._container.classList.add('trip-page');

    // Create header
    const header = document.createElement('div');
    header.classList.add('trip-page__header');
    header.innerHTML = `
      <h1>My Trips</h1>
      <button id="new-trip-btn" class="btn-new-trip">+ New Trip</button>
    `;
    this._container.appendChild(header);
    
    // Render lower components
    this._container.appendChild(this._tripListComponent.render());
    this._container.appendChild(this._tripDetailComponent.render());
    this._container.appendChild(this._tripInputComponent.render());
    
    // Connect event listeners
    this.attachEventListeners();
    
    // Load existing trips
    this.loadExistingTrips();

    // Update CSS
    this.loadCSS('TripPageComponent');
    
    return this._container;
  }

  attachEventListeners() {
    // New trip button event
    const newTripBtn = this._container.querySelector('#new-trip-btn');
    newTripBtn.addEventListener('click', () => {
      this._hub.publish(Events.CREATE_NEW_TRIP);
    });
    
    // Subscribe to trip created event
    this._hub.subscribe(Events.TRIP_CREATED, (data) => {
      this.createNewTrip(data.tripData);
    });
    
    // Subscribe to trip updated event
    this._hub.subscribe(Events.TRIP_UPDATED, (data) => {
      this.updateExistingTrip(data.tripId, data.tripData);
    });
    
    // Subscribe to sidebar Trips button clicked event
    this._hub.subscribe(Events.SwitchToTripPage, () => {
      this.showPage();
    });
  }
  
  // Method to display page
  showPage() {
    if (this._container) {
      this._container.style.display = 'flex';
      console.log("Trip page displayed");
    }
  }

  async loadExistingTrips() {
    console.log("Loading existing trips");
    
    try {
      // Try to load trips from backend server
      const response = await fetch(`${this._serverUrl}/trips`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Trips from server:", data);
        
        if (data.trips && Array.isArray(data.trips)) {
          this._trips = data.trips;
          // Update localStorage with server data
          localStorage.setItem('savedTrips', JSON.stringify(this._trips));
          this._hub.publish(Events.TRIPS_UPDATED, { trips: this._trips });
          return;
        }
      } else {
        console.log("Server response not OK:", response.status);
      }
    } catch (error) {
      console.error("Error fetching trips from server:", error);
    }
    
    // If server request fails, fallback to localStorage
    console.log("Falling back to localStorage");
    const savedTrips = localStorage.getItem('savedTrips');
    if (savedTrips) {
      this._trips = JSON.parse(savedTrips);
      this._hub.publish(Events.TRIPS_UPDATED, { trips: this._trips });
    } else {
      console.log("No trips found in localStorage");
    }
  }

  async createNewTrip(tripData) {
    console.log("Creating new trip:", tripData);
    
    // Validation
    if (typeof tripData !== 'object' || tripData === null) {
      console.error("Invalid trip data:", tripData);
      alert("Error: Invalid trip data");
      return;
    }
    
    if (!tripData.name || !tripData.destination || !tripData.traveler) {
      console.error("Missing required fields in trip data:", tripData);
      alert("Error: Missing required trip information");
      return;
    }
    
    try {
      // Try to save to backend server first
      console.log("Sending trip to server:", tripData);
      const response = await fetch(`${this._serverUrl}/trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tripData)
      });
      
      if (response.ok) {
        const savedTrip = await response.json();
        console.log("Trip saved to server successfully:", savedTrip);
        
        // If server returned an ID, use it
        if (savedTrip.id) {
          tripData.id = savedTrip.id;
        }
      } else {
        console.warn("Server returned error:", response.status);
      }
    } catch (error) {
      console.error("Error saving trip to server:", error);
    }
    
    // Save to localStorage as backup
    let savedTrips = [];
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (savedTripsJson) {
      savedTrips = JSON.parse(savedTripsJson);
    }
    
    savedTrips.push(tripData);
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    console.log("Trip saved to localStorage:", tripData);
    console.log("Current trips in localStorage:", savedTrips);
    
    // Update trip table
    this._trips = savedTrips;
    this._hub.publish(Events.TRIPS_UPDATED, { trips: savedTrips });
    
    // Select the new trip
    this._hub.publish(Events.TRIP_SELECTED, { tripId: savedTrips.length - 1 });
    
    // Show success message
    alert('Trip created successfully!');
  }

  async updateExistingTrip(tripId, tripData) {
    console.log("Updating trip:", tripId, tripData);
    
    // Get saved trips
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[tripId]) return;
    
    // Preserve accommodations and todo items
    if (savedTrips[tripId].accommodations) {
      tripData.accommodations = savedTrips[tripId].accommodations;
    }
    
    if (savedTrips[tripId].todoItems) {
      tripData.todoItems = savedTrips[tripId].todoItems;
    }
    
    if (savedTrips[tripId].budget) {
      tripData.budget = savedTrips[tripId].budget;
    }
    
    // If the trip has an ID, try to update on the server
    if (tripData.id) {
      try {
        console.log("Updating trip on server:", tripData);
        const response = await fetch(`${this._serverUrl}/trips/${tripData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tripData)
        });
        
        if (response.ok) {
          console.log("Trip updated on server successfully");
        } else {
          console.warn("Server returned error:", response.status);
        }
      } catch (error) {
        console.error("Error updating trip on server:", error);
      }
    }
    
    // Update locally
    savedTrips[tripId] = tripData;
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // Update trip table
    this._trips = savedTrips;
    this._hub.publish(Events.TRIPS_UPDATED, { trips: savedTrips });
    
    // Select the updated trip
    this._hub.publish(Events.TRIP_SELECTED, { tripId });
    
    // Show success message
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