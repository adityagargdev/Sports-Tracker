const Session = require('../models/Session');

exports.createSession = async (req, res) => {
  try {
    const session = await Session.create({
      ...req.body,
      athlete: req.user.id
    });
    res.status(201).json({ status: 'success', session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ athlete: req.user.id })
      .populate('workoutType', 'name category')
      .sort({ date: -1 });
    res.status(200).json({ status: 'success', sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('workoutType', 'name category');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ status: 'success', session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ status: 'success', session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWeeklyStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sessions = await Session.find({
      athlete: req.user.id,
      date: { $gte: sevenDaysAgo }
    }).populate('workoutType', 'name category');

    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalCalories = sessions.reduce((sum, s) => sum + (s.metrics.caloriesBurned || 0), 0);

    res.status(200).json({
      status: 'success',
      stats: {
        totalSessions: sessions.length,
        totalDuration,
        totalCalories,
        sessions
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};