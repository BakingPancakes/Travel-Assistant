import ModelFactory from "../models/ModelFactory.js";

class TripController {
    constructor() {
        ModelFactory.getModel().then((model) => {
            this.model = model;
        });
    }

    // Get all trips
    async getAllTrips(req, res) {
        const trips = await this.model.read();

        res.json({ trips });
    }

    // Add a new trip
    async addTrip(req, res) {
        try {
            // Check if 'trip' is provided in the request body
            if (!req.body || !req.body.task) {
                return res.status(400).json({ error: "Trip description is required"});
            }

            // Create new trip object with a unique ID
            const trip = await this.model.create(req.body);
            
            // Send back created trip as the response
            return res.status(201).json(trip);
        } catch (error) {
            console.error("Error adding trip:", error);
            return res
                .status(500)
                .json({ error: "Failed to add trip. Please try again." })
        }
    }

    // Clear all trips
    async clearTrips(req, res) {
        await this.model.delete();
        res.json(await this.model.read());
    }
}

export default new TripController();