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
        throw new Error("Not Implemented yet");
    }
}
