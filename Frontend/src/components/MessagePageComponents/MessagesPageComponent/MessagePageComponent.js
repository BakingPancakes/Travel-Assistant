import { ChatListComponent } from "../ChatListComponent/ChatListComponent";
import { ChatDisplayComponent } from "../ChatDisplayComponent/ChatDisplayComponent";
import { BaseComponent } from "../../BaseComponent/BaseComponent";
import { EventHub } from "../../../lib/eventhub/eventHub";

class MessagePageComponent extends BaseComponent {
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