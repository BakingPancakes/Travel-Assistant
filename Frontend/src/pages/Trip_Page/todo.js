// TODO SECTION
function addTodo(section) {

    const todoSection = section.closest('.todo-section');

    const todoInput = todoSection.querySelector('input[type="text"]');
    const todoList = todoSection.querySelector('ol');
    
    const todoValue = todoInput.value;
    
    const li = document.createElement("li");
    li.classList.add("todo-item");
    
    const todoText = document.createElement("span");
    todoText.textContent = todoValue;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => {
        li.remove();
    }
    
    li.appendChild(todoText);
    li.appendChild(deleteBtn);
    
    todoList.appendChild(li);
    
    todoInput.value = "";
}
