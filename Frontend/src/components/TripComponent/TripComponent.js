import { BaseComponent } from "../BaseComponent/BaseComponent.js";

export class TripComponent extends BaseComponent {
    #container = null;

    constructor(tripData = {}) {
        super();
        this.tripData = tripData;
        this.loadCSS('TripComponent');
    }

    render() {
        // Create main container
        this.#container = document.createElement('div');
        this.#container.classList.add('t-body__row row');

        // Render the trip name
        const tripName = this.#createTripName();
        this.#container.appendChild(tripName);

        // Render the trip participants
        const tripGroup = this.#createTripGroup();
        this.#container.appendChild(tripGroup);

        // Render the trip date
        const tripDate = this.#createTripDate();
        this.#container.appendChild(tripDate);

        return this.#container;
    }

    // Private methods for creating trip-item elements
    #createTripName() {
        const tripName = document.createElement('div');
        tripName.classList.add('t-body__col col');
        tripName.textContent = this.tripData.name;
        return tripName;
    }

    #createTripGroup() {
        const tripGroup = document.createElement('div');
        tripGroup.classList.add('t-body__col col');
        tripGroup.textContent = this.tripData.group;
        return tripGroup;
    }

    #createTripDate
}