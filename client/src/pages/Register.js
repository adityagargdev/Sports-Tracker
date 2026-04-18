import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const S = {
  page: {
    minHeight: '100vh', background: '#0f0f14', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif", padding: '1rem',
  },
  card: {
    width: '100%', maxWidth: '420px', background: '#1a1a24',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
    padding: '2.5rem', animation: 'cardIn .5s cubic-bezier(.34,1.2,.64,1)',
  },
  logo: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px',
    color: '#FF6B35', letterSpacing: '0.05em', marginBottom: '1.5rem',
    display: 'block',
  },
  title: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: '42px',
    color: '#fff', margin: '0 0 4px', letterSpacing: '0.02em',
  },
  sub: { fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: '0 0 2rem' },
  label: {
    fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: '6px', display: 'block',
  },
  input: {
    width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
    color: '#fff', fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
    outline: 'none', boxSizing: 'border-box', marginBottom: '1rem',
    transition: 'border-color .2s',
  },
  roleRow: { display: 'flex', gap: '10px', marginBottom: '1rem' },
  roleBtn: (active) => ({
    flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer',
    border: `1px solid ${active ? '#FF6B35' : 'rgba(255,255,255,0.1)'}`,
    background: active ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.04)',
    color: active ? '#FF6B35' : 'rgba(255,255,255,0.5)',
    fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600,
    transition: 'all .2s',
  }),
  btn: {
    width: '100%', padding: '13px', background: '#FF6B35', border: 'none',
    borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginTop: '4px',
    transition: 'transform .15s, background .2s',
  },
  error: {
    background: 'rgba(226,75,74,0.12)', border: '1px solid rgba(226,75,74,0.3)',
    borderRadius: '8px', padding: '10px 14px', color: '#E24B4A',
    fontSize: '13px', marginBottom: '1rem', animation: 'shake .4s ease',
  },
  success: {
    background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)',
    borderRadius: '8px', padding: '10px 14px', color: '#2ECC71',
    fontSize: '13px', marginBottom: '1rem', animation: 'successPop .4s cubic-bezier(.34,1.6,.64,1)',
  },
  footer: {
    marginTop: '1.5rem', textAlign: 'center', fontSize: '13px',
    color: 'rgba(255,255,255,0.35)',
  },
  link: { color: '#FF6B35', textDecoration: 'none', fontWeight: 600 },
};

const cssAnim = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes cardIn { from { opacity:0; transform:translateY(24px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  @keyframes successPop { from { opacity:0; transform:scale(.95) } to { opacity:1; transform:scale(1) } }
  input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #1e1e2e inset !important; -webkit-text-fill-color: #fff !important; }
`;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'athlete' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password, form.role);
      setSuccess(`Welcome, ${form.name}! Taking you to your dashboard...`);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <style>{cssAnim}</style>
      <div style={S.card}>
        <span style={S.logo}>⚡ SportsPro</span>
        <h1 style={S.title}>Join The Team.</h1>
        <p style={S.sub}>Create your free account and start tracking.</p>

        {error && <div style={S.error}>{error}</div>}
        {success && <div style={S.success}>✓ {success}</div>}

        <form onSubmit={handleSubmit}>
          <label style={S.label}>Full Name</label>
          <input
            style={S.input} type="text" placeholder="Aditya Garg"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            required
          />

          <label style={S.label}>Email</label>
          <input
            style={S.input} type="email" placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            required
          />

          <label style={S.label}>Password</label>
          <input
            style={S.input} type="password" placeholder="Min. 6 characters"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            required minLength={6}
          />

          <label style={S.label}>I am a...</label>
          <div style={S.roleRow}>
            <button type="button" style={S.roleBtn(form.role === 'athlete')}
              onClick={() => setForm({ ...form, role: 'athlete' })}>
              🏃 Athlete
            </button>
            <button type="button" style={S.roleBtn(form.role === 'coach')}
              onClick={() => setForm({ ...form, role: 'coach' })}>
              📋 Coach
            </button>
          </div>

          <button
            type="submit"
            style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => e.target.style.background = '#e85e28'}
            onMouseLeave={e => e.target.style.background = '#FF6B35'}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={S.footer}>
          Already have an account?{' '}
          <Link to="/login" style={S.link}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;