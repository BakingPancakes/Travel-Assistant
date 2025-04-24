import { BaseComponent } from "../BaseComponent/BaseComponent";

export class TodoSection extends BaseComponent {
    #container = null;
    #todoLists = {
        before: [],
        during: [],
        after: []
    };

    constructor() {
        super();
        this.loadCSS('TodoSection');
    }

    render() {
        this.#createContainer();
        this.#setupContainerContent();
        this.#attachEventListeners();
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('todo-section');
    }

    #setupContainerContent() {
        this.#container.innerHTML = `
            <div class="todo-section-before">
                <h3>BEFORE</h3>
                <div class="item-container">
                    <input type="text" placeholder="Write todo">
                    <button data-section="before">Add</button>
                </div>
                <ol class="todo-list-before"></ol>
            </div>
            <div class="todo-section-during">
                <h3>DURING</h3>
                <div class="item-container">
                    <input type="text" placeholder="Write todo">
                    <button data-section="during">Add</button>
                </div>
                <ol class="todo-list-during"></ol>
            </div>
            <div class="todo-section-after">
                <h3>AFTER</h3>
                <div class="item-container">
                    <input type="text" placeholder="Write todo">
                    <button data-section="after">Add</button>
                </div>
                <ol class="todo-list-after"></ol>
            </div>
        `;
    }

    #attachEventListeners() {
        const addButtons = this.#container.querySelectorAll('.item-container button');
        addButtons.forEach(button => {
            button.addEventListener('click', () => this.#addTodo(button));
        });
    }

    #addTodo(button) {
        const section = button.getAttribute('data-section');
        const input = button.previousElementSibling;
        const todoValue = input.value.trim();

        if (todoValue) {
            const todoList = this.#container.querySelector(`.todo-list-${section}`);
            const li = document.createElement('li');
            li.classList.add('todo-item');
            
            li.innerHTML = `
                <span>${todoValue}</span>
                <button class="delete-btn">delete</button>
            `;

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => li.remove());

            todoList.appendChild(li);
            input.value = '';

            // save list
            this.#todoLists[section].push(todoValue);
        }
    }

    getTodoLists() {
        return this.#todoLists;
    }
}