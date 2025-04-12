import { BaseComponent } from '../BaseComponent/BaseComponent';

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
            <button id="button-profile"><img id="profile--pic" src="..\..\assets\suitcase.jpg"></button>
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

        profileBtn.addEventListener("click", () => 
        this.#handleProfileClick()
        );

        homeBtn.addEventListener("click", () => 
        this.#handleHomeSwitch()
        );

        tripBtn.addEventListener("click", () => 
        this.#handleTripSwitch()
        );

        messageBtn.addEventListener("click", () => 
        this.#handleMsgSwitch()
        );

        calendarBtn.addEventListener("click", () => 
        this.#handleCalendarSwitch()
        );
    }

    #handleProfileClick() {
        throw new Error("Not yet implemented");
    }

    #handleHomeSwitch() {
        throw new Error("Not yet implemented");
    }

    #handleTripSwitch() {
        throw new Error("Not yet implemented");
    }

    #handleMsgSwitch() {
        throw new Error("Not yet implemented");
    }

    #handleCalendarSwitch() {
        throw new Error("Not yet implemented");
    }
}
