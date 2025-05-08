import { BaseComponent } from "../../BaseComponent/BaseComponent.js";
//import { EventHub } from "../../../lib/eventhub/eventHub.js";
//import { Events } from "../../../lib/eventhub/events.js";
import { HPTripComponent } from "../HPTripComponent/HPTripComponent.js";
import { BudgetComponent } from "../BudgetComponent/BudgetComponent.js";
import { TaskComponent } from "../TaskComponent/TaskComponent.js";

export class HomePageListComponent extends BaseComponent {
    #container = null;
    #type = null; // Private variable to determine whether it's a component for tasks, trips, or budgets
    #trips = null; // Get trip data in order to refresh lists

    constructor(type) {
        super();
        this.#type = type; // Either 'trip', 'task', or 'budget'
        this.loadCSS('HomePageListComponent');
        const savedTrips = localStorage.getItem('savedTrips');
        if (savedTrips) {
            this.#trips = JSON.parse(savedTrips);
        }
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
        if (this.#container) {
            return this.#container;
        }
        // Use type to determine what the header/footer should look like
        this.#createContainer();
        this.#setupContainerContent();
        //this.#attachEventListeners();

        return this.#container;
    }

    // Creates the container element and applies the necessary classes.
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('table');
        this.#container.id = this.#type + '-list';
    }

    #setupContainerContent() {
        // Initialize divs for header, body, and footer
        const header = document.createElement('div');
        header.classList.add('table__header');

        const body = document.createElement('div');
        body.classList.add('table__body');
        if(!this.#trips) {
            body.innerHTML = `No trips yet!`;
        }

        // No need for a footer if we have the trip list
        const footer = document.createElement('div');
        footer.classList.add('table__footer');
        

        switch (this.#type) {
            case 'trip':
            // Add header content
            header.innerHTML = `
                <div class="t-header__row row">
                    <div id="col--where" class="t-header__col col">Trip</div>
                    <div id="col--who" class="t-header__col col">Who's Going?</div>
                    <div id="col--when" class="t-header__col col">When?</div>
                </div>
            `;
            // No footer
            break;

            case 'task':
            // Add header Content
            header.innerHTML = `
                <div class="t-header__row row">
                    <div class="t-header__col col">To-Do's</div>
                </div>
                <div class="t-header__row row">
                    <div class="t-header__col col">Task</div>
                    <div class="t-header__col col">Trip</div>
                    <div class="t-header__col due col">Due</div>
                </div>
            `;
            // Add footer Content
            footer.innerHTML = `
                <div class="t-footer__row row">
                    <div class="t-footer__col col">Tasks Remaining:</div>
                    <div class="t-footer__col right-align col">0</div>
                </div>
            `
            break;

            case 'budget':
            // Add header Content
            header.innerHTML = `
                <div class="t-header__row row">
                    <div class="t-header__col col">Your Budgets</div>
                </div>
                <div class="t-header__row row">
                    <div class="t-header__col col">Trip</div>
                    <div class="t-header__col col--budget col">Budget</div>
                </div>
            `;
            // Add footer Content
            footer.innerHTML = `
                <div class="t-footer__row row">
                    <div class="t-footer__col col">Total:</div>
                    <div class="t-footer__col right-align col">$0</div>
                </div>
            `
            break;
        }

        // Append content to container
        this.#container.appendChild(header);
        this.#container.appendChild(body);
        if (this.#type !== 'trip') {
            this.#container.appendChild(footer);
            if(this.#type === 'task') {
                this.#refreshTaskList(this.#trips);
            } else if (this.#type === 'budget') {
                this.#refreshBudgetList(this.#trips);
            }
        } else {
            this.#refreshTripList(this.#trips);
        }
        
    }

    // #attachEventListeners() {
    //     const hub = EventHub.getInstance();

    //     // Depending on list type:
    //     switch (this.#type) {
    //         case 'trip':
    //             // Subscribe to trip updates
    //             hub.subscribe('trip_created', tripData => this.#addTripToList(tripData));
    //             hub.subscribe('trips_updated', tripData => this.#refreshTripList(tripData));
    //             break;
    //         case 'task':
    //             // Subscribe to task updates
    //             hub.subscribe('todo_data_updated', todoItems => this.#refreshTaskList(todoItems));
    //             break;
    //         case 'budget':
    //             // Subscribe to budget updates
    //             hub.subscribe('todo_data_updated', todoData => this.#refreshBudgetList(todoData));
    //     }
    // }

    #addTripToList(tripData) {
        const listBody = this.#getListBodyElement();
        const tripContainer = document.createElement('div');
        tripContainer.classList.add('t-body__row', 'row');

        // Create a new tripComponent for each task
        const trip = new HPTripComponent(tripData);
        tripContainer.appendChild(trip.render());
        listBody.appendChild(tripContainer);
    }

    #refreshTripList(tripData) {
        // Clear and re-render the trip list
        const listBody = this.#getListBodyElement();
        listBody.innerHTML = ``;
        
        // Validate the data structure before processing
        if (!tripData) {
            console.log("Invalid trip data format:", tripData);
            return;
        }
        // Sort trips by date
        const sortedData = tripData.sort((a,b) => {
            return new Date(b.from) - new Date(a.from);
        });
        
        // Only process if we have trips to display
        if (sortedData.length > 0) {
            sortedData.forEach((trip) => {
                const tripContainer = document.createElement('div');
                tripContainer.classList.add('t-body__row', 'row');
                const curTrip = new HPTripComponent(trip);
                tripContainer.appendChild(curTrip.render());
                listBody.appendChild(tripContainer);
            });
        }
    }

    #refreshTaskList(tripData) {
        // re-render task list
        const listBody = this.#getListBodyElement();
        listBody.innerHTML = ``;
        
        // Validate the data structure before processing
        if (!tripData) {
            console.log("Invalid trip data format:", tripData);
            return;
        }
        
        // Only process if we have trips to display
        if (tripData.length > 0) {
            let count = 0;
            tripData.forEach((trip) => {
                if (trip.todoItems.before.length > 0) {
                    trip.todoItems.before.forEach((task) => {
                        const taskContainer = document.createElement('div');
                        taskContainer.classList.add('t-body__row', 'row');
                        const curTask = new TaskComponent(trip, task, 'before');
                        taskContainer.appendChild(curTask.render());
                        listBody.appendChild(taskContainer);
                        count++; 
                    });
                }
                if (trip.todoItems.during.length > 0) {
                    trip.todoItems.during.forEach((task) => {
                        const taskContainer = document.createElement('div');
                        taskContainer.classList.add('t-body__row', 'row');
                        const curTask = new TaskComponent(trip, task, 'during');
                        taskContainer.appendChild(curTask.render());
                        listBody.appendChild(taskContainer);
                        count++; 
                    });
                }
                if (trip.todoItems.after.length > 0) {
                    trip.todoItems.after.forEach((task) => {
                        const taskContainer = document.createElement('div');
                        taskContainer.classList.add('t-body__row', 'row');
                        const curTask = new TaskComponent(trip, task, 'after');
                        taskContainer.appendChild(curTask.render());
                        listBody.appendChild(taskContainer);
                        count++; 
                    });
                }
            });
            // Determine how many tasks remain
            const remainder = this.#getListFooterCounter();
            remainder.innerHTML = count;

        }
    }

    // #addBudgetToList(tripData) {
    //     const listBody = this.#getListBodyElement();
    //     const budgetContainer = document.createElement('div');
    //     budgetContainer.classList.add('t-body__row row');

    //     //Create a new budgetComponent
    //     const budget = new BudgetComponent(tripData);
    //     budgetContainer.appendChild(budget.render());
    //     listBody.appendChild(budgetContainer);
    // }

    #refreshBudgetList(tripData) {
        // re-render budget list
        const listBody = this.#getListBodyElement();
        const listFooter = this.#getListFooterCounter();

        // Validate the data structure before processing
        if (!tripData) {
            console.log("Invalid trip data format:", tripData);
            return;
        }

        if(tripData.length > 0) {
            let total = 0;
            tripData.forEach((trip) => {
                const budgetContainer = document.createElement('div');
                budgetContainer.classList.add('t-body__row', 'row');
                const budget = new BudgetComponent(trip);
                budgetContainer.appendChild(budget.render());
                listBody.appendChild(budgetContainer);
                total += trip.budget;
            });
            listFooter.innerHTML = `$${total}`;
        }
    }

    #getListBodyElement() {
        return this.#container.querySelector('.table__body');
    }

    #getListFooterCounter() {
        return this.#container.querySelector('.right-align');
    }
}