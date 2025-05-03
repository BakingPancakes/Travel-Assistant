import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { EventHub } from "../../lib/eventhub/eventHub.js";
import { Events } from "../../lib/eventhub/Events.js";

export class SidebarComponent extends BaseComponent {
    #container = null;

    constructor() {
        super();
        this.loadCSS('SidebarComponent'); 
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();
        console.log("Sidebar rendered");
        return this.#container;
    }

    // Creates the container element for the component
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('screen__sidebar');
    }

    #setupContainerContent() {
        this.#container.innerHTML = `
            <div id="profile-div">
            <button id="button-profile"><img id="profile--pic" src=".../../assets/suitcase.jpg"></button>
            </div>
            <button id="button-home" class="sidebar__button">Home</button>
            <button id="button-trips" class="sidebar__button">Trips</button>
            <button id="button-messages" class="sidebar__button">Messages</button>
            <button id="button-calendar" class="sidebar__button">Calendar</button>
        `;
    }

    // Attach the event listeners to the component
    #attachEventListeners() {
        const profileBtn = this.#container.querySelector('#button-profile');
        const homeBtn = this.#container.querySelector('#button-home');
        const tripBtn = this.#container.querySelector('#button-trips');
        const messageBtn = this.#container.querySelector('#button-messages');
        const calendarBtn = this.#container.querySelector('#button-calendar');

        const hub = EventHub.getInstance();
        profileBtn.addEventListener("click", () => 
            console.log("We'll get back to this...")
        );

        homeBtn.addEventListener("click", () => 
            hub.publish(Events.SwitchToHomePage, null)
        );

        tripBtn.addEventListener("click", () => 
            hub.publish(Events.SwitchToTripPage, null)
        );

        messageBtn.addEventListener("click", () => 
            hub.publish(Events.SwitchToMessagePage, null)
        );

        calendarBtn.addEventListener("click", () => 
            console.log("Not implemented :(")
        );
    }
}
