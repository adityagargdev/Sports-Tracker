const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['athlete', 'coach'],
    default: 'athlete'
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  athletes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  coachCode: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = bcrypt.hashSync(this.password, 12);
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);