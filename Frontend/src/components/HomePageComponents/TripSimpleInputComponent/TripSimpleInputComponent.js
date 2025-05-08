import { EventHub } from "../../../lib/eventhub/eventHub.js";
import { Events } from "../../../lib/eventhub/events.js";
import { BaseComponent } from "../../BaseComponent/BaseComponent.js";

export class TripSimpleInputComponent extends BaseComponent {
    #container = null;

    constructor() {
        super();
        this.loadCSS("TripSimpleInputComponent");
    }

    render() {
        this.#createContainer();
        this.#attachEventListeners();
        return this.#container;
    }

    loadCSS(fileName) {
        if(this.cssLoaded) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // Dynamically load CSS from the same directory as the JS file
        link.href = `/components/HomePageComponents/${fileName}/${fileName}.css`;

        document.head.appendChild(link);
        this.cssLoaded = true;
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
            <div id="modal">
                <div class="form-popup" id="new-Trip">
                    <form>
                        <label for="tripName"><b>Give your trip a name:</b></label>
                        <input type="text" placeholder="Trip Name Here" name="tripName" id="tripName" required>

                        <label for="tripGroup"><b>Who is going?</b></label>
                        <input type="text" placeholder="Enter participants..." name="tripGroup" id="tripGroup" required>

                        <label for="startDate">Start Date:</label>
                        <input type="date" name="startDate" id="startDate" required>

                        <label for="endDate">End Date:</label>
                        <input type="date" name="endDate" id="endDate">
                        
                        <label for="cancel">Cancel</label>
                        <input type="button" name="cancel" id="cancel" value="cancel">
                        <input type="button" id="submit" value="Make Trip">
                    </form>
                </div>
            </div>
        `;
    }

    #attachEventListeners() {
        // Attach event listeners to input and button elements
        const tripInput = this.#container.querySelector("#tripName");
        let groupInput = this.#container.querySelector("#tripGroup");
        const startDateInput = this.#container.querySelector("#startDate");
        const endDateInput = this.#container.querySelector("#endDate");
        const cancelBtn = this.#container.querySelector("#cancel");
        const submitBtn = this.#container.querySelector("#submit");

        submitBtn.addEventListener("click", () => 
            this.#handleAddTrip(tripInput, groupInput, startDateInput, endDateInput)
        );

        cancelBtn.addEventListener("click", () => {
            this.#cancel();
        });

        // Don't permit users to access dates before current day
        const yesterday = () => {
            let date = new Date();
            date.setDate(date.getDate() - 1);
            return date.toISOString().split('T')[0];
        };
        const forbiddenDate = yesterday();
        startDateInput.setAttribute('min', forbiddenDate);
        endDateInput.setAttribute('min', forbiddenDate);

        // User can't select a date before current startDate
        startDateInput.addEventListener("change", () => {
            endDateInput.setAttribute('min', startDateInput.value);
        });


    }

    #handleAddTrip(tripInput, groupInput, dateInputStart, dateInputEnd) {
        const tripName = tripInput.value;
        let tripGroup = groupInput.value;
        const tripDateStart = dateInputStart.value;
        let tripDateEnd = dateInputEnd.value;

        // Validation
        if(tripDateEnd === "") {
            tripDateEnd = tripDateStart;
        }
        if (tripName === "Trip Name Here" || tripName === "") {
            alert("You must name your trip!");
            return;
        }
        if (tripGroup === "Enter participants..." || tripGroup === "") {
            tripGroup = "Not sure yet!";
        }
        if (tripDateStart === "") {
            alert("You need to set a day to go!");
            return;
        }

        const tripData = {
            name: tripName.trim(),
            destination: 'No destination yet!',
            traveler: '',
            companions: tripGroup,
            from: tripDateStart,
            to: tripDateEnd,
            budget: 0,
            accommodations: [],
            todoItems: {
              before: [],
              during: [],
              after: []
            }
          };
        // Publish newTrip event with task, group, and date data
        this.#publishNewTrip(tripData);
        // Clear inputs
        this.#clear();
    }

    #cancel() {
        this.#container.innerHTML = ``;
    }

    #publishNewTrip(tripData) {
        const hub = EventHub.getInstance();
        hub.publish(Events.TRIP_CREATED, { tripData });
        console.log("Successfully added trip!");
    }

    #clear() {
        this.#container.innerHTML = ``;
    }
}