// Backend/controllers/TripController.js
import ModelFactory from "../models/ModelFactory.js";

class TripController {
    constructor() {
        ModelFactory.getModel().then(model => {
            this.model = model;
        });
    }

    // Get all trips
    async getAllTrips(req, res) {
        try {
            const trips = await this.model.read();
            res.json({ trips });
        } catch (error) {
            console.error("Error retrieving trips:", error);
            res.status(500).json({ 
                message: 'Error retrieving trips', 
                error: error.message 
            });
        }
    }

    // Get trip by ID
    async getTripById(req, res) {
        try {
            const trip = await this.model.read(parseInt(req.params.id));
            
            if (!trip) {
                return res.status(404).json({ 
                    message: 'Trip not found' 
                });
            }
            
            res.json(trip);
        } catch (error) {
            console.error("Error retrieving trip:", error);
            res.status(500).json({ 
                message: 'Error retrieving trip', 
                error: error.message 
            });
        }
    }

    // Add a new trip
    async addTrip(req, res) {
        try {
            // Check if trip data is provided
            if (!req.body) {
                return res.status(400).json({ 
                    error: "Trip data is required" 
                });
            }

            // Create new trip
            const trip = await this.model.create(req.body);
            
            // Send back created trip as the response
            return res.status(201).json(trip);
        } catch (error) {
            console.error("Error adding trip:", error);
            return res.status(500).json({ 
                error: "Failed to add trip. Please try again.",
                details: error.message
            });
        }
    }

    // Update an existing trip
    async updateTrip(req, res) {
        try {
            // Check if trip data is provided
            if (!req.body) {
                return res.status(400).json({ 
                    error: "Trip data is required" 
                });
            }
            
            // Ensure ID is included
            const tripData = { 
                ...req.body,
                id: parseInt(req.params.id)
            };
            
            // Update trip
            const updatedTrip = await this.model.update(tripData);
            
            if (!updatedTrip) {
                return res.status(404).json({ 
                    message: 'Trip not found' 
                });
            }
            
            return res.json(updatedTrip);
        } catch (error) {
            console.error("Error updating trip:", error);
            return res.status(500).json({ 
                error: "Failed to update trip. Please try again.",
                details: error.message
            });
        }
    }

    // Delete a trip
    async deleteTrip(req, res) {
        try {
            const deleted = await this.model.delete(parseInt(req.params.id));
            
            if (!deleted) {
                return res.status(404).json({ 
                    message: 'Trip not found' 
                });
            }
            
            return res.json({ 
                message: 'Trip deleted successfully' 
            });
        } catch (error) {
            console.error("Error deleting trip:", error);
            return res.status(500).json({ 
                error: "Failed to delete trip. Please try again.",
                details: error.message
            });
        }
    }

    // Clear all trips
    async clearTrips(req, res) {
        try {
            await this.model.delete();
            res.json({ message: 'All trips cleared successfully' });
        } catch (error) {
            console.error("Error clearing trips:", error);
            return res.status(500).json({ 
                error: "Failed to clear trips. Please try again.",
                details: error.message
            });
        }
    }
}

export default new TripController();