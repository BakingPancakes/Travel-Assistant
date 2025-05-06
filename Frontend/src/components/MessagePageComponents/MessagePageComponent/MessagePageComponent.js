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
        this.loadCSS("MessagePageComponent");
    }
    
    render() {
        if (this.#container) {
            return this.#container;
        }
        this.#createContainerAndSetupContents();
        this.#attachEventListeners();

        return this.#container
    }

    loadCSS(fileName) {
        if(this.cssLoaded) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // Dynamically load CSS from the same directory as the JS file
        link.href = `/Frontend/src/components/MessagePageComponents/${fileName}/${fileName}.css`;
        document.head.appendChild(link);
        this.cssLoaded = true;
    }
    
    #createContainerAndSetupContents() {
        this.#container = document.createElement('div');
        this.#container.id = 'messages-page';


        this.#ChatListComponent = new ChatListComponent();
        this.#ChatDisplayComponent = new ChatDisplayComponent();

        this.#container.appendChild(this.#ChatListComponent.render());
        this.#container.appendChild(this.#ChatDisplayComponent.render());
    }

    #attachEventListeners() {
    }
}