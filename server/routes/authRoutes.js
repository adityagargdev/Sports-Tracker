const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://sports-tracker-sigma.vercel.app/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.redirect(`https://sports-tracker-sigma.vercel.app/auth/callback?token=${token}`);
  }
);

module.exports = router;