const express = require('express');
const router = express.Router();
const {
  createSession, getSessions, getSession,
  updateSession, deleteSession, getWeeklyStats
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/stats/weekly', getWeeklyStats);
router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSession);
router.patch('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;