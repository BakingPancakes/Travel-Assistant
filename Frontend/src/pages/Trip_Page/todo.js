
function addTodo(button) {
    const todoSection = button.closest('.todo-section');
    const todoInput = todoSection.querySelector('input[type="text"]');
    const todoList = todoSection.querySelector('ol');
    
    if (!todoInput || !todoList) return;
    
    const todoValue = todoInput.value.trim();
    if (todoValue === '') return;
    
    // add new todo
    const li = document.createElement("li");
    li.classList.add("todo-item");
    
    // todo list
    const todoText = document.createElement("span");
    todoText.textContent = todoValue;
    
    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "삭제";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = function() {
        li.remove();
        
        // save todo
        saveTodoSection(todoSection);
    };
    
    // checkbox
    const completeCheck = document.createElement("input");
    completeCheck.type = "checkbox";
    completeCheck.classList.add("complete-check");
    completeCheck.onchange = function() {
        if (this.checked) {
            todoText.style.textDecoration = "line-through";
            todoText.style.color = "#999";
        } else {
            todoText.style.textDecoration = "none";
            todoText.style.color = "#666";
        }
        
        // save todo
        saveTodoSection(todoSection);
    };
    
    li.appendChild(completeCheck);
    li.appendChild(todoText);
    li.appendChild(deleteBtn);
    
    // add to list
    todoList.appendChild(li);
    
    todoInput.value = "";
    
    saveTodoSection(todoSection);
}

function saveTodoSection(todoSection) {
    const sectionTitle = todoSection.querySelector('h3').textContent;
    const todoItems = todoSection.querySelectorAll('.todo-item');
    
    const todos = [];
    
    todoItems.forEach(item => {
        const text = item.querySelector('span').textContent;
        const isCompleted = item.querySelector('.complete-check').checked;
        
        todos.push({
            text: text,
            completed: isCompleted
        });
    });
    
    // save local storage
    localStorage.setItem(`todoList_${sectionTitle}`, JSON.stringify(todos));
}

function loadTodoSections() {
    const todoSections = document.querySelectorAll('.todo-section');
    
    todoSections.forEach(section => {
        const sectionTitle = section.querySelector('h3').textContent;
        const todoList = section.querySelector('ol');
        
        const savedTodos = localStorage.getItem(`todoList_${sectionTitle}`);
        
        if (savedTodos && todoList) {
            const todos = JSON.parse(savedTodos);
            
            todos.forEach(todo => {
                const li = document.createElement("li");
                li.classList.add("todo-item");
                
                const todoText = document.createElement("span");
                todoText.textContent = todo.text;
                
                if (todo.completed) {
                    todoText.style.textDecoration = "line-through";
                    todoText.style.color = "#999";
                }
                
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "삭제";
                deleteBtn.classList.add("delete-btn");
                deleteBtn.onclick = function() {
                    li.remove();
                    saveTodoSection(section);
                };
                
                const completeCheck = document.createElement("input");
                completeCheck.type = "checkbox";
                completeCheck.classList.add("complete-check");
                completeCheck.checked = todo.completed;
                completeCheck.onchange = function() {
                    if (this.checked) {
                        todoText.style.textDecoration = "line-through";
                        todoText.style.color = "#999";
                    } else {
                        todoText.style.textDecoration = "none";
                        todoText.style.color = "#666";
                    }
                    saveTodoSection(section);
                };
                
                li.appendChild(completeCheck);
                li.appendChild(todoText);
                li.appendChild(deleteBtn);
                
                todoList.appendChild(li);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadTodoSections();
    
    const addButtons = document.querySelectorAll('.todo-section button');
    addButtons.forEach(button => {
        if (button.textContent === 'Add') {
            button.addEventListener('click', function() {
                addTodo(this);
            });
        }
    });
});