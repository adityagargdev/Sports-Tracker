const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts, deleteWorkout } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createWorkout);
router.get('/', getWorkouts);
router.delete('/:id', deleteWorkout);

module.exports = router;