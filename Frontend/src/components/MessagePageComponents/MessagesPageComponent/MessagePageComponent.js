import { ChatListComponent } from "../ChatListComponent/ChatListComponent.js";
import { ChatDisplayComponent } from "../ChatDisplayComponent/ChatDisplayComponent.js";
import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
import { EventHub } from "../../../lib/eventhub/eventHub.js";

export class MessagePageComponent extends BaseComponent {
    #container = null;
    #hub = EventHub.getInstance();
    #ChatListComponent = null;
    #ChatDisplayComponent = null;

    constructor() {
        super();
        this.loadCSS("ChatPageComponent");
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
        this.#container.id = 'messages-pages';


        this.#ChatListComponent = new ChatDisplayComponent();
        this.#ChatDisplayComponent = new ChatDisplayComponent();

        this.#container.innHTML += ChatListComponent.render();
        this.#container.innerHTML += ChatDisplayComponent.render();
    }

    #attachEventListeners() {
    }
}