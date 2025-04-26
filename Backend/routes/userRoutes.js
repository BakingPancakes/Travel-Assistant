import express from 'express';
import { 
    getAllTrips, 
    getTripById, 
    createTrip, 
    updateTrip, 
    deleteTrip 
} from '../controllers/tripController.js';
import { validateTripData } from '../source/validation.js';

const router = express.Router();

// GET all trips
router.get('/', getAllTrips);

// GET a specific trip
router.get('/:id', getTripById);

// POST a new trip
router.post('/', validateTripData, createTrip);

// PUT (update) a trip
router.put('/:id', validateTripData, updateTrip);

// DELETE a trip
router.delete('/:id', deleteTrip);

export default router;