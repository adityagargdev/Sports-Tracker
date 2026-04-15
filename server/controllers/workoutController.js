const WorkoutType = require('../models/WorkoutType');

exports.createWorkout = async (req, res) => {
  try {
    const workout = await WorkoutType.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({ status: 'success', workout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await WorkoutType.find({ createdBy: req.user.id });
    res.status(200).json({ status: 'success', workouts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    await WorkoutType.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Workout type deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};