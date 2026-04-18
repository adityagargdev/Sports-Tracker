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

  const isActive = (path) => location.pathname === path;

  const links = user?.role === 'athlete' ? [
    { to: '/dashboard', label: 'Dashboard', icon: '⚡' },
    { to: '/log-session', label: 'Log Session', icon: '📝' },
    { to: '/goals', label: 'Goals', icon: '🎯' },
    { to: '/workouts', label: 'Workouts', icon: '🏋️' },
    { to: '/link-coach', label: 'My Coach', icon: '🤝' },
  ] : user?.role === 'coach' ? [
    { to: '/dashboard', label: 'Dashboard', icon: '⚡' },
    { to: '/coach', label: 'My Athletes', icon: '👥' },
  ] : [
    { to: '/dashboard', label: 'Dashboard', icon: '⚡' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
          background: rgba(15, 15, 20, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 107, 53, 0.15);
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          letter-spacing: 2px;
          color: #FF6B35;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          text-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
          white-space: nowrap;
        }

        .nav-logo span {
          color: #FFB627;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-link {
          position: relative;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }

        .nav-link.active {
          color: #FF6B35;
          background: rgba(255, 107, 53, 0.1);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: #FF6B35;
          border-radius: 2px;
          box-shadow: 0 0 8px #FF6B35;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.35rem 0.75rem;
        }

        .nav-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B35, #FFB627);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #0f0f14;
          flex-shrink: 0;
        }

        .nav-user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .nav-user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
        }

        .nav-user-role {
          font-size: 0.7rem;
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nav-logout {
          background: transparent;
          border: 1px solid rgba(255, 107, 53, 0.35);
          color: #FF6B35;
          padding: 0.4rem 0.9rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .nav-logout:hover {
          background: #FF6B35;
          color: #0f0f14;
          box-shadow: 0 0 16px rgba(255,107,53,0.4);
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 1001;
        }

        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s;
        }

        .hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
          background: #FF6B35;
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
          background: #FF6B35;
        }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: #13131c;
          border-bottom: 1px solid rgba(255,107,53,0.15);
          padding: 1rem 1.5rem 1.5rem;
          gap: 0.25rem;
          position: sticky;
          top: 64px;
          z-index: 999;
          box-shadow: 0 8px 30px rgba(0,0,0,0.5);
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.7rem 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: color 0.2s;
        }

        .mobile-link:hover, .mobile-link.active {
          color: #FF6B35;
        }

        .mobile-link .link-icon {
          font-size: 1rem;
        }

        .mobile-footer {
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mobile-user {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: rgba(255,255,255,0.7);
          font-size: 0.88rem;
        }

        .mobile-logout {
          width: 100%;
          background: rgba(255,107,53,0.1);
          border: 1px solid rgba(255,107,53,0.4);
          color: #FF6B35;
          padding: 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }

        .mobile-logout:hover {
          background: #FF6B35;
          color: #0f0f14;
        }

        @media (max-width: 768px) {
          .nav-links, .nav-right { display: none !important; }
          .hamburger { display: flex !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>

      <nav className="nav-root">
        {/* Logo */}
        <Link to="/dashboard" className="nav-logo">
          🔥 SPORT<span>TRACKER</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${isActive(l.to) ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="nav-right">
          <div className="nav-user">
            <div className="nav-user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="nav-user-info">
              <span className="nav-user-name">{user?.name}</span>
              <span className="nav-user-role">{user?.role}</span>
            </div>
          </div>
          <button className="nav-logout" onClick={handleLogout}>Logout</button>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`mobile-link ${isActive(l.to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="link-icon">{l.icon}</span>
              {l.label}
            </Link>
          ))}
          <div className="mobile-footer">
            <div className="mobile-user">
              <div className="nav-user-avatar" style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6B35, #FFB627)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, color: '#0f0f14'
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <span>{user?.name} · <span style={{ color: '#FF6B35' }}>{user?.role}</span></span>
            </div>
            <button className="mobile-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;