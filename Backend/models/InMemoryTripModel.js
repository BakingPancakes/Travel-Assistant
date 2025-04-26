// Stores trips in memory

class _InMemoryTripModel {
    static tripid = 1;

    constructor() {
        this.trips = [];
    }

    async create(trip) {
        trip.id = _InMemoryTripModel.tripid++;
        this.trips.push(trip);
        return trip;
    }

    async read(id = null) {
        if (id) {
            return this.trips.find((trip) => trip.id === id);
        }

        return this.trips;
    }

    async update(trip) {
        const index = this.trips.findIndex((t) => t.id === trip.id);
        this.trips[index] = trip;
        return trip;
    }

    async delete(trip = null) {
        if (task === null) {
            this.trips = [];
            return;
        }

        const index = this.trips.findIndex((t) => t.id === trip.id);
        this.trips.splice(index, 1);
        return trip;
    }
}

// Create a singleton instance of the InMemoryTripModel.
const InMemoryTripModel = new _InMemoryTripModel();

// Initialize with some sample trips