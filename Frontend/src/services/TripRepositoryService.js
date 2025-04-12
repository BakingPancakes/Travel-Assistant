import { Events } from '/lib/eventhub/Events.js';
import Service from './Service.js';

export class TripRepositoryService extends Service {
    constructor() {
        super();
        this.dbName = "tripDB";
        this.storeName = "tasks";
        this.db = null;

        this.initDB()
            .then(() => {
                // Load trips on initialization
                this.loadTripsFromDB();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(this.storeName, {
                    keyPath: "id",
                    autoIncrement: true,
                });
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject("Error initializing IndexedDB");
            };
        });
    }

    async storeTrip(tripData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.db.objectStore(this.storeName);
            const request = store.add(tripData);

            request.onsuccess = () => {
                this.publish(Events.StoreTripSuccess, taskData);
                resolve("Trip stored successfully");
            };

            request.onerror = () => {
                this.publish(Events.StoreTripFailure, tripData);
                reject("Error storing trip: ");
            };
        });
    }

    async loadTripsFromDB() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                const trips = event.target.result;
                trips.forEach((trip) => this.publish("NewTrip", trip));
                resolve(trips);
            };

            request.onerror = () => {
                this.publish(Events.LoadTripsFailure);
                reject("Error retrieving trips");
            };
        });
    }

    async clearTrips() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => {
                this.publish(Events.UnStoreTripsSuccess);
                resolve("All trips cleared");
            };

            request.onerror = () => {
                this.publish(Events.UnStoreTripsFailure);
                reject("Error clearing trips");
            };
        });
    }

    addSubscriptions() {
        this.subscribe(Events.storeTrip, (data) => {
            this.storeTrip(data);
        });

        this.subscribe(Events.UnstoreTrips, () => {
            this.clearTrips();
        });
    }
}