import express from 'express';
import userController from '../controllers/userController.js';
import { validateUserData } from '../source/validation.js';

const router = express.Router();

// GET all users
router.get('/users', userController.getAllUsers);

// GET a specific user
router.get('/users/:id', userController.getUserById);

// POST a new user
router.post('/users', validateUserData, userController.createUser);

// PUT (update) a user
router.put('/users/:id', validateUserData, userController.updateUser);

// DELETE a user
router.delete('/users/:id', userController.deleteUser);

export default router;