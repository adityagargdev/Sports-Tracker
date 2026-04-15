import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CoachDashboard = () => {
  const [athletes, setAthletes] = useState([]);
  const [coachCode, setCoachCode] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const res = await axios.get('/coach/athletes');
        setAthletes(res.data.athletes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAthletes();
  }, []);

  const generateCode = async () => {
    try {
      const res = await axios.post('/coach/generate-code');
      setCoachCode(res.data.coachCode);
    } catch (err) {
      alert('Failed to generate code');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>

        <h1 style={{ color: '#1a1a2e', marginBottom: '1.5rem' }}>🏆 Coach Dashboard</h1>

        {/* Coach Code Section */}
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>Your Coach Code</h2>
          <p style={{ color: '#666' }}>
            Share this code with athletes so they can link to you.
          </p>
          {coachCode ? (
            <div style={{
              background: '#1a1a2e', color: '#4ade80',
              padding: '1rem 2rem', borderRadius: '8px',
              fontSize: '2rem', fontWeight: 'bold',
              letterSpacing: '0.3rem', display: 'inline-block',
              marginBottom: '1rem'
            }}>
              {coachCode}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              No code generated yet.
            </p>
          )}
          <br />
          <button onClick={generateCode} style={{
            padding: '0.75rem 2rem', background: '#4ade80',
            color: '#1a1a2e', border: 'none', borderRadius: '8px',
            fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
          }}>
            {coachCode ? 'Regenerate Code' : 'Generate Code'}
          </button>
        </div>

        {/* Athletes List */}
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>
            Your Athletes ({athletes.length})
          </h2>
          {athletes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <p>No athletes linked yet.</p>
              <p>Generate a code above and share it with your athletes!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {athletes.map(athlete => (
                <div key={athlete._id} style={{
                  border: '1px solid #e5e7eb', borderRadius: '10px',
                  padding: '1.25rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                  ':hover': { borderColor: '#4ade80' }
                }}
                  onClick={() => navigate(`/coach/athlete/${athlete._id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: '#4ade80', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a2e'
                    }}>
                      {athlete.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1a1a2e' }}>{athlete.name}</div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>{athlete.email}</div>
                    </div>
                  </div>
                  <button style={{
                    marginTop: '1rem', width: '100%',
                    padding: '0.5rem', background: '#1a1a2e',
                    color: 'white', border: 'none', borderRadius: '6px',
                    cursor: 'pointer', fontSize: '0.9rem'
                  }}>
                    View Sessions & Goals →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;