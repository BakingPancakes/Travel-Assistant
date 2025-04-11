import { BaseComponent } from "../BaseComponent/BaseComponent";
import { EventHub } from "../../lib/eventhub/eventHub";
import { Events } from "../../lib/eventhub/eventHub";

export class HomePageComponent extends BaseComponent {
    #container = null; // Private container variable
    #trips = []; // Store trip data
    #profile = {}; // Store profile data
    #tasks = []; // Store task data
    #budgets = []; // Store budget data

    constructor() {
        super();
        this.loadCSS('HomePageComponent');
    }

    // Method to render the component and return the container
    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();

        return this.#container;
    }

    // Methods to set the lists of trips, profile object, tasks, and budgets to display
    setTrips(trips) {
        this.#trips = trips;
        this.#renderTrips();
    }

    setProfile(profile) {
        this.#profile = profile;
        this.#renderProfile();
    }

    setTasks(tasks) {
        this.#tasks = tasks;
        this.#renderTasks();
    }

    setBudgets(budgets) {
        this.#budgets = budgets;
    }

    // Create container element for component
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('home-page-component');
    }

    // Set up basic HTML structure of homepage
    #setupContainerContent() {
        this.#container.innerHTML = `
        
        `;
    }

    #renderTrips() {
        const tripList = this.#container.querySelector('#trip-List');
        tripList.innerHTML = ''; // Clear existing content

        this.#trips.forEach(tripData => {
            const tripContainer = document.createElement('div');
            tripContainer.classList.add('t-body__row');

            // Create a new TripComponent for each trip
            // const trip = new TripComponent(tripData);
            // tripContainer.appendChild(trip.render());
            // tripList.appendChild(tripContainer);
        });
    }

    #renderTasks() {
        throw new Error("Not yet implemented");
    }

    #renderProfile() {
        throw new Error("Not yet implemented");
    }

    #attachEventListeners() {
        throw new Error("Not yet implemented");
    }
}