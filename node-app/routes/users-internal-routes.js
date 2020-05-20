const express = require('express');
const {
  createUser, getUsersInternal, deleteUserById,
} = require('../controllers/users-controller');
const checkAuth = require('../middlewares/check-auth');
const checkRole = require('../middlewares/check-role');
const router = express.Router();

// ----- internal routes -------
router.post('/', checkAuth, checkRole("internal"), createUser);

router.delete('/:userId', checkAuth, checkRole("internal"), deleteUserById);

router.get('/', checkAuth, checkRole("internal"), getUsersInternal);

module.exports = router;