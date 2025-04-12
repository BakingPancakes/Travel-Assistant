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
});

function navigate(viewId) {

    const allViews = document.querySelectorAll('.view');
    allViews.forEach(view => {
        view.style.display = 'none';
    });
    
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
            navigate(viewId);
            highlightActiveNavItem(this);
        });
    });
    
    const tripsNavItem = document.querySelector('[data-view="trips-view"]');
    if (tripsNavItem) {
        highlightActiveNavItem(tripsNavItem);
    }
}

function highlightActiveNavItem(activeItem) {
    const navItems = document.querySelectorAll('.sidebar-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    activeItem.classList.add('active');
}

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
        
        document.getElementById('location').value = travelerData.location || '';
        document.getElementById('traveler').value = travelerData.traveler || '';
        document.getElementById('companions').value = travelerData.companions || '';
        document.getElementById('from').value = travelerData.from || '';
        document.getElementById('to').value = travelerData.to || '';
        
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
        
        input.style.display = 'block';
    }
    
    if (submitButton) {
        submitButton.style.display = 'inline-block';
    }
    
    const editButton = document.getElementById('editTripButton');
    if (editButton) {
        editButton.style.display = 'none';
    }
}