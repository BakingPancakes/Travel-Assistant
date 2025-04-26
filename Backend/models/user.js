import { generateTripId } from '../source/fileStorage.js';

export class User {
    constructor(data = {}) {
        this.id = data.id || generateTripId();
        this.name = data.name || 'Untitled Trip';
        this.destination = data.destination || '';
        this.traveler = data.traveler || '';
        this.companions = data.companions || '';
        this.from = data.from || null;
        this.to = data.to || null;
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