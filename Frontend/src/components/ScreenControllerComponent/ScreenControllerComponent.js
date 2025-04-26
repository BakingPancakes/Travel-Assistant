import { EventHub } from "../../lib/eventhub/eventHub.js";
import { HomePageComponent } from "../HomePageComponents/HomePageComponent/HomePageComponent.js";
import { SidebarComponent } from "../SidebarComponent/SidebarComponent.js";

export class ScreenControllerComponent {
    #container = null;
    #currentView = 'home';
    #sidebarComponent = null;
    #homePageComponent = null;
    #hub = null;

    constructor() {
        this.#hub = EventHub.getInstance();
        // Component initialization here
        this.#sidebarComponent = new SidebarComponent();
        this.#homePageComponent = new HomePageComponent();
    }

    render() {
        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();

        this.#sidebarComponent.render();
        this.#homePageComponent.render();


        // Component rendering goes here

        this.#renderCurrentView();
        console.log("Screen Controller rendered")

        return this.#container;
    }

    // Create main container element
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('screen-controller');
    }

    // Set up the HTML structure for the container
    #setupContainerContent() {
        this.#container.innerHTML = `
        <div id="screen"></div>
        `
    }

    // Attach necessary event listeners
    #attachEventListeners() {
        this.#hub.subscribe('NewTrip', () => {
            this.#renderCurrentView();
        })
    }

    #renderCurrentView() {
        const screen = this.#container.querySelector('#screen');
        screen.innerHTML = ''; // Clear existing content
        screen.appendChild(this.#sidebarComponent.render());
        screen.appendChild(this.#homePageComponent.render());
    }
}