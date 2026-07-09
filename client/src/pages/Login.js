import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #111118 inset !important;
    -webkit-text-fill-color: #fff !important;
  }

  .login-page {
    min-height: 100vh;
    background: #0a0a0f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    padding: 1.5rem;
  }

  .login-card {
    width: 100%;
    max-width: 380px;
    animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .login-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
  }

  .login-brand-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #818cf8;
  }

  .login-brand-name {
    font-size: 0.92rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.02em;
  }

  .login-heading {
    font-size: 1.6rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 0 0 0.4rem;
  }

  .login-sub {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.38);
    margin: 0 0 2rem;
    font-weight: 400;
    line-height: 1.5;
  }

  .login-error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #f87171;
    font-size: 0.82rem;
    margin-bottom: 1.25rem;
    animation: shake 0.35s ease;
    line-height: 1.4;
  }

  .login-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.01em;
    margin-bottom: 0.4rem;
  }

  .login-input {
    width: 100%;
    padding: 0.7rem 0.875rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #fff;
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    outline: none;
    box-sizing: border-box;
    margin-bottom: 1rem;
    transition: border-color 0.15s;
  }

  .login-input::placeholder { color: rgba(255,255,255,0.2); }
  .login-input:focus { border-color: rgba(129,140,248,0.5); }

  .login-btn {
    width: 100%;
    padding: 0.75rem;
    background: #6366f1;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
    transition: background 0.15s, opacity 0.15s;
  }

  .login-btn:hover { background: #5558e3; }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1rem 0;
  }

  .login-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }

  .login-divider-text {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.2);
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .login-google {
    width: 100%;
    padding: 0.7rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: rgba(255,255,255,0.75);
    font-size: 0.875rem;
    font-weight: 400;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    text-decoration: none;
    box-sizing: border-box;
    transition: background 0.15s, border-color 0.15s;
    letter-spacing: -0.01em;
  }

  .login-google:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.14);
  }

  .login-footer {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.28);
  }

  .login-footer a {
    color: #818cf8;
    text-decoration: none;
    font-weight: 500;
  }

  .login-footer a:hover { color: #a5b4fc; }
`;

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
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{css}</style>
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-dot" />
          <span className="login-brand-name">SportsPro</span>
        </div>

        <h1 className="login-heading">Welcome back</h1>
        <p className="login-sub">Sign in to your account to continue.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="Your password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">OR</span>
          <div className="login-divider-line" />
        </div>

        <a
          href="https://sports-tracker-api-1rn8.onrender.com/api/auth/google"
          className="login-google"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </a>

        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
