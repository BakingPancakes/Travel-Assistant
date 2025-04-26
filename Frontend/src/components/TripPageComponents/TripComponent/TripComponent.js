import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { Trip } from '../models/Trip.js';

export class TripComponent extends BaseComponent {
    #container = null;
    #tripData = null;

    constructor(tripData = {}) {
        super();
        this.#tripData = new Trip(tripData);
        this.loadCSS('TripComponent');
    }

    render() {
        // Create main container
        this.#container = document.createElement('div');
        this.#container.classList.add('t-body__row', 'row');

        // Create columns for trip details
        const columns = [
            this.#createColumn('trip-name', this.#tripData.name),
            this.#createColumn('trip-group', this.#getTripGroup()),
            this.#createColumn('trip-dates', this.#getTripDates())
        ];

        // Append columns to container
        columns.forEach(column => this.#container.appendChild(column));

        return this.#container;
    }

    #createColumn(className, content) {
        const column = document.createElement('div');
        column.classList.add('t-body__col', 'col', className);
        column.textContent = content;
        return column;
    }

    #getTripGroup() {
        return this.#tripData.companions 
            ? `${this.#tripData.traveler} + ${this.#tripData.companions}` 
            : this.#tripData.traveler;
    }

    #getTripDates() {
        return this.#tripData.from && this.#tripData.to 
            ? `${this.#formatDate(this.#tripData.from)} - ${this.#formatDate(this.#tripData.to)}` 
            : 'Dates Not Set';
    }

    #formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    get tripData() {
        return this.#tripData;
    }
}