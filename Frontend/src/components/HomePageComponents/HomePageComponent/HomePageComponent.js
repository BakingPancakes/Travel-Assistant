import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
import { TripSimpleInputComponent } from "../TripSimpleInputComponent/TripSimpleInputComponent.js";

export class HomePageComponent extends BaseComponent {
    #container = null; // Private container variable
    #tripInputComponent = null; // instance of trip simple input
    #trips = []; // Store trip data
    #profile = {}; // Store profile data
    #tasks = []; // Store task data
    #budgets = []; // Store budget data

    constructor() {
        super();
        this.loadCSS('HomePageComponent');
        this.#tripInputComponent = new TripSimpleInputComponent();
    }

    // Method to render the component and return the container
    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();
        console.log("HomePage Rendered");
        return this.#container;
    }

    loadCSS(fileName) {
        if(this.cssLoaded) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // Dynamically load CSS from the same directory as the JS file
        link.href = `./components/HomePageComponents/${fileName}/${fileName}.css`;
        document.head.appendChild(link);
        this.cssLoaded = true;
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
        this.#container.classList.add('homepage-container');
    }

    // Set up basic HTML structure of homepage
    #setupContainerContent() {
        this.#container.innerHTML = `
        <div class="screen__header">
                <!--Title, Notification button, New Trip Button (All on same line)-->
                <span class="header__welcome-banner">Welcome back!</span>
                <button id="header__button--notification">
                    <img id="bell" src=".../../assets/notification.png" alt="Notifications">
                    <span class="notification-badge">!</span>
                </button>
                <button id="header__button--new-trip">New Trip</button>
            </div> 
            <!--Header End-->
    
            <div class="screen__main-content">
                <!--Contains: Trip List, Task List, Budget List-->
                <div id="trip-list" class="table">
                    <div class="table__header">
                        <div class="t-header__row row">
                            <div id="col--where" class="t-header__col col">Trip</div>
                            <div id="col--who" class="t-header__col col">Who's Going?</div>
                            <div id="col--when" class="t-header__col col">When?</div>
                        </div>
                    </div>
                    <div class="table__body">
                        <div class="t-body__row row">
                            <div class="col"> some trip</div>
                            <div class="col"> solo</div>
                            <div class="col"> some date</div>
                        </div>
                    </div>
                </div>

                <div id="task-list" class="table">
                    <div class="table__header">
                        <div class="t-header__row row">
                            <div class="t-header__col col">To-Do's</div>
                        </div>
                        <div class="t-header__row row">
                            <div class="t-header__col col">Task</div>
                            <div class="t-header__col col">Trip</div>
                            <div class="t-header__col due col">Due</div>
                        </div>
                    </div>
                    <div class="table__body">
                        <div class="t-body__row row">
                            <div class="col"> some task</div>
                            <div class="col"> some trip</div>
                            <div class="due col"> some date</div>
                        </div>
                    </div>
                    <div class="table__footer">
                        <div class="t-footer__row row">
                            <div class="t-footer__col col">Tasks Remaining:</div>
                            <div class="t-footer__col right-align col">--</div>
                        </div>
                    </div>
                </div>
    
                <div id="budget-list" class="table">
                    <div class="table__header">
                        <div class="t-header__row row">
                            <div class="t-header__col col">Your Budgets</div>
                        </div>
                        <div class="t-header__row row">
                            <div class="t-header__col col">Trip</div>
                            <div class="t-header__col col--budget col">Budget</div>
                        </div>
                    </div>
                    <div class="table__body">
                        <div class="t-body__row row">
                            <div class="col"> some trip</div>
                            <div class="col col--budget"> some cost</div>
                        </div>
                    </div>
                    <div class="table__footer">
                        <div class="t-footer__row row">
                            <div class="t-footer__col col">Total:</div>
                            <div class="t-footer__col right-align col">$$$</div>
                        </div>
                    </div>
                </div>
            </div>
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
        const newTripBtn = this.#container.querySelector("#header__button--new-trip");

        // Attach listener to new page button
        newTripBtn.addEventListener('click', () => {
            this.#newTrip();
        });
        // Subscribe to eventHub events
    }

    #newTrip() {
        this.#container.appendChild(this.#tripInputComponent.render());
    }
}