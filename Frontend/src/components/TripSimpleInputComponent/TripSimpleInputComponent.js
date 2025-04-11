import { EventHub } from "../../lib/eventhub/eventHub";
import { Events } from "../../lib/eventhub/Events";
import { BaseComponent } from "../BaseComponent/BaseComponent";

export class TripSimpleInputComponent extends BaseComponent {
    #container = null;

    constructor() {
        super();
        this.loadCSS("TripSimpleInputComponent");
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#createContainer();
        this.#attachEventListeners();
        return this.#container;
    }

    #createContainer() {
        // Create and configure the container element
        this.#container = document.createElement('div');
        this.#container.classList.add('trip-input');
        this.#container.innerHTML = this.#getTemplate();
    }

    #getTemplate() {
        // Returns the HTML template for the component
        throw new Error("Not yet implemented");
    }

    #attachEventListeners() {
        throw new Error("Not yet implemented");
    }

    #handleAddTrip(tripInput, groupInput, dateInput) {
        const tripName = tripInput.value;
        const tripGroup = groupInput.value;
        const tripDate = dateInput.value;

        // Validation

        // Publish newTrip event with task, group, and date data
        //this.#publishNewTrip(tripName, tripGroup, tripDate);
        // Clear inputs
        //this.#clearInputs(tripInput, groupInput, dateInput);
    }

    #publishNewTrip(name, group, date) {
        const hub = EventHub.getInstance();
        hub.publish(Events.NewTrip, {name, group, date});
        hub.publish(Events.StoreTrip, { trip, group, date });
    }

    #clearInputs(tripInput, groupInput, dateInput) {
        tripInput.value = "";
        groupInput.value = "";
        dateInput.value = "";
    }
}