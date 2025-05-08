import express from "express";
import TripController from "../controllers/TripController.js";

class TripRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Define routes and connect them to controller methods

        // Get all trips
        this.router.get("/trips", async (req, res) => {
            await TripController.getAllTrips(req, res);
        });

        // Add new trip
        this.router.post("/trip", async (req, res) => {
            await TripController.addTrip(req, res);
        });

        // Clear all trips
        this.router.delete("/trips", async (req, res) => {
            await TripController.clearTrips(req, res);
        });
    }

    getRouter() {
        return this.router;
    }
}

// Fixed export statement - this was the issue
export default new TripRoutes().getRouter();