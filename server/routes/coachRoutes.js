const express = require('express');
const router = express.Router();
const {
  generateCoachCode, linkToCoach, getMyAthletes,
  getAthleteSessions, addComment, assignGoal, getMyCoach
} = require('../controllers/coachController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/my-coach', getMyCoach);
router.post('/generate-code', generateCoachCode);
router.post('/link', linkToCoach);
router.get('/athletes', getMyAthletes);
router.get('/athletes/:athleteId/sessions', getAthleteSessions);
router.post('/sessions/:sessionId/comment', addComment);
router.post('/athletes/:athleteId/goals', assignGoal);

module.exports = router;