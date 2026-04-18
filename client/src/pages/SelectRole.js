import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SelectRole = () => {
  const { setRole } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await setRole(selected);
      navigate('/dashboard');
    } catch {
      setError('Failed to set role. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Welcome! 👋</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Are you joining as an athlete or a coach?</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          {['athlete', 'coach'].map(role => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              style={{
                flex: 1, padding: '1.2rem', borderRadius: '10px', border: '2px solid',
                borderColor: selected === role ? '#4f46e5' : '#e5e7eb',
                backgroundColor: selected === role ? '#eef2ff' : 'white',
                color: selected === role ? '#4f46e5' : '#374151',
                fontWeight: '600', fontSize: '1rem', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {role === 'athlete' ? '🏃 Athlete' : '📋 Coach'}
            </button>
          ))}
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={!selected || loading}
          style={{
            width: '100%', padding: '0.9rem', borderRadius: '8px', border: 'none',
            backgroundColor: selected ? '#4f46e5' : '#d1d5db',
            color: 'white', fontWeight: '600', fontSize: '1rem',
            cursor: selected ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Saving...' : 'Continue →'}
        </button>
      </div>
    </div>
  );
};

export default SelectRole;