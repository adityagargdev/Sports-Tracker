import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1a1a2e', padding: '1rem 2rem',
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', color: 'white'
    }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#4ade80' }}>⚡ SportTracker</h2>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        {user?.role === 'athlete' && <>
          <Link to="/log-session" style={{ color: 'white', textDecoration: 'none' }}>Log Session</Link>
          <Link to="/goals" style={{ color: 'white', textDecoration: 'none' }}>Goals</Link>
          <Link to="/workouts" style={{ color: 'white', textDecoration: 'none' }}>Workout Types</Link>
          <Link to="/link-coach" style={{ color: 'white', textDecoration: 'none' }}>My Coach</Link>
        </>}
        {user?.role === 'coach' && <>
          <Link to="/coach" style={{ color: 'white', textDecoration: 'none' }}>My Athletes</Link>
        </>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#4ade80' }}>👤 {user?.name} ({user?.role})</span>
        <button onClick={handleLogout} style={{
          background: '#ef4444', color: 'white', border: 'none',
          padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer'
        }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;