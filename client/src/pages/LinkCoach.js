import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const LinkCoach = () => {
  const [code, setCode] = useState('');
  const [myCoach, setMyCoach] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/coach/my-coach')
      .then(res => setMyCoach(res.data.coach))
      .catch(() => {});
  }, []);

  const handleLink = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/coach/link', { coachCode: code });
      setMessage(res.data.message);
      const coachRes = await axios.get('/coach/my-coach');
      setMyCoach(coachRes.data.coach);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to link coach');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '0 1rem' }}>

        {myCoach && (
          <div style={{
            background: 'white', borderRadius: '12px',
            padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem', borderLeft: '4px solid #4ade80'
          }}>
            <h3 style={{ marginTop: 0, color: '#16a34a' }}>✅ Your Coach</h3>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{myCoach.name}</div>
            <div style={{ color: '#666' }}>{myCoach.email}</div>
          </div>
        )}

        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>🔗 Link to a Coach</h2>
          <p style={{ color: '#666' }}>Enter the code your coach gave you to link your account.</p>

          {message && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{message}</div>}
          {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleLink}>
            <input
              required
              placeholder="Enter coach code (e.g. AB12CD34)"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '2px solid #d1d5db', fontSize: '1.2rem',
                letterSpacing: '0.2rem', textAlign: 'center',
                boxSizing: 'border-box', marginBottom: '1rem'
              }}
            />
            <button type="submit" style={{
              width: '100%', padding: '0.75rem',
              background: '#1a1a2e', color: 'white',
              border: 'none', borderRadius: '8px',
              fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
            }}>Link to Coach</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkCoach;