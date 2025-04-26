import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/Events.js';
import { TripComponent } from '../TripComponent/TripComponent.js';

export class TripListComponent extends BaseComponent {
    #container = null;
    #trips = [];
    #hub = null;

    constructor() {
        super();
        this.loadCSS('TripListComponent');
        this.#hub = EventHub.getInstance();
        this.#setupEventListeners();
    }

    render() {
        // Create main container
        this.#container = document.createElement('div');
        this.#container.classList.add('trip-list');
        
        // Create table structure
        this.#container.innerHTML = `
            <div class="table">
                <div class="table__header">
                    <div class="t-header__row row">
                        <div class="t-header__col col">Trip</div>
                        <div class="t-header__col col">Who's Going?</div>
                        <div class="t-header__col col">When?</div>
                    </div>
                </div>
                <div class="table__body" id="trips-container">
                    <!-- Trips will be dynamically added here -->
                </div>
            </div>
        `;

        // Render existing trips
        this.#renderTrips();

        return this.#container;
    }

    #setupEventListeners() {
        // Listen for new trip events
        this.#hub.subscribe(Events.NewTrip, (tripData) => {
            this.#addTrip(tripData);
        });

        // Listen for load trips events
        this.#hub.subscribe(Events.LoadTripsSuccess, (trips) => {
            this.#updateTripList(trips);
        });
    }

    #addTrip(tripData) {
        this.#trips.push(tripData);
        this.#renderTrips();
    }

    #updateTripList(trips) {
        this.#trips = trips;
        this.#renderTrips();
    }

    #renderTrips() {
        // Find the container for trips
        const tripsContainer = this.#container.querySelector('#trips-container');
        
        // Clear existing trips
        tripsContainer.innerHTML = '';

        // Render each trip
        this.#trips.forEach(tripData => {
            const tripComponent = new TripComponent(tripData);
            tripsContainer.appendChild(tripComponent.render());
        });

        // If no trips, show a placeholder
        if (this.#trips.length === 0) {
            tripsContainer.innerHTML = `
                <div class="no-trips">
                    <p>No trips planned yet. Create your first trip!</p>
                </div>
            `;
        }
    }
}