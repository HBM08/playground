const express = require('express');
const {
  getUsers, signup, login, getUserById, deleteUserById
} = require('../controllers/users-controller');
const router = express.Router();

router.get('/', getUsers);

// If we create more routes with a single parameter after /, we should leave this one with :userId LAST (GET routes)

router.get('/:userId', getUserById);

router.delete('/delete/:userId', deleteUserById);

router.post('/signup', signup);

router.post('/login', login);

module.exports = router;