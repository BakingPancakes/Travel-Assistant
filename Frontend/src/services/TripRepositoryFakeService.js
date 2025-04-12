import Service from "./Service";
import { fetch } from "../utility/fetch";

export class TripRepositoryRemoteFakeService extends Service {
    constructor() {
        super();
    }

    async storeTrip(tripData) {
        const response = await fetch("http://localhost:3000/trip", {
            method: "POST",
            body: JSON.stringify(tripData),
        });
        const data = await response.json();
        return data;
    }

    async clearTrips() {
        const response = await fetch("http://localhost:3000/trip", {
            method: "DELETE",
        });
        const data = await response.json();
        return data;
    }

    addSubscriptions() {
        this.subscribe(EventSource.StoreTrip, (data) => {
            this.storeTrip(data);
        });

        this.subscribe(EventSource.UnStoreTrips, () => {
            this.clearTrips();
        });
    }
}