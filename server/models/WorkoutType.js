const mongoose = require('mongoose');

const workoutTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'sports', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutType', workoutTypeSchema);