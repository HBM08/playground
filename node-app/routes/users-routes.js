const express = require('express');
const {
  getUsers, signup, login, getUserById, deleteUserById,
  createUser, getUsersInternal
} = require('../controllers/users-controller');
const checkAuth = require('../middlewares/check-auth');
const checkRole = require('../middlewares/check-role');
const router = express.Router();

// ----- internal routes -------
router.post('/create', checkAuth, checkRole("internal"), createUser);

router.delete('/delete/:userId', checkAuth, checkRole("internal"), deleteUserById);

router.get('/internal', checkAuth, checkRole("internal"), getUsersInternal);

// ---- external routes -------
router.get('/', getUsers);

router.post('/signup', signup);

router.post('/login', login);

router.get('/:userId', getUserById);


module.exports = router;