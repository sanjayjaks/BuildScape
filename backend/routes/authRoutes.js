const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyEmail,
  updateMembership
} = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
// router.get('/verify/:token', verifyEmail);

// Protected routes
router.use(auth);
router.get('/me', getUserProfile);
router.put('/profile', updateUserProfile);
// router.put('/membership', updateMembership);

router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});

module.exports = router;
