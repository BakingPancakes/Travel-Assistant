import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../lib/eventhub/eventHub.js";
import { Events } from "../../lib/eventhub/events.js";

export class TripPageComponent extends BaseComponent {
    #container = null;
    #currentView = 'trips-view';
    #tripData = {};
    #hub = null;

    constructor() {
        super();
        this.loadCSS('TripPageComponent');
        this.#hub = EventHub.getInstance();
        
        // Set up event subscriptions
        this.#subscribeToEvents();
    }

    // Method for setting up event subscriptions
    #subscribeToEvents() {
        this.#hub.subscribe(Events.LoadTripsSuccess, (data) => {
            this.#tripData = data;
            this.#updateTripDisplay();
        });
        
        this.#hub.subscribe(Events.StoreTripSuccess, (data) => {
            console.log('Trip saved successfully:', data);
            // Update UI after saving successfully
            this.#loadTripData();
        });
        
        this.#hub.subscribe(Events.StoreTripFailure, (error) => {
            console.error('Failed to save trip:', error);
            alert('Failed to save trip information.');
        });
        
        // Subscribe to todo-related events
        this.#hub.subscribe(Events.LoadTodosSuccess, (data) => {
            this.#updateTodoDisplay(data.todos);
        });
        
        this.#hub.subscribe(Events.StoreTodoSuccess, () => {
            // Refresh todo list after saving successfully
            const currentTrip = this.#getCurrentTripId();
            if (currentTrip) {
                this.#hub.publish(Events.LoadTodos, currentTrip);
            }
        });
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        // Create container and set up content
        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();
        
        // Load initial data
        this.#loadTripData();
        this.#initializeTodoSections();
        
        return this.#container;
    }

    // Create container element
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('app-container');
    }

    // Set up container content
    #setupContainerContent() {
        this.#container.innerHTML = `
            <!-- Sidebar -->
            <div class="sidebar">
                <button class="sidebar-item" data-view="profile-view">Profile</button>
                <button class="sidebar-item" data-view="home-view">Home</button>
                <button class="sidebar-item" data-view="trips-view">Trip List</button>
                <button class="sidebar-item" data-view="messages-view">Messages</button>
                <button class="sidebar-item" data-view="calendar-view">Calendar</button>
            </div>

            <!-- Main Content - View Container -->
            <div id="views" class="main_content">
                <!-- Profile View -->
                <div id="profile-view" class="view" style="display: none;">
                    <h1>Profile Page</h1>
                    <p>This page shows user profile information.</p>
                    <div class="profile-content">
                        <div class="profile-image">
                            <img src="../../assets/suitcase.jpg" alt="Profile Image">
                        </div>
                        <div class="profile-info">
                            <h2>User Information</h2>
                            <p><strong>Name:</strong> Traveler</p>
                            <p><strong>Email:</strong> traveler@example.com</p>
                            <p><strong>Join Date:</strong> January 1, 2023</p>
                        </div>
                    </div>
                </div>

                <!-- Home View -->
                <div id="home-view" class="view" style="display: none;">
                    <h1>Home Page</h1>
                    <p>Welcome to the Travel Assistant App!</p>
                    <div class="home-content">
                        <h2>Recent Trips</h2>
                        <div class="recent-trips">
                            <p>Recent trips will be shown here.</p>
                        </div>
                        <h2>Upcoming Events</h2>
                        <div class="upcoming-events">
                            <p>Upcoming events will be shown here.</p>
                        </div>
                    </div>
                </div>

                <!-- Trip Details View -->
                <div id="trips-view" class="view">
                    <h1>Trip Details</h1>
                    <div class="section-header">
                        <span>🔔</span>
                        <button id="editTripButton">Edit Trip Info</button>
                    </div>
                    <!-- Traveler Information -->
                    <div class="form-group">
                        <label for="location">Destination</label>
                        <input type="text" id="location" name="location" placeholder="Enter your destination" required />
                    </div>
                    <div class="form-group">
                        <label for="traveler">Traveler</label>
                        <input type="text" id="traveler" name="traveler" placeholder="Enter traveler name" required />
                    </div>
                    <div class="form-group">
                        <label for="companions">Companions</label>
                        <input type="text" id="companions" name="companions" placeholder="Enter companion names" />
                    </div>
                    <div class="form-group">
                        <label for="from">Departure Date</label>
                        <input type="date" id="from" name="from" required />
                    </div>
                    <div class="form-group">
                        <label for="to">Return Date</label>
                        <input type="date" id="to" name="to" required />
                    </div>
                    <button type="button" id="submitTrip">Save Trip Info</button>

                    <!-- Accommodation Information -->
                    <div class="accommodation-section">
                        <div class="section-header">
                            <h2>Accommodation Information</h2>
                            <button class="edit-button">Edit</button>
                        </div>
                        <p>Accommodation: <span id="accommodation-name">[Accommodation Name]</span></p>
                        <p>Address: <span id="accommodation-address">[Accommodation Address]</span></p>
                    </div>

                    <!-- Companion Accommodation Information -->
                    <div class="companion-accommodation">
                        <h2>Companion Accommodation Information</h2>
                        <div id="companion-accommodation-list"></div>
                    </div>

                    <!-- Itinerary Information -->
                    <div class="itinerary-section">
                        <h2>Itinerary Information</h2>
                        <div class="day-container">
                            <h3>Day 1</h3>
                            <div class="activity">
                                <span>First Activity</span>
                                <span>👤</span>
                            </div>
                            <div class="activity">
                                <span>Second Activity</span>
                                <span>👤</span>
                            </div>
                        </div>
                        
                        <div class="day-container">
                            <h3>Day 2</h3>
                            <div class="activity">
                                <span>Third Activity</span>
                                <span>👤</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Messages View -->
                <div id="messages-view" class="view" style="display: none;">
                    <h1>Messages Page</h1>
                    <div class="message-list">
                        <div class="message-item">
                            <div class="message-sender">Travel Companion</div>
                            <div class="message-content">Hello! How are your travel preparations going?</div>
                            <div class="message-time">10:30 AM</div>
                        </div>
                        <div class="message-item">
                            <div class="message-sender">Travel Agency</div>
                            <div class="message-content">Your reservation is confirmed.</div>
                            <div class="message-time">Yesterday</div>
                        </div>
                    </div>
                </div>

                <!-- Calendar View -->
                <div id="calendar-view" class="view" style="display: none;">
                    <h1>Calendar Page</h1>
                    <div class="calendar-container">
                        <div class="calendar-header">
                            <button class="prev-month">Previous</button>
                            <h2 id="current-month">May 2023</h2>
                            <button class="next-month">Next</button>
                        </div>
                        <div class="calendar-grid">
                            <!-- Calendar will be displayed here -->
                            <p>Calendar is under development.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- To-Do Section -->
            <div class="todo-container">
                <h2>To-Do List</h2>

                <!-- Before Trip To-Dos -->
                <div class="todo-section" data-section="Before Trip">
                    <h3>Before Trip</h3>
                    <div class="item-container">
                        <input type="text" placeholder="Enter a task">
                        <button class="add-todo-btn">Add</button>
                    </div>
                    <ol class="todo-list"></ol>
                </div>

                <!-- During Trip To-Dos -->
                <div class="todo-section" data-section="During Trip">
                    <h3>During Trip</h3>
                    <div class="item-container">
                        <input type="text" placeholder="Enter a task">
                        <button class="add-todo-btn">Add</button>
                    </div>
                    <ol class="todo-list"></ol>
                </div>

                <!-- After Trip To-Dos -->
                <div class="todo-section" data-section="After Trip">
                    <h3>After Trip</h3>
                    <div class="item-container">
                        <input type="text" placeholder="Enter a task">
                        <button class="add-todo-btn">Add</button>
                    </div>
                    <ol class="todo-list"></ol>
                </div>
            </div>
        `;
    }

    // Add event listeners
    #attachEventListeners() {
        // Navigation events
        const navItems = this.#container.querySelectorAll('.sidebar-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const viewId = item.getAttribute('data-view');
                this.#navigate(viewId);
                this.#highlightActiveNavItem(item);
            });
        });

        // Trip form events
        const submitButton = this.#container.querySelector('#submitTrip');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.#saveTripData();
            });
        }
        
        const editButton = this.#container.querySelector('#editTripButton');
        if (editButton) {
            editButton.addEventListener('click', () => {
                this.#enableTripEdit();
            });
        }

        // Show default view
        this.#navigate(this.#currentView);
        const defaultNavItem = this.#container.querySelector(`[data-view="${this.#currentView}"]`);
        if (defaultNavItem) {
            this.#highlightActiveNavItem(defaultNavItem);
        }
    }

    // Navigation methods
    #navigate(viewId) {
        const allViews = this.#container.querySelectorAll('.view');
        allViews.forEach(view => {
            view.style.display = 'none';
        });
        
        const selectedView = this.#container.querySelector(`#${viewId}`);
        if (selectedView) {
            selectedView.style.display = 'block';
            this.#currentView = viewId;
        }
    }

    // Highlight active navigation item
    #highlightActiveNavItem(activeItem) {
        const navItems = this.#container.querySelectorAll('.sidebar-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        activeItem.classList.add('active');
    }

    // Trip data management
    #saveTripData() {
        const locationInput = this.#container.querySelector('#location');
        const travelerInput = this.#container.querySelector('#traveler');
        const companionsInput = this.#container.querySelector('#companions');
        const fromInput = this.#container.querySelector('#from');
        const toInput = this.#container.querySelector('#to');
        
        // Check required fields
        if (!locationInput.value || !travelerInput.value || !fromInput.value || !toInput.value) {
            alert('Destination, traveler, departure date, and return date are required.');
            return;
        }
        
        const travelerData = {
            location: locationInput.value,
            traveler: travelerInput.value,
            companions: companionsInput.value || '',
            from: fromInput.value,
            to: toInput.value,
            id: this.#getCurrentTripId() || null // Use existing ID if available, otherwise null (server will create)
        };
        
        // Save to localStorage (as backup)
        localStorage.setItem('tripData', JSON.stringify(travelerData));
        
        // Request to save to server through event
        this.#hub.publish(Events.StoreTrip, travelerData);
        
        // Update UI
        this.#displayTripData();
    }

    #loadTripData() {
        // Request data from server
        this.#hub.publish(Events.LoadTrips);
        
        // Load temporary data from localStorage (backup)
        const savedData = localStorage.getItem('tripData');
        
        if (savedData) {
            const travelerData = JSON.parse(savedData);
            
            const locationInput = this.#container.querySelector('#location');
            const travelerInput = this.#container.querySelector('#traveler');
            const companionsInput = this.#container.querySelector('#companions');
            const fromInput = this.#container.querySelector('#from');
            const toInput = this.#container.querySelector('#to');
            
            if (locationInput) locationInput.value = travelerData.location || '';
            if (travelerInput) travelerInput.value = travelerData.traveler || '';
            if (companionsInput) companionsInput.value = travelerData.companions || '';
            if (fromInput) fromInput.value = travelerData.from || '';
            if (toInput) toInput.value = travelerData.to || '';
            
            this.#displayTripData();
        }
    }

    #displayTripData() {
        const formGroups = this.#container.querySelectorAll('.form-group');
        const submitButton = this.#container.querySelector('#submitTrip');
        
        formGroups.forEach(group => {
            const label = group.querySelector('label');
            const input = group.querySelector('input');
            
            if (label && input) {
                const fieldName = label.textContent;
                
                let displayText = group.querySelector('.display-text');
                if (!displayText) {
                    displayText = document.createElement('p');
                    displayText.className = 'display-text';
                    group.appendChild(displayText);
                }
                
                displayText.textContent = `${fieldName}: ${input.value}`;
                input.style.display = 'none';
            }
        });
        
        if (submitButton) {
            submitButton.style.display = 'none';
        }
        
        const editButton = this.#container.querySelector('#editTripButton');
        if (editButton) {
            editButton.style.display = 'inline-block';
        }
    }

    #enableTripEdit() {
        const formGroups = this.#container.querySelectorAll('.form-group');
        const submitButton = this.#container.querySelector('#submitTrip');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input');
            const displayText = group.querySelector('.display-text');
            
            if (displayText) {
                displayText.style.display = 'none';
            }
            
            if (input) {
                input.style.display = 'block';
            }
        });
        
        if (submitButton) {
            submitButton.style.display = 'inline-block';
        }
        
        const editButton = this.#container.querySelector('#editTripButton');
        if (editButton) {
            editButton.style.display = 'none';
        }
    }

    // Todo functionality
    #initializeTodoSections() {
        const todoSections = this.#container.querySelectorAll('.todo-section');
        
        todoSections.forEach(section => {
            // Add event listeners to buttons
            const addButton = section.querySelector('.add-todo-btn');
            if (addButton) {
                addButton.addEventListener('click', () => {
                    this.#addTodo(section);
                });
            }

            // Add enter key event listener to input field
            const todoInput = section.querySelector('input[type="text"]');
            if (todoInput) {
                todoInput.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        this.#addTodo(section);
                    }
                });
            }
            
            // Load saved todos for this section
            this.#loadTodos(section);
        });
    }

    #addTodo(section) {
        const todoInput = section.querySelector('input[type="text"]');
        const todoList = section.querySelector('.todo-list');
        
        if (todoInput && todoList) {
            const todoValue = todoInput.value.trim();
            
            if (todoValue) {
                // Get current trip ID
                const tripId = this.#getCurrentTripId();
                
                if (!tripId) {
                    alert('Please save trip information first.');
                    return;
                }
                
                // Request to save todo to server
                const sectionName = section.getAttribute('data-section');
                this.#hub.publish(Events.StoreTodo, {
                    tripId: tripId,
                    section: sectionName,
                    text: todoValue
                });
                
                todoInput.value = "";
            }
        }
    }

    #loadTodos(section) {
        // Get current trip ID
        const tripId = this.#getCurrentTripId();
        
        if (tripId) {
            // Request todo list from server
            this.#hub.publish(Events.LoadTodos, tripId);
        }
    }

    #updateTodoDisplay(todos) {
        if (!todos || !Array.isArray(todos)) return;
        
        // Group todos by section
        const todosBySection = {
            'Before Trip': [],
            'During Trip': [],
            'After Trip': []
        };
        
        todos.forEach(todo => {
            if (todosBySection[todo.section]) {
                todosBySection[todo.section].push(todo);
            }
        });
        
        // Update todo list for each section
        Object.keys(todosBySection).forEach(sectionName => {
            const section = this.#container.querySelector(`.todo-section[data-section="${sectionName}"]`);
            if (section) {
                const todoList = section.querySelector('.todo-list');
                if (todoList) {
                    // Clear existing list
                    todoList.innerHTML = '';
                    
                    // Add new todos
                    todosBySection[sectionName].forEach(todo => {
                        const li = document.createElement('li');
                        li.classList.add('todo-item');
                        
                        const todoText = document.createElement('span');
                        todoText.textContent = todo.text;
                        
                        if (todo.completed) {
                            todoText.style.textDecoration = 'line-through';
                            todoText.style.color = '#999';
                        }
                        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.classList.add('delete-btn');
                        deleteBtn.addEventListener('click', () => {
                            // Request to delete from server
                            this.#hub.publish(Events.DeleteTodo, {
                                tripId: this.#getCurrentTripId(),
                                todoId: todo.id
                            });
                        });
                        
                        const completeCheck = document.createElement('input');
                        completeCheck.type = 'checkbox';
                        completeCheck.classList.add('complete-check');
                        completeCheck.checked = todo.completed;
                        completeCheck.addEventListener('change', () => {
                            // Request to update status on server
                            this.#hub.publish(Events.UpdateTodo, {
                                tripId: this.#getCurrentTripId(),
                                todoId: todo.id,
                                completed: completeCheck.checked
                            });
                            
                            // Update UI
                            if (completeCheck.checked) {
                                todoText.style.textDecoration = 'line-through';
                                todoText.style.color = '#999';
                            } else {
                                todoText.style.textDecoration = 'none';
                                todoText.style.color = '#666';
                            }
                        });
                        
                        li.appendChild(completeCheck);
                        li.appendChild(todoText);
                        li.appendChild(deleteBtn);
                        
                        todoList.appendChild(li);
                    });
                }
            }
        });
    }

    // Helper methods
    #getCurrentTripId() {
        // If tripData is an array, return ID of the first trip
        if (Array.isArray(this.#tripData) && this.#tripData.length > 0) {
            return this.#tripData[0].id;
        }
        
        // If tripData is an object, return its ID
        if (this.#tripData && this.#tripData.id) {
            return this.#tripData.id;
        }
        
        // Check localStorage for ID
        const savedData = localStorage.getItem('tripData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            return parsedData.id || null;
        }
        
        return null;
    }

    // Update UI when trip data changes
    #updateTripDisplay() {
        if (Array.isArray(this.#tripData) && this.#tripData.length > 0) {
            // Display first trip data on screen
            const trip = this.#tripData[0];
            
            const locationInput = this.#container.querySelector('#location');
            const travelerInput = this.#container.querySelector('#traveler');
            const companionsInput = this.#container.querySelector('#companions');
            const fromInput = this.#container.querySelector('#from');
            const toInput = this.#container.querySelector('#to');
            
            if (locationInput) locationInput.value = trip.location || '';
            if (travelerInput) travelerInput.value = trip.traveler || '';
            if (companionsInput) companionsInput.value = trip.companions || '';
            if (fromInput) fromInput.value = trip.from || '';
            if (toInput) toInput.value = trip.to || '';
            
            this.#displayTripData();
            
            // Load todo list
            if (trip.id) {
                this.#hub.publish(Events.LoadTodos, trip.id);
            }
        }
    }
}