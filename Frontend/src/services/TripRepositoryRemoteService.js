import Service from "./Service.js";
import { Events } from "../lib/eventhub/events.js";
import Base64 from "../utility/base64.js";

export class TripRepositoryRemoteService extends Service {
    constructor() {
        super();
        this.serverUrl = 'http://localhost:3000/api'; // Backend API URL
    }

    addSubscriptions() {
        this.subscribe(Events.StoreTrip, (data) => {
            this.storeTrip(data);
        });

        this.subscribe(Events.UnStoreTrips, () => {
            this.clearTrips();
        });
    }

    async storeTrip(tripData) {
        await this.#toBase64(tripData);

        const response = await fetch(`${this.serverUrl}/trip`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tripData),
        });

        if (!response.ok) {
            throw new Error("Failed to store trip");
        }

        const data = await response.json();
        return data;
    }

    async clearTrips() {
        const response = await fetch(`${this.serverUrl}/trips`, {
            method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Failed to clear trips");
        }

        // Notify subscribers that trips are cleared from the server
        this.publish(Events.UnStoreTripsSuccess);

        return data;
    }

    async #toBase64(tripData) {
        if (tripData.file) {
            // Need to store the mime type separately as it is needed when
            // converting back to blob when fetched from the server.
            tripData.mime = tripData.file.type;
            // Store the filename separately as well
            tripData.filename = tripData.file.name;
            // Convert the file to base64
            const base64 = await Base64.convertFileToBase64(tripData.file);
            tripData.file = base64;
          }
    }
}