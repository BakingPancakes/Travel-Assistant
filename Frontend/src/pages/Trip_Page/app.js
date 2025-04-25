document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadTripData();
    
    const submitButton = document.getElementById('submitTrip');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            saveTripData();
        });
    }
    
    const editButton = document.getElementById('editTripButton');
    if (editButton) {
        editButton.addEventListener('click', function() {
            enableTripEdit();
        });
    }

    // Initialize todo functionality
    initializeTodoSections();

    // Show default view
    navigate('trips-view');
});

// Navigation functions
function navigate(viewId) {
    // Hide all views
    const allViews = document.querySelectorAll('.view');
    allViews.forEach(view => {
        view.style.display = 'none';
    });
    
    // Show the selected view
    const selectedView = document.getElementById(viewId);
    if (selectedView) {
        selectedView.style.display = 'block';
    }
}

function initializeNavigation() {
    const navItems = document.querySelectorAll('.sidebar-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const viewId = this.getAttribute('data-view');
            if (viewId) {
                navigate(viewId);
                highlightActiveNavItem(this);
            }
        });
    });
    
    // Highlight the default navigation item
    const defaultNavItem = document.querySelector('[data-view="trips-view"]');
    if (defaultNavItem) {
        highlightActiveNavItem(defaultNavItem);
    }
}

function highlightActiveNavItem(activeItem) {
    const navItems = document.querySelectorAll('.sidebar-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    activeItem.classList.add('active');
}

// Trip data management functions
function saveTripData() {
    const travelerData = {
        location: document.getElementById('location').value || '',
        traveler: document.getElementById('traveler').value || '',
        companions: document.getElementById('companions').value || '',
        from: document.getElementById('from').value || '',
        to: document.getElementById('to').value || ''
    };
    
    localStorage.setItem('tripData', JSON.stringify(travelerData));
    displayTripData();
}

function loadTripData() {
    const savedData = localStorage.getItem('tripData');
    
    if (savedData) {
        const travelerData = JSON.parse(savedData);
        
        const locationInput = document.getElementById('location');
        const travelerInput = document.getElementById('traveler');
        const companionsInput = document.getElementById('companions');
        const fromInput = document.getElementById('from');
        const toInput = document.getElementById('to');
        
        if (locationInput) locationInput.value = travelerData.location || '';
        if (travelerInput) travelerInput.value = travelerData.traveler || '';
        if (companionsInput) companionsInput.value = travelerData.companions || '';
        if (fromInput) fromInput.value = travelerData.from || '';
        if (toInput) toInput.value = travelerData.to || '';
        
        displayTripData();
    }
}

function displayTripData() {
    const formGroups = document.getElementsByClassName('form-group');
    const submitButton = document.getElementById('submitTrip');
    
    for (let i = 0; i < formGroups.length; i++) {
        const group = formGroups[i];
        const label = group.getElementsByTagName('label')[0];
        const input = group.getElementsByTagName('input')[0];
        
        if (label && input) {
            const fieldName = label.textContent;
            
            const displayText = document.createElement('p');
            displayText.className = 'display-text';
            displayText.textContent = `${fieldName}: ${input.value}`;
            
            input.style.display = 'none';
            
            let existingText = null;
            const paragraphs = group.getElementsByClassName('display-text');
            if (paragraphs.length > 0) {
                existingText = paragraphs[0];
            }
            
            if (existingText) {
                existingText.textContent = `${fieldName}: ${input.value}`;
            } else {
                group.appendChild(displayText);
            }
        }
    }
    
    if (submitButton) {
        submitButton.style.display = 'none';
    }
    
    const editButton = document.getElementById('editTripButton');
    if (editButton) {
        editButton.style.display = 'inline-block';
    }
}

function enableTripEdit() {
    const formGroups = document.getElementsByClassName('form-group');
    const submitButton = document.getElementById('submitTrip');
    
    for (let i = 0; i < formGroups.length; i++) {
        const group = formGroups[i];
        const input = group.getElementsByTagName('input')[0];
        const displayTexts = group.getElementsByClassName('display-text');
        
        if (displayTexts.length > 0) {
            displayTexts[0].style.display = 'none';
        }
        
        if (input) {
            input.style.display = 'block';
        }
    }
    
    if (submitButton) {
        submitButton.style.display = 'inline-block';
    }
    
    const editButton = document.getElementById('editTripButton');
    if (editButton) {
        editButton.style.display = 'none';
    }
}

// Todo functionality
function initializeTodoSections() {
    const todoSections = document.querySelectorAll('.todo-section');
    
    todoSections.forEach(section => {
        const addButton = section.querySelector('button');
        if (addButton) {
            addButton.addEventListener('click', function() {
                addTodo(this);
            });
        }
        
        // Load saved todos for this section
        loadTodos(section);
    });
}

function addTodo(button) {
    const todoSection = button.closest('.todo-section');
    const todoInput = todoSection.querySelector('input[type="text"]');
    const todoList = todoSection.querySelector('ol');
    
    if (todoInput && todoList) {
        const todoValue = todoInput.value.trim();
        
        if (todoValue) {
            const li = document.createElement("li");
            li.classList.add("todo-item");
            
            const todoText = document.createElement("span");
            todoText.textContent = todoValue;
            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener('click', function() {
                li.remove();
                saveTodos(todoSection);
            });
            
            li.appendChild(todoText);
            li.appendChild(deleteBtn);
            
            todoList.appendChild(li);
            todoInput.value = "";
            
            // Save todos after adding new one
            saveTodos(todoSection);
        }
    }
}

function saveTodos(todoSection) {
    const sectionName = todoSection.querySelector('h3').textContent;
    const todoItems = todoSection.querySelectorAll('.todo-item span');
    const todos = [];
    
    todoItems.forEach(item => {
        todos.push(item.textContent);
    });
    
    localStorage.setItem(`todos_${sectionName}`, JSON.stringify(todos));
}

function loadTodos(todoSection) {
    const sectionName = todoSection.querySelector('h3').textContent;
    const savedTodos = localStorage.getItem(`todos_${sectionName}`);
    const todoList = todoSection.querySelector('ol');
    
    if (savedTodos && todoList) {
        const todos = JSON.parse(savedTodos);
        
        todos.forEach(todoText => {
            const li = document.createElement("li");
            li.classList.add("todo-item");
            
            const todoTextElement = document.createElement("span");
            todoTextElement.textContent = todoText;
            
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener('click', function() {
                li.remove();
                saveTodos(todoSection);
            });
            
            li.appendChild(todoTextElement);
            li.appendChild(deleteBtn);
            
            todoList.appendChild(li);
        });
    }
}