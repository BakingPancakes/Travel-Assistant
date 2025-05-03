import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';
import { TripListComponent } from '../TripListComponent/TripListComponent.js';
import { TripInputComponent } from '../TripInputComponent/TripInputComponent.js';

export class TripPageComponent extends BaseComponent {
    #container = null;
    #hub = null;
    #tripListComponent = null;
    #tripInputComponent = null;

    constructor() {
        super();
        this.loadCSS('TripPageComponent');
        this.#hub = EventHub.getInstance();
        
        // Initialize child components
        this.#tripListComponent = new TripListComponent();
        this.#tripInputComponent = new TripInputComponent();
    }

    render() {
        // Create main container
        this.#container = document.createElement('div');
        this.#container.classList.add('trip-page');


        // Create page structure
        this.#container.innerHTML = `
            <div class="trip-page__header">
                <h1>My Trips</h1>
                <button id="new-trip-btn" class="btn-new-trip">+ New Trip</button>
            </div>
            <div id="trip-input-container" class="trip-input-container" style="display: none;"></div>
            <div id="trip-list-container" class="trip-list-container"></div>
        `;

        // Render trip list
        const tripListContainer = this.#container.querySelector('#trip-list-container');
        tripListContainer.appendChild(this.#tripListComponent.render());

        // Render trip input (hidden by default)
        const tripInputContainer = this.#container.querySelector('#trip-input-container');
        tripInputContainer.appendChild(this.#tripInputComponent.render());

        // Attach event listeners
        this.#attachEventListeners();

        return this.#container;
    }

    #attachEventListeners() {
        // Toggle trip input visibility
        const newTripBtn = this.#container.querySelector('#new-trip-btn');
        const tripInputContainer = this.#container.querySelector('#trip-input-container');

        newTripBtn.addEventListener('click', () => {
            const isVisible = tripInputContainer.style.display !== 'none';
            tripInputContainer.style.display = isVisible ? 'none' : 'block';
        });

        // Listen for new trip event to hide input
        this.#hub.subscribe(Events.NewTrip, () => {
            const tripInputContainer = this.#container.querySelector('#trip-input-container');
            tripInputContainer.style.display = 'none';
        });
    }
}