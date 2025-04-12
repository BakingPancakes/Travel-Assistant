import Service from "./Service.js";
import { Events } from "../eventhub/Events.js";
import Base64 from "../utility/base64.js";

export class TripRepositoryRemoteService extends Service {
    constructor() {
        super();
        this.#initTrips();
    }

    addSubscriptions() {
        this.subscribe(Events.StoreTrip, (data) => {
            this.storeTrip(data);
        });

        this.subscribe(Events.UnstoreTrips, () => {
            this.clearTrips();
        });
    }

    async #initTrips() {
        const response = await fetch("/trips");

        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();

        data.tasks.forEach(async (trip) => {
            // Convert base64 string back to blob
            if (trip.file) {
                trip.file = Base64.convertBase64ToFile(
                    trip.file,
                    trip.mime,
                    trip.filename
                );
            }

            // Publish the task.
            this.publish(Events.NewTrip, trip);
        });
    }

    async storeTrip(tripData) {
        await this.#toBase64(tripData);

        const response = await fetch("/trips", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tripData),
        });

        if (!response.ok) {
            throw new Error("Failed to store task");
        }

        const data = await response.json();
        return data;
    }

    async #toBase64(tripData) {
        throw new Error("Not yet implemented");
    }

    async clearTrips() {
        const response = await fetch("/trips", {
            method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Failed to clear tasks");
        }

        // Notify subscribers that trips are cleared from the server
        this.publish(Events.UnStoreTripsSuccess);

        return data;
    }
}
