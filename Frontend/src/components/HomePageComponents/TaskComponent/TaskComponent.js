import { BaseComponent } from "../../BaseComponent/BaseComponent.js";

export class TaskComponent extends BaseComponent {
    #container = null;

    constructor(trip = {}, task = '', when) {
        super();
        this.trip = trip;
        this.taskData = task;
        this.when = when;
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
        const task = this.#createTask();
        this.#container.appendChild(task);
        const taskTrip = this.#createTaskTrip();
        this.#container.appendChild(taskTrip);
        const taskDue = this.#createTaskDue();
        this.#container.appendChild(taskDue);

        return this.#container;
    }

    // Private methods for creating task content
    #createTask() {
        // Create column with task
        const taskDesc = document.createElement('div');
        taskDesc.classList.add('col');
        taskDesc.innerHTML = this.taskData;
        return taskDesc;
    }

    #createTaskTrip() {
        // Create column with the name of the trip
        const taskTrip = document.createElement('div');
        taskTrip.classList.add('col');
        taskTrip.innerHTML = this.trip.name;
        return taskTrip;
    }

    #createTaskDue() {
        // Create column with the due date
        const taskDue = document.createElement('div');
        taskDue.classList.add('col', 'due');
        const beforeDate = new Date(this.trip.from);
        const afterDate = new Date(this.trip.to);
        let beforeFormatted = "";
        const afterFormatted = afterDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        switch(this.when) {
            case 'before':
                beforeFormatted = beforeDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
                taskDue.innerHTML = `Before ${beforeFormatted}`;
            break;

            case 'during':
                beforeFormatted = beforeDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                taskDue.innerHTML = `Between ${beforeFormatted} and ${afterFormatted}`;
            break;

            case 'after':
                taskDue.innerHTML = `After ${afterFormatted}`;
            break;
        }
        return taskDue;
    }
}