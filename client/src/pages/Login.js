import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const cssAnim = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes cardIn { from { opacity:0; transform:translateY(24px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #1e1e2e inset !important; -webkit-text-fill-color: #fff !important; }
`;

const S = {
  page: { minHeight: '100vh', background: '#0f0f14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", padding: '1rem' },
  card: { width: '100%', maxWidth: '400px', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2.5rem', animation: 'cardIn .5s cubic-bezier(.34,1.2,.64,1)' },
  logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#FF6B35', letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'block' },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '42px', color: '#fff', margin: '0 0 4px', letterSpacing: '0.02em' },
  sub: { fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: '0 0 2rem' },
  label: { fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: '1rem', transition: 'border-color .2s' },
  btn: { width: '100%', padding: '13px', background: '#FF6B35', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginBottom: '12px', transition: 'background .2s' },
  googleBtn: { width: '100%', padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', boxSizing: 'border-box', transition: 'background .2s' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '1rem 0' },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' },
  dividerText: { fontSize: '12px', color: 'rgba(255,255,255,0.3)' },
  error: { background: 'rgba(226,75,74,0.12)', border: '1px solid rgba(226,75,74,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#E24B4A', fontSize: '13px', marginBottom: '1rem', animation: 'shake .4s ease' },
  footer: { marginTop: '1.5rem', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)' },
  link: { color: '#FF6B35', textDecoration: 'none', fontWeight: 600 },
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <style>{cssAnim}</style>
      <div style={S.card}>
        <span style={S.logo}>SportsPro</span>
        <h1 style={S.title}>Welcome Back.</h1>
        <p style={S.sub}>Track your performance, crush your goals.</p>

        {error && <div style={S.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={S.label}>Email</label>
          <input
            style={S.input}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            required
          />
          <label style={S.label}>Password</label>
          <input
            style={S.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            required
          />
          <button
            type="submit"
            style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => e.target.style.background = '#e85e28'}
            onMouseLeave={e => e.target.style.background = '#FF6B35'}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>or</span>
          <div style={S.dividerLine} />
        </div>

        <a
          href="https://sports-tracker-api-1rn8.onrender.com/api/auth/google"
          style={S.googleBtn}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="Google" style={{ borderRadius: '2px' }} />
          Continue with Google
        </a>

        <p style={S.footer}>
          No account?{' '}
          <Link to="/register" style={S.link}>Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;