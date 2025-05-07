import { BaseComponent } from "../../BaseComponent/BaseComponent.js";

export class HPTripComponent extends BaseComponent {
    #container = null;

    constructor(tripData = {}) {
        super();
        this.tripData = tripData;
        this.loadCSS('HPTripComponent');
    }

    loadCSS(fileName) {
        if(this.cssLoaded) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // Dynamically load CSS from the same directory as the JS file
        link.href = `/Frontend/src/components/HomePageComponents/${fileName}/${fileName}.css`;
        document.head.appendChild(link);
        this.cssLoaded = true;
    }

    render() {
        // Create the main container
        this.#container = document.createElement('div');
        this.#container.classList.add('t-body__row', 'row');

        // Render the trip text
        const tripName = this.#createTripName();
        this.#container.appendChild(tripName);
        const tripGroup = this.#createTripGroup();
        this.#container.appendChild(tripGroup);
        const tripDate = this.#createTripDate();
        this.#container.appendChild(tripDate);
        console.log(`HPTripComponent ${tripName.innerHTML} created!`);
        return this.#container;
    }

    // Private method to create the content of the trip
    #createTripName() {
        const tripName = document.createElement('div');
        tripName.classList.add('col', 'tripName');
        tripName.innerHTML = this.tripData.name;
        console.log(this.tripData.name);
        return tripName;
        
    }

    #createTripGroup() {
        const tripGroup = document.createElement('div');
        tripGroup.classList.add('col', 'tripGroup');
        tripGroup.innerHTML = this.tripData.companions;
        return tripGroup;
    
    }

    #createTripDate() {
        const tripDate = document.createElement('div');
        tripDate.classList.add('col', 'tripDate');
        tripDate.innerHTML = this.tripData.to + '-' + this.tripData.from;
        return tripDate;
        
    }
}