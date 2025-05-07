import { BaseComponent } from "../../BaseComponent/BaseComponent.js";

export class BudgetComponent extends BaseComponent {
    #container = null;

    constructor(budgetData = {}) {
        super();
        this.budgetData = budgetData;
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
        const budgetContent = this.#createBudgetContent();
        this.#container.appendChild(budgetContent);

        return this.#container;
    }

    // Private method to create content
    #createBudgetContent() {
        const budgetContent = document.createElement('span');
        // Need column for trip name, column for cost
    }
}