import fs from 'fs';
import path from 'path';

// Constants for file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const TRIPS_FILE = path.join(DATA_DIR, 'trips.json');

// Ensure data directory exists
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

// Generate a unique ID for trips - follows pattern from lecture
export function generateTripId() {
    return 'trip_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// Read trips from the JSON file - similar to examples in lecture
export function readTrips() {
    ensureDataDir();
    
    try {
        if (!fs.existsSync(TRIPS_FILE)) {
            return [];
        }
        
        const data = fs.readFileSync(TRIPS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading trips:', err);
        // If file doesn't exist or is corrupted, return empty array
        return [];
    }
}

// Write trips to the JSON file - similar to examples in lecture
export function writeTrips(trips) {
    ensureDataDir();
    
    try {
        fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('Error writing trips:', err);
        return false;
    }
}