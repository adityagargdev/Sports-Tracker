const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://sports-tracker-sigma.vercel.app'],
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/coach', require('./routes/coachRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));