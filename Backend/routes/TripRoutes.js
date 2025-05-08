import express from "express";
import TripController from "../controllers/TripController.js";

const router = express.Router();

// Define routes with controller methods
// Get all trips
router.get("/trips", async (req, res) => {
    await TripController.getAllTrips(req, res);
});

// Get trip by ID
router.get("/trips/:id", async (req, res) => {
    await TripController.getTripById(req, res);
});

// Add new trip
router.post("/trip", async (req, res) => {
    await TripController.addTrip(req, res);
});

// Update trip
router.put("/trips/:id", async (req, res) => {
    await TripController.updateTrip(req, res);
});

// Delete trip
router.delete("/trips/:id", async (req, res) => {
    await TripController.deleteTrip(req, res);
});

// Clear all trips
router.delete("/trips", async (req, res) => {
    await TripController.clearTrips(req, res);
});

export default router;