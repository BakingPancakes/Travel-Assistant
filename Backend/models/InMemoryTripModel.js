// Backend/models/InMemoryTripModel.js
// 메모리에 여행 정보 저장

class _InMemoryTripModel {
    static tripid = 1;

    constructor() {
        this.trips = [];
        // 샘플 여행 데이터로 초기화
        this.initializeSampleTrips();
    }

    // 샘플 여행 데이터 초기화
    initializeSampleTrips() {
        const sampleTrips = [
            {
                id: _InMemoryTripModel.tripid++,
                name: "일본 도쿄 여행",
                destination: "도쿄, 일본",
                traveler: "홍길동",
                companions: "김철수, 이영희",
                from: "2023-06-15",
                to: "2023-06-22",
                budget: 1500000,
                accommodations: [
                    { person: "홍길동", type: "hotel", price: 200 },
                    { person: "김철수", type: "hotel", price: 200 },
                    { person: "이영희", type: "hotel", price: 200 }
                ],
                todoItems: {
                    before: ["여권 갱신하기", "호텔 예약하기", "항공권 구매하기"],
                    during: ["도쿄 타워 방문", "디즈니랜드 방문", "아키하바라 쇼핑"],
                    after: ["여행 사진 정리", "일본 방문 블로그 작성"]
                }
            },
            {
                id: _InMemoryTripModel.tripid++,
                name: "제주도 여름 휴가",
                destination: "제주도",
                traveler: "김영수",
                companions: "박미영",
                from: "2023-07-20",
                to: "2023-07-25",
                budget: 800000,
                accommodations: [
                    { person: "김영수", type: "condo", price: 100 },
                    { person: "박미영", type: "condo", price: 100 }
                ],
                todoItems: {
                    before: ["렌터카 예약", "숙소 예약"],
                    during: ["성산일출봉 등산", "함덕 해수욕장 방문", "흑돼지 맛집 방문"],
                    after: ["리뷰 작성"]
                }
            }
        ];

        this.trips = sampleTrips;
    }

    // 새 여행 생성
    async create(trip) {
        // ID 할당
        trip.id = _InMemoryTripModel.tripid++;
        
        // 기본값 설정
        trip.budget = trip.budget || 0;
        trip.accommodations = trip.accommodations || [];
        trip.todoItems = trip.todoItems || { before: [], during: [], after: [] };
        
        this.trips.push(trip);
        return trip;
    }

    // 여행 정보 조회
    async read(id = null) {
        if (id !== null) {
            return this.trips.find((trip) => trip.id === id);
        }
        return this.trips;
    }

    // 여행 정보 업데이트
    async update(trip) {
        const index = this.trips.findIndex((t) => t.id === trip.id);
        
        if (index === -1) {
            return null;
        }
        
        this.trips[index] = trip;
        return trip;
    }

    // 여행 삭제
    async delete(trip = null) {
        if (trip === null) {
            this.trips = [];
            return;
        }

        const index = this.trips.findIndex((t) => t.id === trip.id);
        
        if (index === -1) {
            return null;
        }
        
        const deletedTrip = this.trips[index];
        this.trips.splice(index, 1);
        return deletedTrip;
    }
}

// InMemoryTripModel의 싱글톤 인스턴스 생성
const InMemoryTripModel = new _InMemoryTripModel();

export default InMemoryTripModel;