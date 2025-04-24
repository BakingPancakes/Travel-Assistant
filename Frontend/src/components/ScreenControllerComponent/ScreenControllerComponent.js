import { EventHub } from "../../lib/eventhub/eventHub.js";
import { HomePageComponent } from "../HomePageComponent/HomePageComponent.js";
import { SidebarComponent } from "../SidebarComponent/SidebarComponent.js";

export class ScreenControllerComponent {
    #container = null;
    #currentView = 'home';
    #hub = null;

    constructor() {
        this.#hub = EventHub.getInstance();
        // Component initialization here
    }
kk
    render() {
        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();

        // Component rendering goes here

        this.#renderCurrentView();

        return this.#container;
    }

    // Create main container element
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('screen-container');
    }

    // Set up the HTML structure for the container
    #setupContainerContent() {
        const sidebar = new SidebarComponent();
        const homepage = new HomePageComponent();
        this.#container.appendChild(sidebar.render());
        this.#container.appendChild(homepage.render());
    }

    // Attach necessary event listeners
    #attachEventListeners() {
        throw new Error("Not yet implemented");
    }

    #renderCurrentView() {
        throw new Error("Not yet implemented");
    }
}