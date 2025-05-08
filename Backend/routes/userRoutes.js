import express from 'express';
import userController from '../../Backend/controllers/userController.js';
import { validateUserData } from '../source/validation.js';

const router = express.Router();

// GET all users
router.get('/', userController.getAllUsers.bind(userController));

// GET a specific user
router.get('/:id', userController.getUserById.bind(userController));

// POST a new user
router.post('/', validateUserData, userController.createUser.bind(userController));

// PUT (update) a user
router.put('/:id', validateUserData, userController.updateUser.bind(userController));

// DELETE a user
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;