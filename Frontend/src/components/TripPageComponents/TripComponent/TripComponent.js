import { BaseComponent } from '../../BaseComponent/BaseComponent.js';
import { EventHub } from '../../../lib/eventhub/eventHub.js';
import { Events } from '../../../lib/eventhub/events.js';
import { TripListComponent } from '../TripListComponent/TripListComponent.js';
import { TripInputComponent } from '../TripInputComponent/TripInputComponent.js';
import { TripDetailComponent } from '../TripDetailComponent/TripDetailComponent.js';

export class TripPageComponent extends BaseComponent {
  _container = null;
  _hub = null;
  _trips = [];
  _tripListComponent = null;
  _tripInputComponent = null;
  _tripDetailComponent = null;

  constructor() {
    super();
    this._hub = EventHub.getInstance();
    
    // create lower components
    this._tripListComponent = new TripListComponent();
    this._tripInputComponent = new TripInputComponent();
    this._tripDetailComponent = new TripDetailComponent();
    
    // for debugging 
    window.tripPageComponent = this;
  }

  render() {
    // create main container
    this._container = document.createElement('div');
    this._container.classList.add('trip-page');

    // create header
    const header = document.createElement('div');
    header.classList.add('trip-page__header');
    header.innerHTML = `
      <h1>My Trips</h1>
      <button id="new-trip-btn" class="btn-new-trip">+ New Trip</button>
    `;
    this._container.appendChild(header);
    
    // render lower components
    this._container.appendChild(this._tripListComponent.render());
    this._container.appendChild(this._tripDetailComponent.render());
    this._container.appendChild(this._tripInputComponent.render());
    
    // connect event listener
    this.attachEventListeners();
    
    // update exist trip
    this.loadExistingTrips();

    // update css
    this.loadCSS('TripPageComponent');
    
    return this._container;
  }

  attachEventListeners() {
    // create new trip button event
    const newTripBtn = this._container.querySelector('#new-trip-btn');
    newTripBtn.addEventListener('click', () => {
      this._hub.publish(Events.CREATE_NEW_TRIP);
    });
    
    // subscribe new event create 
    this._hub.subscribe(Events.TRIP_CREATED, (data) => {
      this.createNewTrip(data.tripData);
    });
    
    // subscribe trip update 
    this._hub.subscribe(Events.TRIP_UPDATED, (data) => {
      this.updateExistingTrip(data.tripId, data.tripData);
    });
    
    // 사이드바에서 Trips 버튼 클릭 이벤트 구독
    this._hub.subscribe(Events.SwitchToTripPage, () => {
      // 이 컴포넌트를 표시
      this.showPage();
    });
  }
  
  // 페이지 표시 메서드
  showPage() {
    // 이 페이지 표시
    if (this._container) {
      this._container.style.display = 'flex';
      console.log("Trip page displayed");
    }
  }

  loadExistingTrips() {
    // localStorage에서 저장된 여행 정보 확인
    const savedTrips = localStorage.getItem('savedTrips');
    if (savedTrips) {
      this._trips = JSON.parse(savedTrips);
      this._hub.publish(Events.TRIPS_UPDATED, { trips: this._trips });
    }
  }

  createNewTrip(tripData) {
    // 디버깅을 위한 로그 추가
    console.log("createNewTrip called with data:", tripData);
    
    // 저장된 여행에 추가
    let savedTrips = [];
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (savedTripsJson) {
      savedTrips = JSON.parse(savedTripsJson);
    }
    
    // 여행 데이터가 객체인지 확인
    if (typeof tripData !== 'object' || tripData === null) {
      console.error("Invalid trip data:", tripData);
      alert("Error: Invalid trip data");
      return;
    }
    
    // 여행 데이터에 필수 필드가 있는지 확인
    if (!tripData.name || !tripData.destination || !tripData.traveler) {
      console.error("Missing required fields in trip data:", tripData);
      alert("Error: Missing required trip information");
      return;
    }
    
    savedTrips.push(tripData);
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // 디버깅을 위한 로그 추가
    console.log("Trip saved to localStorage:", tripData);
    console.log("Current trips in localStorage:", savedTrips);
    
    // 여행 테이블 업데이트
    this._trips = savedTrips;
    this._hub.publish(Events.TRIPS_UPDATED, { trips: savedTrips });
    
    // 새 여행 선택
    this._hub.publish(Events.TRIP_SELECTED, { tripId: savedTrips.length - 1 });
    
    // 성공 메시지 표시
    alert('Trip created successfully!');
  }

  updateExistingTrip(tripId, tripData) {
    // 저장된 여행 가져오기
    const savedTripsJson = localStorage.getItem('savedTrips');
    if (!savedTripsJson) return;
    
    const savedTrips = JSON.parse(savedTripsJson);
    if (!savedTrips[tripId]) return;
    
    // 숙소와 할 일 정보 유지
    if (savedTrips[tripId].accommodations) {
      tripData.accommodations = savedTrips[tripId].accommodations;
    }
    
    if (savedTrips[tripId].todoItems) {
      tripData.todoItems = savedTrips[tripId].todoItems;
    }
    
    if (savedTrips[tripId].budget) {
      tripData.budget = savedTrips[tripId].budget;
    }
    
    // 여행 업데이트
    savedTrips[tripId] = tripData;
    
    // 업데이트된 여행 저장
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    
    // 여행 테이블 업데이트
    this._trips = savedTrips;
    this._hub.publish(Events.TRIPS_UPDATED, { trips: savedTrips });
    
    // 업데이트된 여행 선택
    this._hub.publish(Events.TRIP_SELECTED, { tripId });
    
    // 성공 메시지 표시
    alert('Trip updated successfully!');
  }

  loadCSS(fileName) {
    if(this.cssLoaded) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./components/TripPageComponents/${fileName}/${fileName}.css`;
    document.head.appendChild(link);
    this.cssLoaded = true;
  }
}