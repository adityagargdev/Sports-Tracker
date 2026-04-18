import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#4ade80' : 'white',
    textDecoration: 'none',
    padding: '0.5rem 0',
    fontWeight: location.pathname === path ? '600' : '400',
  });

  const links = user?.role === 'athlete' ? [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/log-session', label: 'Log Session' },
    { to: '/goals', label: 'Goals' },
    { to: '/workouts', label: 'Workout Types' },
    { to: '/link-coach', label: 'My Coach' },
  ] : user?.role === 'coach' ? [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/coach', label: 'My Athletes' },
  ] : [
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <>
      <nav style={{
        background: '#1a1a2e',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <h2 style={{ margin: 0, color: '#4ade80', fontSize: '1.3rem', whiteSpace: 'nowrap' }}>
          ⚡ SportTracker
        </h2>

        {/* Desktop links */}
        <div style={{
          display: 'flex', gap: '1.5rem', alignItems: 'center',
          '@media (max-width: 768px)': { display: 'none' }
        }} className="desktop-links">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={linkStyle(l.to)}>{l.label}</Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-links">
          <span style={{ color: '#4ade80', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
            👤 {user?.name} ({user?.role})
          </span>
          <button onClick={handleLogout} style={{
            background: '#ef4444', color: 'white', border: 'none',
            padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}>Logout</button>
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
          aria-label="Toggle menu"
        >
          <span style={{ display: 'block', width: '24px', height: '2px', background: menuOpen ? '#4ade80' : 'white', transition: 'all 0.3s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'white', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: menuOpen ? '#4ade80' : 'white', transition: 'all 0.3s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          background: '#16213e',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          position: 'sticky',
          top: '60px',
          zIndex: 999,
        }} className="mobile-menu">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{
                ...linkStyle(l.to),
                padding: '0.75rem 0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                fontSize: '1rem',
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>
              👤 {user?.name} ({user?.role})
            </span>
            <button onClick={handleLogout} style={{
              background: '#ef4444', color: 'white', border: 'none',
              padding: '0.75rem', borderRadius: '6px', cursor: 'pointer',
              fontSize: '1rem', width: '100%',
            }}>Logout</button>
          </div>
        </div>
      )}

      {/* CSS for responsive switching */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;