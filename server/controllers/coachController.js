const User = require('../models/User');
const Session = require('../models/Session');
const Goal = require('../models/Goal');
const crypto = require('crypto');

// Generate a unique coach code
exports.generateCoachCode = async (req, res) => {
  try {
    if (req.user.role !== 'coach') {
      return res.status(403).json({ message: 'Only coaches can generate codes' });
    }
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    await User.findByIdAndUpdate(req.user.id, { coachCode: code });
    res.status(200).json({ status: 'success', coachCode: code });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Athlete links to a coach using code
exports.linkToCoach = async (req, res) => {
  try {
    if (req.user.role !== 'athlete') {
      return res.status(403).json({ message: 'Only athletes can link to a coach' });
    }
    const { coachCode } = req.body;
    const coach = await User.findOne({ coachCode });
    if (!coach) {
      return res.status(404).json({ message: 'Invalid coach code' });
    }
    // Link athlete to coach
    await User.findByIdAndUpdate(req.user.id, { coach: coach._id });
    // Add athlete to coach's list
    await User.findByIdAndUpdate(coach._id, {
      $addToSet: { athletes: req.user.id }
    });
    res.status(200).json({ status: 'success', message: `Linked to coach ${coach.name}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Coach gets all their athletes
exports.getMyAthletes = async (req, res) => {
  try {
    if (req.user.role !== 'coach') {
      return res.status(403).json({ message: 'Only coaches can access this' });
    }
    const coach = await User.findById(req.user.id).populate('athletes', 'name email');
    res.status(200).json({ status: 'success', athletes: coach.athletes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Coach gets a specific athlete's sessions
exports.getAthleteSessions = async (req, res) => {
  try {
    if (req.user.role !== 'coach') {
      return res.status(403).json({ message: 'Only coaches can access this' });
    }
    const sessions = await Session.find({ athlete: req.params.athleteId })
      .populate('workoutType', 'name category')
      .sort({ date: -1 });
    res.status(200).json({ status: 'success', sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Coach adds comment to a session
exports.addComment = async (req, res) => {
  try {
    if (req.user.role !== 'coach') {
      return res.status(403).json({ message: 'Only coaches can comment' });
    }
    const session = await Session.findByIdAndUpdate(
      req.params.sessionId,
      { coachComment: req.body.comment },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ status: 'success', session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Coach assigns a goal to an athlete
exports.assignGoal = async (req, res) => {
  try {
    if (req.user.role !== 'coach') {
      return res.status(403).json({ message: 'Only coaches can assign goals' });
    }
    const goal = await Goal.create({
      ...req.body,
      athlete: req.params.athleteId,
      assignedBy: req.user.id
    });
    res.status(201).json({ status: 'success', goal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my coach info (for athletes)
exports.getMyCoach = async (req, res) => {
  try {
    const athlete = await User.findById(req.user.id).populate('coach', 'name email coachCode');
    res.status(200).json({ status: 'success', coach: athlete.coach });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};