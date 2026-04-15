import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LogSession from './pages/LogSession';
import Goals from './pages/Goals';
import WorkoutTypes from './pages/WorkoutTypes';
import CoachDashboard from './pages/CoachDashboard';
import AthleteView from './pages/AthleteView';
import LinkCoach from './pages/LinkCoach';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/log-session" element={<ProtectedRoute><LogSession /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/workouts" element={<ProtectedRoute><WorkoutTypes /></ProtectedRoute>} />
          <Route path="/coach" element={<ProtectedRoute><CoachDashboard /></ProtectedRoute>} />
          <Route path="/coach/athlete/:athleteId" element={<ProtectedRoute><AthleteView /></ProtectedRoute>} />
          <Route path="/link-coach" element={<ProtectedRoute><LinkCoach /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;