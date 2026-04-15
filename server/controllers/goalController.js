const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      athlete: req.user.id,
      assignedBy: req.user.id
    });
    res.status(201).json({ status: 'success', goal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ athlete: req.user.id })
      .sort({ deadline: 1 });
    res.status(200).json({ status: 'success', goals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.status(200).json({ status: 'success', goal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};