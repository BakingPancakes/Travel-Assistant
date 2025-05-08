import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
import { TripSimpleInputComponent } from "../TripSimpleInputComponent/TripSimpleInputComponent.js";
import { EventHub } from "../../../lib/eventhub/eventHub.js";
import { Events } from "../../../lib/eventhub/events.js";
import { HomePageListComponent } from "../HomePageListComponent/HomePageListComponent.js";

export class HomePageComponent extends BaseComponent {
    #container = null; // Private container variable
    #tripInputComponent = null; // instance of trip simple input

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
            </div>
        `;
        const mainContent = this.#container.querySelector('.screen__main-content');
        const tripList = new HomePageListComponent('trip');
        const taskList = new HomePageListComponent('task');
        const budgetList = new HomePageListComponent('budget');
        mainContent.appendChild(tripList.render());
        mainContent.appendChild(taskList.render());
        mainContent.appendChild(budgetList.render());
    }

    #attachEventListeners() {
        const hub = EventHub.getInstance();

        const newTripBtn = this.#container.querySelector("#header__button--new-trip");

        // Attach listener to new page button
        newTripBtn.addEventListener('click', () => {
            hub.publish(Events.SwitchToTripPage, null);
        });
        // Subscribe to eventHub events
        hub.subscribe('trip_created', tripData => this.#newTrip(tripData));

    }

    #newTrip() {
        this.#container.appendChild(this.#tripInputComponent.render());
    }
}