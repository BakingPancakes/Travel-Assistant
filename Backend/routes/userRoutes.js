/*
import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { validateUserData } from '../source/validation.js';

const router = express.Router();

// GET all users
router.get('/', getAllUsers);

// GET a specific user
router.get('/:id', getUserById);

// POST a new user
router.post('/', validateUserData, createUser);

// PUT (update) a user
router.put('/:id', validateUserData, updateUser);

// DELETE a user
router.delete('/:id', deleteUser);

export default router;
*/

import express from 'express';
const router = express.Router();
export default router;