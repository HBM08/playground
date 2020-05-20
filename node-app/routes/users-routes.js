const express = require('express');
const {
  getUsers, signup, login, getUserById
} = require('../controllers/users-controller');
const router = express.Router();

// ---- external routes -------
router.get('/', getUsers);

router.post('/signup', signup);

router.post('/login', login);

router.get('/:userId', getUserById);


module.exports = router;