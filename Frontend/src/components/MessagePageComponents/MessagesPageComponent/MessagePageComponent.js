import { ChatListComponent } from "../ChatListComponent/ChatListComponent.js";
import { ChatDisplayComponent } from "../ChatDisplayComponent/ChatDisplayComponent.js";
import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
import { EventHub } from "../../../lib/eventhub/eventHub.js";

export class MessagePageComponent extends BaseComponent {
    #container = null;
    #hub = null;
    #ChatListComponent = null;
    #ChatDisplayComponent = null;

    constructor() {
        super();
        this.#hub = EventHub.getInstance();
        // this.loadCSS("ChatPageComponent");
    }
    
    render() {
        if (this.#container) {
            return this.#container;
        }
        this.#createContainerAndSetupContents();
        this.#attachEventListeners();

        return this.#container
    }
    
    #createContainerAndSetupContents() {
        this.#container = document.createElement('div');
        this.#container.id = 'messages-page';


        this.#ChatListComponent = new ChatListComponent();
        this.#ChatDisplayComponent = new ChatDisplayComponent();

        this.#container.innHTML += this.#ChatListComponent.render();
        this.#container.innerHTML += this.#ChatDisplayComponent.render();
    }

    #attachEventListeners() {
    }
}