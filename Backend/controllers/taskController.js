import { readTrips, writeTrips } from '../source/fileStorage.js';
import { Trip } from '../models/Trip.js';

export async function getAllTrips(req, res) {
    try {
        const trips = await readTrips();
        res.json({ trips });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving trips', 
            error: error.message 
        });
    }
}

export async function getTripById(req, res) {
    try {
        const trips = await readTrips();
        const trip = trips.find(t => t.id === req.params.id);
        
        if (!trip) {
            return res.status(404).json({ 
                message: 'Trip not found' 
            });
        }
        
        res.json(trip);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving trip', 
            error: error.message 
        });
    }
}

export async function createTrip(req, res) {
    try {
        const trips = await readTrips();
        
        // Create new trip instance
        const newTrip = new Trip(req.body);
        
        // Add to existing trips
        trips.push(newTrip.toJSON());
        
        // Write updated trips to file
        await writeTrips(trips);
        
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating trip', 
            error: error.message 
        });
    }
}

export async function updateTrip(req, res) {
    try {
        const trips = await readTrips();
        
        // Find trip index
        const tripIndex = trips.findIndex(t => t.id === req.params.id);
        
        if (tripIndex === -1) {
            return res.status(404).json({ 
                message: 'Trip not found' 
            });
        }
        
        // Create updated trip, preserving original ID
        const updatedTrip = {
            ...trips[tripIndex],
            ...req.body,
            id: req.params.id
        };
        
        // Replace trip in array
        trips[tripIndex] = updatedTrip;
        
        // Write updated trips to file
        await writeTrips(trips);
        
        res.json(updatedTrip);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating trip', 
            error: error.message 
        });
    }
}

export async function deleteTrip(req, res) {
    try {
        let trips = await readTrips();
        
        // Filter out the trip to delete
        const initialLength = trips.length;
        trips = trips.filter(t => t.id !== req.params.id);
        
        if (trips.length === initialLength) {
            return res.status(404).json({ 
                message: 'Trip not found' 
            });
        }
        
        // Write updated trips to file
        await writeTrips(trips);
        
        res.json({ 
            message: 'Trip deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting trip', 
            error: error.message 
        });
    }
}