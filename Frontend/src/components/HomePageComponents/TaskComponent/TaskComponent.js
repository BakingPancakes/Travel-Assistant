import { BaseComponent } from "../../BaseComponent/BaseComponent.js";

export class TaskComponent extends BaseComponent {
    #container = null;

    constructor(taskData = {}) {
        super();
        this.taskData = taskData;
        this.loadCSS('TaskComponent');
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

        // Render the task content
        const taskName = this.#createTaskName();
        this.#container.appendChild(taskName);
        const taskTrip = this.#createTaskTrip();
        this.#container.appendChild(taskTrip);
        const taskDue = this.#createTaskDue();
        this.#container.appendChild(taskDue);

        return this.#container;
    }

    // Private methods for creating task content
    #createTaskName() {
        // Create column with task name
    }

    #createTaskTrip() {
        // Create column with the name of the trip
    }

    #createTaskDue() {
        // Create column with the due date
    }
}