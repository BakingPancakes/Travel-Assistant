import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';

export class TripPageComponent extends BaseComponent {
  // 프라이빗 변수들을 _ 접두사를 사용하여 표현
  _container = null;
  _hub = null;
  _selectedTripId = null;
  _editMode = false;
  _accommodations = [];
  _todoItems = {
    before: [],
    during: [],
    after: []
  };
  _totalBudget = 0;

  constructor() {
    super();
    this.loadCSS('TripPageComponent');
    this._hub = EventHub.getInstance();
  }

  render() {
    // 메인 컨테이너 생성
    this._container = document.createElement('div');
    this._container.classList.add('trip-page');

    // 페이지 구조 생성
    this._container.innerHTML = `
      <div class="trip-page__header">
        <h1>My Trips</h1>
        <button id="new-trip-btn" class="btn-new-trip">+ New Trip</button>
      </div>
      
      <!-- 여행 목록 테이블 - 항상 표시 -->
      <div class="trip-table">
        <div class="table-header">
          <div class="header-cell">Trip</div>
          <div class="header-cell">Who's Going?</div>
          <div class="header-cell">When?</div>
          <div class="header-cell actions">Actions</div>
        </div>
        <div id="trip-list-body" class="table-body">
          <div class="table-row">
            <div class="table-cell" colspan="4">No trips planned yet. Create your first trip!</div>
          </div>
        </div>
      </div>
      
      <!-- 여행 상세 섹션 (처음에는 숨김) -->
      <div id="trip-details-section" class="trip-details-section" style="display: none;">
        <h2 id="selected-trip-name">Trip Details</h2>
        
        <!-- 숙소 및 할 일 섹션 나란히 표시 -->
        <div class="flexible-container">
          <!-- 숙소 섹션 -->
          <div id="accommodation-section" class="section-card">
            <h2>Accommodation</h2>
            <div class="divider"></div>
            
            <!-- 숙소 테이블 -->
            <div id="accommodation-container" class="accommodation-table">
              <div class="acc-header">
                <div class="acc-cell">Traveler</div>
                <div class="acc-cell">Type</div>
                <div class="acc-cell">Price</div>
                <div class="acc-cell actions">Actions</div>
              </div>
              <div id="acc-content">
                <div class="acc-row empty-message">
                  <div class="acc-cell" colspan="4">No accommodations added yet.</div>
                </div>
              </div>
            </div>
            
            <!-- 숙소 추가 폼 -->
            <div class="add-form">
              <h3>Add Accommodation</h3>
              <div class="form-row">
                <label for="acc-traveler">Traveler:</label>
                <select id="acc-traveler" class="styled-select">
                  <!-- 동적으로 채워짐 -->
                </select>
              </div>
              <div class="form-row">
                <label for="acc-type">Type:</label>
                <select id="acc-type" class="styled-select">
                  <option value="hotel">Hotel ($200)</option>
                  <option value="condo">Condo ($100)</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-row" id="other-price-row" style="display: none;">
                <label for="acc-price">Price:</label>
                <input type="number" id="acc-price" min="0" placeholder="Enter price">
              </div>
              <button id="add-acc-btn" class="btn-add">Add Accommodation</button>
            </div>
            
            <!-- 예산 요약 -->
            <div class="budget-summary-section">
              <h3>Budget Summary</h3>
              <div class="budget-item total">
                <span>Total Budget:</span>
                <span id="total-budget">$0</span>
              </div>
            </div>
          </div>

          <!-- 할 일 섹션 -->
          <div id="todo-section" class="section-card">
            <h2>To-Do List</h2>
            <div class="divider"></div>
            
            <!-- 여행 전 할 일 -->
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
            
            <!-- 여행 중 할 일 -->
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
            
            <!-- 여행 후 할 일 -->
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
          </div>
        </div>
        
        <!-- 저장 버튼 -->
        <div class="save-button-container">
          <button id="save-trip-details" class="btn-save">Save Trip Details</button>
        </div>
      </div>
      
      <!-- 여행 입력 폼 - 처음에는 숨김 -->
      <div id="trip-input-container" class="trip-form" style="display: none;">
        <h2 id="trip-form-title">Plan Your Trip</h2>
        <div class="form-row">
          <label for="tripName">Trip Name:</label>
          <input type="text" id="tripName" placeholder="Enter trip name">
        </div>
        <div class="form-row">
          <label for="destination">Destination:</label>
          <input type="text" id="destination" placeholder="Where are you going?">
        </div>
        <div class="form-row">
          <label for="traveler">Your Name:</label>
          <input type="text" id="traveler" placeholder="Your name">
        </div>
        <div class="form-row">
          <label for="companionsCount">Number of Companions:</label>
          <select id="companionsCount" class="styled-select">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div id="companions-container"></div>
        <div class="form-row">
          <label for="departureDate">Departure Date:</label>
          <input type="date" id="departureDate">
        </div>
        <div class="form-row">
          <label for="returnDate">Return Date:</label>
          <input type="date" id="returnDate">
        </div>
        <div class="form-actions">
          <button id="cancelTrip" class="btn-cancel">Cancel</button>
          <button id="saveTrip" class="btn-create">Save Trip</button>
        </div>
      </div>
    `;

    // 기존 여행 목록 로드
    this.loadExistingTrips();

    // 이벤트 리스너 연결
    this.attachEventListeners();
    
    return this._container;
  }

  // 기존 여행 정보를 localStorage에서 로드
  loadExistingTrips() {
    // localStorage에서 저장된 여행 정보 확인
    const savedTrips = localStorage.getItem('savedTrips');
    if (savedTrips) {
      const trips = JSON.parse(savedTrips);
      this.updateTripTable(trips);
    }
  }

  // 현재 여행 정보로 테이블 업데이트
  updateTripTable(trips) {
    const tableBody = this._container.querySelector('#trip-list-body');
    
    // 기존 내용 지우기
    tableBody.innerHTML = '';
    
    if (!trips || trips.length === 0) {
      // 여행이 없을 경우 메시지 표시
      tableBody.innerHTML = `
        <div class="table-row">
          <div class="table-cell" colspan="4">No trips planned yet. Create your first trip!</div>
        </div>
      `;
      return;
    }
    
    // 각 여행을 테이블에 추가
    trips.forEach((trip, index) => {
      const row = document.createElement('div');
      row.classList.add('table-row');
      row.setAttribute('data-trip-id', index);
      
      // 날짜 형식화
      const startDate = trip.from ? new Date(trip.from) : null;
      const endDate = trip.to ? new Date(trip.to) : null;
      let dateText = 'Dates not set';
      
      if (startDate && endDate) {
        const startFormatted = startDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        const endFormatted = endDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        dateText = `${startFormatted} - ${endFormatted}`;
      }
      
      // 행 생성
      row.innerHTML = `
        <div class="table-cell trip-name clickable">${trip.name}</div>
        <div class="table-cell trip-travelers clickable">${trip.companions ? `${trip.traveler} + ${trip.companions}` : trip.traveler}</div>
        <div class="table-cell trip-dates clickable">${dateText}</div>
        <div class="table-cell actions">
          <button class="edit-trip-btn" data-trip-id="${index}">Edit</button>
          <button class="delete-trip-btn" data-trip-id="${index}">×</button>
        </div>
      `;
      
      // 행 전체를 클릭 가능하게 만들어 상세 정보 표시
      row.addEventListener('click', (e) => {
        // actions 셀 내의 버튼 클릭은 무시
        if (!e.target.closest('.actions')) {
          this.selectTrip(index);
        }
      });
      
      tableBody.appendChild(row);
    });
    
    // 편집 및 삭제 버튼에 이벤트 리스너 추가
    this._container.querySelectorAll('.edit-trip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tripId = parseInt(btn.getAttribute('data-trip-id'));
        this.editTrip(tripId);
      });
    });
    
    this._container.querySelectorAll('.delete-trip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tripId = parseInt(btn.getAttribute('data-trip-id'));
        this.deleteTrip(tripId);
      });
    });
  }

  // 여행 선택하여 상세 정보 표시
  selectTrip(tripId) {
    this._selectedTripId = tripId;
    
    // 여행 데이터 가져오기
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[tripId]) return;
    
    const trip = savedTrips[tripId];
    
    // 여행 상세 섹션 업데이트
    this._container.querySelector('#selected-trip-name').textContent = `${trip.name} - ${trip.destination}`;
    
    // 여행 상세 섹션 표시
    this._container.querySelector('#trip-details-section').style.display = 'block';
    
    // 숙소 테이블 업데이트
    this.updateAccommodationDisplay(trip);
    
    // 할 일 목록 업데이트
    this.updateTodoDisplay(trip);
    
    // 숙소 추가를 위한 여행자 선택 목록 채우기
    const travelerSelect = this._container.querySelector('#acc-traveler');
    travelerSelect.innerHTML = '';
    
    // 메인 여행자 추가
    const mainOption = document.createElement('option');
    mainOption.value = trip.traveler;
    mainOption.textContent = trip.traveler;
    travelerSelect.appendChild(mainOption);
    
    // 동반자가 있다면 추가
    if (trip.companions) {
      const companions = trip.companions.split(', ');
      companions.forEach(companion => {
        if (companion.trim()) {
          const option = document.createElement('option');
          option.value = companion.trim();
          option.textContent = companion.trim();
          travelerSelect.appendChild(option);
        }
      });
    }

    // 숙소 유형 선택 변경 이벤트 설정
    const accTypeSelect = this._container.querySelector('#acc-type');
    const accPriceRow = this._container.querySelector('#other-price-row');
    
    // 기존 이벤트 리스너 제거
    const newAccTypeSelect = accTypeSelect.cloneNode(true);
    accTypeSelect.parentNode.replaceChild(newAccTypeSelect, accTypeSelect);
    
    newAccTypeSelect.addEventListener('change', () => {
      if (newAccTypeSelect.value === 'other') {
        accPriceRow.style.display = 'block';
      } else {
        accPriceRow.style.display = 'none';
      }
    });
    
    // 내부 데이터 구조 복원
    this._accommodations = trip.accommodations || [];
    this._todoItems = trip.todoItems || { before: [], during: [], after: [] };
  }

  updateAccommodationDisplay(trip) {
    const accContent = this._container.querySelector('#acc-content');
    accContent.innerHTML = '';
    
    if (!trip.accommodations || trip.accommodations.length === 0) {
      accContent.innerHTML = `
        <div class="acc-row empty-message">
          <div class="acc-cell" colspan="4">No accommodations added yet.</div>
        </div>
      `;
      this._container.querySelector('#total-budget').textContent = '$0';
      return;
    }
    
    let totalBudget = 0;
    
    trip.accommodations.forEach((acc, index) => {
      const row = document.createElement('div');
      row.classList.add('acc-row');
      
      let typeText = 'Other';
      if (acc.type === 'hotel') typeText = 'Hotel';
      else if (acc.type === 'condo') typeText = 'Condo';
      
      row.innerHTML = `
        <div class="acc-cell">${acc.person}</div>
        <div class="acc-cell">${typeText}</div>
        <div class="acc-cell">$${acc.price}</div>
        <div class="acc-cell actions">
          <button class="delete-acc-btn" data-index="${index}">×</button>
        </div>
      `;
      
      accContent.appendChild(row);
      totalBudget += acc.price;
    });
    
    // 삭제 버튼에 이벤트 리스너 추가
    this._container.querySelectorAll('.delete-acc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        this.deleteAccommodation(index);
      });
    });
    
    // 총 예산 업데이트
    this._container.querySelector('#total-budget').textContent = `$${totalBudget}`;
  }

  updateTodoDisplay(trip) {
    // 모든 할 일 목록 지우기
    ['before', 'during', 'after'].forEach(section => {
      const list = this._container.querySelector(`#${section}-todo-list`);
      list.innerHTML = '';
      
      // 이 섹션에 할 일이 있는지 확인
      if (trip.todoItems && trip.todoItems[section] && trip.todoItems[section].length > 0) {
        trip.todoItems[section].forEach((todo, index) => {
          const item = document.createElement('div');
          item.classList.add('todo-item');
          item.innerHTML = `
            <span>${todo}</span>
            <button class="delete-todo-btn" data-section="${section}" data-index="${index}">×</button>
          `;
          list.appendChild(item);
        });
        
        // 삭제 버튼에 이벤트 리스너 추가
        list.querySelectorAll('.delete-todo-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            const index = parseInt(btn.getAttribute('data-index'));
            this.deleteTodoItem(section, index);
          });
        });
      } else {
        // 빈 메시지 표시
        const emptyMsg = document.createElement('div');
        emptyMsg.classList.add('empty-message');
        emptyMsg.textContent = 'No tasks added yet.';
        list.appendChild(emptyMsg);
      }
    });
  }

  deleteAccommodation(index) {
    // 내부 데이터 구조 업데이트
    this._accommodations.splice(index, 1);
    
    // 디스플레이 업데이트
    const trip = this.getSelectedTrip();
    if (trip) {
      trip.accommodations = this._accommodations;
      this.updateAccommodationDisplay(trip);
    }
  }

  deleteTodoItem(section, index) {
    // 내부 데이터 구조 업데이트
    if (this._todoItems[section]) {
      this._todoItems[section].splice(index, 1);
    }
    
    // 디스플레이 업데이트
    const trip = this.getSelectedTrip();
    if (trip) {
      trip.todoItems = this._todoItems;
      this.updateTodoDisplay(trip);
    }
  }

  getSelectedTrip() {
    if (this._selectedTripId === null) return null;
    
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return null;
    
    const savedTrips = JSON.parse(savedTripsJson);
    return savedTrips[this._selectedTripId] || null;
  }

  editTrip(tripId) {
    this._editMode = true;
    this._selectedTripId = tripId;
    
    // 여행 데이터 가져오기
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[tripId]) return;
    
    const trip = savedTrips[tripId];
    
    // 폼 채우기
    const tripForm = this._container.querySelector('#trip-input-container');
    tripForm.querySelector('#trip-form-title').textContent = 'Edit Trip';
    tripForm.querySelector('#tripName').value = trip.name || '';
    tripForm.querySelector('#destination').value = trip.destination || '';
    tripForm.querySelector('#traveler').value = trip.traveler || '';
    tripForm.querySelector('#departureDate').value = trip.from || '';
    tripForm.querySelector('#returnDate').value = trip.to || '';
    
    // 동반자 처리
    let companionsCount = 0;
    if (trip.companions) {
      const companions = trip.companions.split(', ');
      companionsCount = companions.length;
      tripForm.querySelector('#companionsCount').value = companionsCount;
      
      // 동반자 입력 필드 렌더링
      this.renderCompanionInputs(companionsCount);
      
      // 동반자 입력 필드 채우기
      const companionInputs = tripForm.querySelectorAll('.companion-input');
      companions.forEach((companion, index) => {
        if (index < companionInputs.length) {
          companionInputs[index].value = companion.trim();
        }
      });
    } else {
      tripForm.querySelector('#companionsCount').value = '0';
      tripForm.querySelector('#companions-container').innerHTML = '';
    }
    
    // 폼 표시
    tripForm.style.display = 'block';
    
    // 다른 섹션 숨기기
    this._container.querySelector('#trip-details-section').style.display = 'none';
  }

  deleteTrip(tripId) {
    // 삭제 확인
    if (!confirm('Are you sure you want to delete this trip?')) {
      return;
    }
    
    // 여행 데이터 가져오기
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    let savedTrips = JSON.parse(savedTripsJson);
    
    // 여행 제거
    savedTrips.splice(tripId, 1);
    
    // 업데이트된 여행 저장
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // 디스플레이 업데이트
    this.updateTripTable(savedTrips);
    
    // 삭제된 여행이 선택되어 있었다면 상세 섹션 숨기기
    if (this._selectedTripId === tripId) {
      this._selectedTripId = null;
      this._container.querySelector('#trip-details-section').style.display = 'none';
    }
    
    // 더 이상 여행이 없다면 상세 섹션 숨기기
    if (savedTrips.length === 0) {
      this._container.querySelector('#trip-details-section').style.display = 'none';
    }
  }

  loadCSS(fileName) {
    if(this.cssLoaded) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./components/TripPageComponents/${fileName}/${fileName}.css`;
    document.head.appendChild(link);
    this.cssLoaded = true;
  }

  attachEventListeners() {
    // 여행 입력 가시성 토글
    const newTripBtn = this._container.querySelector('#new-trip-btn');
    const tripInputContainer = this._container.querySelector('#trip-input-container');

    newTripBtn.addEventListener('click', () => {
      this._editMode = false;
      
      // 새 여행을 위한 폼 리셋
      this.resetForm();
      
      // 여행 입력 폼 표시, 상세 정보 숨기기
      tripInputContainer.style.display = 'block';
      tripInputContainer.querySelector('#trip-form-title').textContent = 'Plan Your Trip';
      this._container.querySelector('#trip-details-section').style.display = 'none';
    });

    // 동반자 수 변경
    const companionsCount = this._container.querySelector('#companionsCount');
    companionsCount.addEventListener('change', () => {
      this.renderCompanionInputs(parseInt(companionsCount.value));
    });

    // 취소 버튼
    const cancelBtn = this._container.querySelector('#cancelTrip');
    cancelBtn.addEventListener('click', () => {
      tripInputContainer.style.display = 'none';
      
      // 여행이 선택되어 있었다면 다시 표시
      if (this._selectedTripId !== null) {
        this.selectTrip(this._selectedTripId);
      }
    });

    // 여행 저장 버튼 (메인 여행 폼에서)
    const saveTripBtn = this._container.querySelector('#saveTrip');
    saveTripBtn.addEventListener('click', () => {
      if (this._editMode) {
        this.updateExistingTrip();
      } else {
        this.createNewTrip();
      }
    });

    // 할 일 추가 버튼
    const addTodoButtons = this._container.querySelectorAll('.add-todo-btn');
    addTodoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.getAttribute('data-section');
        const inputId = `${section}-todo-input`;
        this.addTodoItem(section, inputId);
      });
    });

    // 숙소 추가 버튼
    const addAccBtn = this._container.querySelector('#add-acc-btn');
    addAccBtn.addEventListener('click', () => {
      this.addAccommodation();
    });

    // 숙소 유형 선택 변경 이벤트 설정
    const accTypeSelect = this._container.querySelector('#acc-type');
    const accPriceRow = this._container.querySelector('#other-price-row');
    
    accTypeSelect.addEventListener('change', () => {
      if (accTypeSelect.value === 'other') {
        accPriceRow.style.display = 'block';
      } else {
        accPriceRow.style.display = 'none';
      }
    });

    // 여행 상세 정보 저장 버튼
    const saveTripDetailsBtn = this._container.querySelector('#save-trip-details');
    saveTripDetailsBtn.addEventListener('click', () => {
      this.saveTripDetails();
    });
  }

  renderCompanionInputs(count) {
    const companionsContainer = this._container.querySelector('#companions-container');
    companionsContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const companionRow = document.createElement('div');
      companionRow.classList.add('form-row');
      companionRow.innerHTML = `
        <label for="companion${i}">Companion ${i + 1}:</label>
        <input type="text" id="companion${i}" class="companion-input" placeholder="Companion name">
      `;
      companionsContainer.appendChild(companionRow);
    }
  }

  createNewTrip() {
    // 폼 유효성 검사
    if (!this.validateTripForm()) return;
    
    // 폼에서 여행 데이터 가져오기
    const tripData = this.getTripDataFromForm();
    
    // 동반자를 쉼표로 구분된 문자열로 가져오기
    const companionInputs = this._container.querySelectorAll('.companion-input');
    const companions = Array.from(companionInputs)
      .map(input => input.value.trim())
      .filter(value => value !== '')
      .join(', ');
    
    // 여행 객체 생성
    const newTrip = {
      name: tripData.name,
      destination: tripData.destination,
      traveler: tripData.traveler,
      companions: companions,
      from: tripData.departureDate,
      to: tripData.returnDate,
      budget: 0,
      accommodations: [],
      todoItems: {
        before: [],
        during: [],
        after: []
      }
    };
    
    // 저장된 여행에 추가
    let savedTrips = [];
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (savedTripsJson) {
      savedTrips = JSON.parse(savedTripsJson);
    }
    
    savedTrips.push(newTrip);
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // 여행 테이블 업데이트
    this.updateTripTable(savedTrips);
    
    // 새 여행 선택
    this.selectTrip(savedTrips.length - 1);
    
    // 폼 숨기기
    this._container.querySelector('#trip-input-container').style.display = 'none';
    
    // 성공 메시지 표시
    alert('Trip created successfully!');
  }

  updateExistingTrip() {
    // 폼 유효성 검사
    if (!this.validateTripForm()) return;
    
    // 폼에서 여행 데이터 가져오기
    const tripData = this.getTripDataFromForm();
    
    // 동반자를 쉼표로 구분된 문자열로 가져오기
    const companionInputs = this._container.querySelectorAll('.companion-input');
    const companions = Array.from(companionInputs)
      .map(input => input.value.trim())
      .filter(value => value !== '')
      .join(', ');
    
    // 저장된 여행 가져오기
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[this._selectedTripId]) return;
    
    // 여행 업데이트
    savedTrips[this._selectedTripId].name = tripData.name;
    savedTrips[this._selectedTripId].destination = tripData.destination;
    savedTrips[this._selectedTripId].traveler = tripData.traveler;
    savedTrips[this._selectedTripId].companions = companions;
    savedTrips[this._selectedTripId].from = tripData.departureDate;
    savedTrips[this._selectedTripId].to = tripData.returnDate;
    
    // 업데이트된 여행 저장
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // 여행 테이블 업데이트
    this.updateTripTable(savedTrips);
    
    // 업데이트된 여행 선택
    this.selectTrip(this._selectedTripId);
    
    // 폼 숨기기
    this._container.querySelector('#trip-input-container').style.display = 'none';
    
    // 성공 메시지 표시
    alert('Trip updated successfully!');
  }

  validateTripForm() {
    const tripName = this._container.querySelector('#tripName').value.trim();
    const destination = this._container.querySelector('#destination').value.trim();
    const traveler = this._container.querySelector('#traveler').value.trim();
    const departureDate = this._container.querySelector('#departureDate').value;
    const returnDate = this._container.querySelector('#returnDate').value;
    
    if (!tripName || !destination || !traveler || !departureDate || !returnDate) {
      alert('Please fill in all required fields');
      return false;
    }
    
    if (new Date(departureDate) > new Date(returnDate)) {
      alert('Departure date must be before return date');
      return false;
    }
    
    return true;
  }

  getTripDataFromForm() {
    return {
      name: this._container.querySelector('#tripName').value.trim(),
      destination: this._container.querySelector('#destination').value.trim(),
      traveler: this._container.querySelector('#traveler').value.trim(),
      departureDate: this._container.querySelector('#departureDate').value,
      returnDate: this._container.querySelector('#returnDate').value
    };
  }

  addTodoItem(section, inputId) {
    const input = this._container.querySelector(`#${inputId}`);
    const todoText = input.value.trim();
    
    if (!todoText) {
      alert('Please enter a task');
      return;
    }
    
    // 내부 데이터 구조에 추가
    if (!this._todoItems[section]) {
      this._todoItems[section] = [];
    }
    this._todoItems[section].push(todoText);
    
    // 디스플레이 업데이트
    const todoList = this._container.querySelector(`#${section}-todo-list`);
    
    // 빈 메시지가 있다면 제거
    const emptyMessage = todoList.querySelector('.empty-message');
    if (emptyMessage) {
      emptyMessage.remove();
    }
    
    // 새 할 일 항목 생성
    const item = document.createElement('div');
    item.classList.add('todo-item');
    
    const index = this._todoItems[section].length - 1;
    item.innerHTML = `
      <span>${todoText}</span>
      <button class="delete-todo-btn" data-section="${section}" data-index="${index}">×</button>
    `;
    
    // 삭제 버튼에 이벤트 리스너 추가
    const deleteBtn = item.querySelector('.delete-todo-btn');
    deleteBtn.addEventListener('click', () => {
      const section = deleteBtn.getAttribute('data-section');
      const index = parseInt(deleteBtn.getAttribute('data-index'));
      this.deleteTodoItem(section, index);
    });
    
    todoList.appendChild(item);
    
    // 입력 필드 지우기
    input.value = '';
  }

  addAccommodation() {
    if (this._selectedTripId === null) return;
    
    const traveler = this._container.querySelector('#acc-traveler').value;
    const accType = this._container.querySelector('#acc-type').value;
    let price = 0;
    
    if (accType === 'hotel') {
      price = 200;
    } else if (accType === 'condo') {
      price = 100;
    } else if (accType === 'other') {
      price = parseFloat(this._container.querySelector('#acc-price').value);
      if (isNaN(price) || price < 0) {
        alert('Please enter a valid price');
        return;
      }
    }
    
    // 이 여행자가 이미 숙소를 가지고 있는지 확인
    const existingIndex = this._accommodations.findIndex(
      acc => acc.person === traveler
    );
    
    if (existingIndex >= 0) {
      // 기존 숙소 업데이트
      this._accommodations[existingIndex] = {
        person: traveler,
        type: accType,
        price: price
      };
    } else {
      // 새 숙소 추가
      this._accommodations.push({
        person: traveler,
        type: accType,
        price: price
      });
    }
    
    // 총 예산 재계산
    this._totalBudget = 0;
    this._accommodations.forEach(acc => {
      this._totalBudget += acc.price;
    });
    
    // 디스플레이 업데이트
    const accContent = this._container.querySelector('#acc-content');
    accContent.innerHTML = '';
    
    this._accommodations.forEach((acc, index) => {
      const row = document.createElement('div');
      row.classList.add('acc-row');
      
      let typeText = 'Other';
      if (acc.type === 'hotel') typeText = 'Hotel';
      else if (acc.type === 'condo') typeText = 'Condo';
      
      row.innerHTML = `
        <div class="acc-cell">${acc.person}</div>
        <div class="acc-cell">${typeText}</div>
        <div class="acc-cell">${acc.price}</div>
        <div class="acc-cell actions">
          <button class="delete-acc-btn" data-index="${index}">×</button>
        </div>
      `;
      
      accContent.appendChild(row);
    });
    
    // 삭제 버튼에 이벤트 리스너 추가
    this._container.querySelectorAll('.delete-acc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        this.deleteAccommodation(index);
      });
    });
    
    // 총 예산 디스플레이 업데이트
    this._container.querySelector('#total-budget').textContent = `${this._totalBudget}`;
    
    // 기타 가격 입력 초기화
    if (accType === 'other') {
      this._container.querySelector('#acc-price').value = '';
    }
    
    // 기타 가격 입력 숨기기
    this._container.querySelector('#other-price-row').style.display = 'none';
    
    // 숙소 유형을 호텔로 재설정
    this._container.querySelector('#acc-type').value = 'hotel';
  }

  saveTripDetails() {
    if (this._selectedTripId === null) return;
    
    // 저장된 여행 가져오기
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[this._selectedTripId]) return;
    
    // 여행 업데이트
    savedTrips[this._selectedTripId].accommodations = this._accommodations;
    savedTrips[this._selectedTripId].todoItems = this._todoItems;
    savedTrips[this._selectedTripId].budget = this._totalBudget;
    
    // 업데이트된 여행 저장
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // 성공 메시지 표시
    alert('Trip details saved successfully!');
    
    // 여행 테이블 업데이트 (예산 변경 사항을 반영하기 위해)
    this.updateTripTable(savedTrips);
  }

  resetForm() {
    // 모든 폼 필드 초기화
    this._container.querySelector('#tripName').value = '';
    this._container.querySelector('#destination').value = '';
    this._container.querySelector('#traveler').value = '';
    this._container.querySelector('#companionsCount').value = '0';
    this._container.querySelector('#companions-container').innerHTML = '';
    this._container.querySelector('#departureDate').value = '';
    this._container.querySelector('#returnDate').value = '';
    
    // 내부 데이터 구조 초기화
    this._accommodations = [];
    this._todoItems = {
      before: [],
      during: [],
      after: []
    };
    this._totalBudget = 0;
  }
}