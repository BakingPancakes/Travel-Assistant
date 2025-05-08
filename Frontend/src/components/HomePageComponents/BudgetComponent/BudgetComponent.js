import { BaseComponent } from "../../BaseComponent/BaseComponent.js";

export class BudgetComponent extends BaseComponent {
    #container = null;

    constructor(tripData = {}) {
        super();
        this.tripData = tripData;
        this.loadCSS('BudgetComponent');
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
        // Create main container
        this.#container = document.createElement('div');
        this.#container.classList.add('t-body__row', 'row');

        // Render the budget content
        const tripName = this.#getTripName();
        const budgetContent = this.#getBudget();
        this.#container.appendChild(tripName);
        this.#container.appendChild(budgetContent);

        return this.#container;
    }

    // Private methods to create content
    #getTripName() {
        const tripName = document.createElement('div');
        tripName.classList.add('col');
        tripName.innerHTML = this.tripData.name;
        return tripName;
    }

    #getBudget() {
        const budget = document.createElement('div');
        budget.classList.add('col', 'col--budget');
        budget.innerHTML = `$${this.tripData.budget}`;
        return budget;
    }
}