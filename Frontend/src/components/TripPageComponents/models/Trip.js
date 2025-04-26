export class Trip {
    constructor(data = {}) {
        this.id = data.id || this.generateUniqueId();
        this.name = data.name || 'Untitled Trip';
        this.destination = data.destination || '';
        this.traveler = data.traveler || '';
        this.companions = data.companions || '';
        this.from = data.from || null;
        this.to = data.to || null;
    }

    generateUniqueId() {
        return 'trip_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            destination: this.destination,
            traveler: this.traveler,
            companions: this.companions,
            from: this.from,
            to: this.to
        };
    }

    static fromJSON(json) {
        return new Trip(json);
    }
}