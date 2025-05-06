import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';

export class TodoComponent extends BaseComponent {
  _container = null;
  _hub = null;
  _todoItems = {
    before: [],
    during: [],
    after: []
  };

  constructor() {
    super();
    this._hub = EventHub.getInstance();
  }

  render() {
    this._container = document.createElement('div');
    this._container.id = 'todo-section';
    this._container.classList.add('section-card');

    this._container.innerHTML = `
      <h2>To-Do List</h2>
      <div class="divider"></div>
      
      <!-- before todo -->
      <div class="todo-section">
        <h3>Before Trip</h3>
        <div id="before-todo-list" class="todo-list">
          <div class="empty-message">No tasks added yet.</div>
        </div>
        <div class="add-todo-form">
          <input type="text" id="before-todo-input" placeholder="Add a task to do before the trip">
          <button class="add-todo-btn" data-section="before">Add</button>
        </div>
      </div>
      
      <!-- during todo -->
      <div class="todo-section">
        <h3>During Trip</h3>
        <div id="during-todo-list" class="todo-list">
          <div class="empty-message">No tasks added yet.</div>
        </div>
        <div class="add-todo-form">
          <input type="text" id="during-todo-input" placeholder="Add a task to do during the trip">
          <button class="add-todo-btn" data-section="during">Add</button>
        </div>
      </div>
      
      <!-- after todo -->
      <div class="todo-section">
        <h3>After Trip</h3>
        <div id="after-todo-list" class="todo-list">
          <div class="empty-message">No tasks added yet.</div>
        </div>
        <div class="add-todo-form">
          <input type="text" id="after-todo-input" placeholder="Add a task to do after the trip">
          <button class="add-todo-btn" data-section="after">Add</button>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.loadCSS('TodoComponent');
    
    return this._container;
  }

  attachEventListeners() {
    // todo add button
    const addTodoButtons = this._container.querySelectorAll('.add-todo-btn');
    addTodoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.getAttribute('data-section');
        const inputId = `${section}-todo-input`;
        this.addTodoItem(section, inputId);
      });
    });

    // key event for add todo field
    ['before', 'during', 'after'].forEach(section => {
      const input = this._container.querySelector(`#${section}-todo-input`);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addTodoItem(section, `${section}-todo-input`);
        }
      });
    });

    // subscribe event
    this._hub.subscribe(Events.TRIP_SELECTED, (data) => {
      this.loadTodoItems(data.tripId);
    });

    this._hub.subscribe(Events.TRIP_DETAILS_SAVE_REQUESTED, () => {
      this._hub.publish(Events.TODO_DATA_UPDATED, {
        todoItems: this._todoItems
      });
    });
  }

  loadTodoItems(tripId) {
    // get trip data
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[tripId]) return;
    
    const trip = savedTrips[tripId];
    
    // restore data
    this._todoItems = trip.todoItems || { before: [], during: [], after: [] };
    
    // update display
    this.updateTodoDisplay();
  }

  updateTodoDisplay() {
    // 모든 할 일 목록 지우기 delete all todo
    ['before', 'during', 'after'].forEach(section => {
      const list = this._container.querySelector(`#${section}-todo-list`);
      list.innerHTML = '';
      
      // check if anything todo in this section
      if (this._todoItems[section] && this._todoItems[section].length > 0) {
        this._todoItems[section].forEach((todo, index) => {
          const item = document.createElement('div');
          item.classList.add('todo-item');
          item.innerHTML = `
            <span>${todo}</span>
            <button class="delete-todo-btn" data-section="${section}" data-index="${index}">×</button>
          `;
          list.appendChild(item);
        });
        
        // add event listener on delete button
        list.querySelectorAll('.delete-todo-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            const index = parseInt(btn.getAttribute('data-index'));
            this.deleteTodoItem(section, index);
          });
        });
      } else {
        // shows no data message
        const emptyMsg = document.createElement('div');
        emptyMsg.classList.add('empty-message');
        emptyMsg.textContent = 'No tasks added yet.';
        list.appendChild(emptyMsg);
      }
    });
  }

  addTodoItem(section, inputId) {
    const input = this._container.querySelector(`#${inputId}`);
    const todoText = input.value.trim();
    
    if (!todoText) {
      alert('Please enter a task');
      return;
    }
    
    // add data 
    if (!this._todoItems[section]) {
      this._todoItems[section] = [];
    }
    this._todoItems[section].push(todoText);
    
    // update display
    const todoList = this._container.querySelector(`#${section}-todo-list`);
    
    // if empty message delete
    const emptyMessage = todoList.querySelector('.empty-message');
    if (emptyMessage) {
      emptyMessage.remove();
    }
    
    // add new todo
    const item = document.createElement('div');
    item.classList.add('todo-item');
    
    const index = this._todoItems[section].length - 1;
    item.innerHTML = `
      <span>${todoText}</span>
      <button class="delete-todo-btn" data-section="${section}" data-index="${index}">×</button>
    `;
    
    // add event listener delete button
    const deleteBtn = item.querySelector('.delete-todo-btn');
    deleteBtn.addEventListener('click', () => {
      const section = deleteBtn.getAttribute('data-section');
      const index = parseInt(deleteBtn.getAttribute('data-index'));
      this.deleteTodoItem(section, index);
    });
    
    todoList.appendChild(item);
    
    // reset input value
    input.value = '';
  }

  deleteTodoItem(section, index) {
    // update data
    if (this._todoItems[section]) {
      this._todoItems[section].splice(index, 1);
    }
    
    // display update
    this.updateTodoDisplay();
  }

  loadCSS(fileName) {
    if(this.cssLoaded) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./components/TripPageComponents/TodoComponent/${fileName}.css`;
    document.head.appendChild(link);
    this.cssLoaded = true;
  }
}