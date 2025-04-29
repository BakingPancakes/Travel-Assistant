import { EventHub } from "../../lib/eventhub/eventHub.js";
import { HomePageComponent } from "../HomePageComponents/HomePageComponent/HomePageComponent.js";
import { SidebarComponent } from "../SidebarComponent/SidebarComponent.js";
import { TripPageComponent } from "../TripPageComponents/TripPageComponent/TripPageComponent.js";
import { MessagePageComponent } from "../MessagePageComponents/MessagesPageComponent/MessagePageComponent.js";

export class ScreenControllerComponent {
    #container = null;
    #currentView = 'home';
    #sidebarComponent = null;
    #viewPageComponent = null;
    #hub = null;

    constructor() {
        this.#hub = EventHub.getInstance();
        // Component initialization here
        this.#sidebarComponent = new SidebarComponent();
        this.#viewPageComponent = new HomePageComponent();
    }

    render() {
        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();

        this.#sidebarComponent.render();
        this.#viewPageComponent.render();


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
        });

        this.#hub.subscribe('SwitchToHomePage', () => {
            this.#currentView = 'home';
            this.#renderCurrentView();
        });

        this.#hub.subscribe('SwitchToTripPage', () => {
            this.#currentView = 'trip';
            this.#renderCurrentView();
        });

        this.#hub.subscribe('SwitchToMessagePage', () => {
            this.#currentView = 'message';
            this.#renderCurrentView();
        })
    }

    #renderCurrentView() {
        const screen = this.#container.querySelector('#screen');
        screen.innerHTML = ''; // Clear existing content
        screen.appendChild(this.#sidebarComponent.render());
        switch(this.#currentView) {
            case 'home':
                this.#viewPageComponent = new HomePageComponent();
                break;
            case 'trip':
                this.#viewPageComponent = new TripPageComponent();
                break;
            case 'message':
                this.#viewPageComponent = new MessagePageComponent();
                break;
        }
        screen.appendChild(this.#viewPageComponent.render());
    }
}