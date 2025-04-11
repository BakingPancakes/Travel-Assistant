import { EventHub } from "../../lib/eventhub/eventHub";

export class ScreenControllerComponent {
    #container = null;
    #currentView = 'home';
    #hub = null;

    constructor() {
        this.#hub = EventHub.getInstance();
        // Component initialization here
    }

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
        this.#container.innerHTML = `
        <div id="screen"></div>
        `;
    }

    // Attach necessary event listeners
    #attachEventListeners() {
        throw new Error("Not yet implemented");
    }

    #renderCurrentView() {
        throw new Error("Not yet implemented");
    }
}