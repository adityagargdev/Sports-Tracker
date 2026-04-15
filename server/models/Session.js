const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  athlete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutType',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 1
  },
  metrics: {
    caloriesBurned: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    sets: { type: Number, default: 0 },
    weight: { type: Number, default: 0 }
  },
  notes: {
    type: String,
    trim: true
  },
  coachComment: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);