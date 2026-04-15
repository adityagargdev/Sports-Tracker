const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  athlete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'missed'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);