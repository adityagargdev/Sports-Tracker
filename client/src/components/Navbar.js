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
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/log-session', label: 'Log Session' },
    { to: '/goals', label: 'Goals' },
    { to: '/workouts', label: 'Workouts' },
    { to: '/link-coach', label: 'My Coach' },
  ] : user?.role === 'coach' ? [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/coach', label: 'Athletes' },
  ] : [
    { to: '/dashboard', label: 'Dashboard' },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    .nav-root {
      font-family: 'Inter', sans-serif;
      background: rgba(10,10,15,0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding: 0 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 56px;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .nav-logo {
      font-size: 0.92rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: #fff;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-logo-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #818cf8;
      flex-shrink: 0;
    }
    .nav-links { display: flex; align-items: center; gap: 0.125rem; }
    .nav-link {
      color: rgba(255,255,255,0.42);
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 500;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }
    .nav-link:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.05); }
    .nav-link.active { color: #fff; background: rgba(129,140,248,0.12); }
    .nav-right { display: flex; align-items: center; gap: 0.75rem; }
    .nav-user { display: flex; align-items: center; gap: 0.5rem; }
    .nav-avatar {
      width: 26px; height: 26px; border-radius: 50%;
      background: linear-gradient(135deg,#818cf8,#6366f1);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.7rem; font-weight: 600; color: #fff; flex-shrink: 0;
    }
    .nav-user-name { font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.6); letter-spacing: -0.01em; }
    .nav-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.08); }
    .nav-logout {
      background: transparent; border: none;
      color: rgba(255,255,255,0.35); padding: 0.4rem 0.6rem; border-radius: 6px; cursor: pointer;
      font-size: 0.8rem; font-weight: 500; font-family: 'Inter',sans-serif;
      transition: color 0.15s, background 0.15s; letter-spacing: -0.01em;
    }
    .nav-logout:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.05); }
    .hamburger { display: none; flex-direction: column; gap: 5px; background: transparent; border: none; cursor: pointer; padding: 4px; }
    .hamburger span { display: block; width: 20px; height: 1.5px; background: rgba(255,255,255,0.6); border-radius: 2px; transition: all 0.25s; }
    .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); background: #818cf8; }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); background: #818cf8; }
    .mobile-menu {
      display: none; flex-direction: column;
      background: #0d0d14; border-bottom: 1px solid rgba(255,255,255,0.06);
      padding: 0.75rem 1.75rem 1.25rem; position: sticky; top: 56px; z-index: 999;
    }
    .mobile-link {
      display: block; color: rgba(255,255,255,0.5); text-decoration: none;
      font-size: 0.88rem; font-weight: 500; padding: 0.65rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      transition: color 0.15s; letter-spacing: -0.01em;
    }
    .mobile-link:hover, .mobile-link.active { color: #fff; }
    .mobile-footer { padding-top: 1rem; display: flex; align-items: center; justify-content: space-between; }
    .mobile-user { display: flex; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.5); font-size: 0.82rem; font-family: 'Inter',sans-serif; }
    .mobile-logout {
      background: transparent; border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5); padding: 0.45rem 1rem; border-radius: 6px;
      cursor: pointer; font-size: 0.82rem; font-family: 'Inter',sans-serif; font-weight: 500; transition: all 0.15s;
    }
    .mobile-logout:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
    @media (max-width: 768px) {
      .nav-links, .nav-right { display: none !important; }
      .hamburger { display: flex !important; }
      .mobile-menu { display: flex !important; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <nav className="nav-root">
        <Link to="/dashboard" className="nav-logo">
          <span className="nav-logo-dot" />
          SportsPro
        </Link>
        <div className="nav-links">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          <div className="nav-user">
            <div className="nav-avatar">{user?.name?.charAt(0)?.toUpperCase() || '?'}</div>
            <span className="nav-user-name">{user?.name}</span>
          </div>
          <div className="nav-divider" />
          <button className="nav-logout" onClick={handleLogout}>Sign out</button>
        </div>
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>
      {menuOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`mobile-link ${isActive(l.to) ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="mobile-footer">
            <div className="mobile-user">
              <div style={{ width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,#818cf8,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:600,color:'#fff',flexShrink:0 }}>
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              {user?.name}
            </div>
            <button className="mobile-logout" onClick={handleLogout}>Sign out</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
