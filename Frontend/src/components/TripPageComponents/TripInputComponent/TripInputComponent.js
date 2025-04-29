import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';
import { Trip } from '../models/Trip.js';

export class TripInputComponent extends BaseComponent {
    #container = null;
    #hub = null;

    constructor() {
        super();
        this.loadCSS('TripInputComponent');
        this.#hub = EventHub.getInstance();
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
        this.#container = document.createElement('div');
        this.#container.classList.add('trip-input');
        this.#container.innerHTML = this.#getTemplate();
    }

    #getTemplate() {
        return `
            <div class="form-popup" id="new-Trip">
                <form>
                    <label for="tripName"><b>Trip Name</b></label>
                    <input type="text" placeholder="Enter trip name" name="tripName" id="tripName" required>

                    <label for="destination"><b>Destination</b></label>
                    <input type="text" placeholder="Where are you going?" name="destination" id="destination" required>

                    <label for="traveler"><b>Traveler</b></label>
                    <input type="text" placeholder="Your name" name="traveler" id="traveler" required>

                    <label for="companions"><b>Companions</b></label>
                    <input type="text" placeholder="Companion names (optional)" name="companions" id="companions">

                    <label for="from">Departure Date</label>
                    <input type="date" name="from" id="from" required>
                    
                    <label for="to">Return Date</label>
                    <input type="date" name="to" id="to" required>
                    
                    <div class="form-actions">
                        <button type="button" id="cancel">Cancel</button>
                        <button type="button" id="submit">Create Trip</button>
                    </div>
                </form>
            </div>
        `;
    }

    #attachEventListeners() {
        const submitBtn = this.#container.querySelector('#submit');
        const cancelBtn = this.#container.querySelector('#cancel');

        submitBtn.addEventListener('click', () => this.#handleSubmit());
        cancelBtn.addEventListener('click', () => this.#handleCancel());
    }

    #handleSubmit() {
        // Get input values
        const tripName = this.#container.querySelector('#tripName').value.trim();
        const destination = this.#container.querySelector('#destination').value.trim();
        const traveler = this.#container.querySelector('#traveler').value.trim();
        const companions = this.#container.querySelector('#companions').value.trim();
        const from = this.#container.querySelector('#from').value;
        const to = this.#container.querySelector('#to').value;

        // Validate required fields
        if (!tripName || !destination || !traveler || !from || !to) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate dates
        if (new Date(from) > new Date(to)) {
            alert('Departure date must be before return date.');
            return;
        }

        // Create new trip object
        const newTrip = new Trip({
            name: tripName,
            destination: destination,
            traveler: traveler,
            companions: companions,
            from: from,
            to: to
        });

        // Publish new trip event
        this.#hub.publish(Events.NewTrip, newTrip.toJSON());
        
        // Clear form
        this.#resetForm();
    }

    #handleCancel() {
        // Reset form and hide input
        this.#resetForm();
    }

    #resetForm() {
        // Reset all input fields
        const inputs = this.#container.querySelectorAll('input[type="text"], input[type="date"]');
        inputs.forEach(input => input.value = '');
    }
}