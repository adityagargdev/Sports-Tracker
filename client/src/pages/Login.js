import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
          Login
        </button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <span style={{ color: '#888' }}>or</span>
      </div>
      
        <a href="https://sports-tracker-api-1rn8.onrender.com/api/auth/google"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem', width: '100%', padding: '0.6rem',
          border: '1px solid #ddd', borderRadius: '6px',
          textDecoration: 'none', color: '#333', background: 'white',
          fontWeight: '500', cursor: 'pointer', boxSizing: 'border-box'
        }}
      >
        <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="Google" />
        Sign in with Google
      </a>
    </div>
  );
};

export default Login;