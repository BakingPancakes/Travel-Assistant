import { EventHub } from "../../lib/eventhub/eventHub.js";
import { Events } from "../../lib/eventhub/Events.js";
import { BaseComponent } from "../BaseComponent/BaseComponent.js";

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
        return `
            <div class="form-popup" id="new-Trip">
                <form>
                    <label for="tripName"><b>Give your trip a name:</b></label>
                    <input type="text" placeholder="Trip Name Here" name="tripName" id="tripName" required>

                    <label for="tripGroup"><b>Who is going?</b></label>
                    <input type="text" placeholder="Enter participants..." name="tripGroup" id="tripGroup" required>

                    <label for="startDate">Start Date:</label>
                    <input type="date" name="startDate" id="startDate" required>
                    
                    <label for="cancel">Cancel</label>
                    <input type="button" name="cancel" id="cancel">
                    <input type="button" id="submit" value="Make Trip">
                </form>
            </div>
        `;
    }

    #attachEventListeners() {
        // Attach event listeners to input and button elements
        const tripInput = this.#container.querySelector("#tripName");
        const groupInput = this.#container.querySelector("#tripGroup");
        const dateInput = this.#container.querySelector("#startDate");
        const cancelBtn = this.#container.querySelector("#cancel");
        const submitBtn = this.#container.querySelector("#submit");

        submitBtn.addEventListener("click", () => 
            this.#handleAddTrip(tripInput, groupInput, dateInput)
        );


    }

    #handleAddTrip(tripInput, groupInput, dateInput) {
        const tripName = tripInput.value;
        const tripGroup = groupInput.value;
        const tripDate = dateInput.value;

        // Validation

        // Publish newTrip event with task, group, and date data
        this.#publishNewTrip(tripName, tripGroup, tripDate);
        // Clear inputs
        this.#clearInputs(tripInput, groupInput, dateInput);
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