import { BaseComponent } from "../BaseComponent/BaseComponent";
import { EventHub } from "../../lib/eventhub/eventHub";
import { Events } from "../../lib/eventhub/Events";

export class TripPageComponent extends BaseComponent {
    #container = null;
    #tripData = null;

    constructor() {
        super();
        this.loadCSS('TripPageComponent');
        this.#setupEventSubscriptions();
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();

        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('trip-page-container');
    }

    #setupContainerContent() {
        // trip-info, todo list, and navigate
        this.#container.innerHTML = `
            <div class="trip-page-header">
                <h1>Trip Details</h1>
                <button id="edit-trip-button">Edit Trip</button>
            </div>
            <div class="trip-page-main-content">
                <!-- trip info section-->
                <div id="trip-info-section"></div>
                
                <!-- todo-list section -->
                <div id="todo-section"></div>
            </div>
        `;

        this.#attachEventListeners();
    }

    #attachEventListeners() {
        const editButton = this.#container.querySelector('#edit-trip-button');
        editButton.addEventListener('click', () => this.#handleEditTrip());
    }

    #handleEditTrip() {
        // Travel edit 
        this.dispatchCustomEvent(Events.EditTrip, this.#tripData);
    }

    setTripData(tripData) {
        this.#tripData = tripData;
        this.#updateTripDisplay();
    }

    #updateTripDisplay() {
        // Update by travel data.
        const tripInfoSection = this.#container.querySelector('#trip-info-section');
        tripInfoSection.innerHTML = `
            <p>Location: ${this.#tripData.location || 'Not specified'}</p>
            <p>Traveler: ${this.#tripData.traveler || 'Not specified'}</p>
            <p>Companions: ${this.#tripData.companions || 'None'}</p>
            <p>From: ${this.#tripData.from || 'Not specified'}</p>
            <p>To: ${this.#tripData.to || 'Not specified'}</p>
        `;
    }
}