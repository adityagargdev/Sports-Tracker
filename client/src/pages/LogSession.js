import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LogSession = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    workoutType: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    caloriesBurned: '',
    distance: '',
    reps: '',
    sets: '',
    weight: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('/workouts').then(res => setWorkouts(res.data.workouts));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/sessions', {
        workoutType: form.workoutType,
        date: form.date,
        duration: Number(form.duration),
        metrics: {
          caloriesBurned: Number(form.caloriesBurned),
          distance: Number(form.distance),
          reps: Number(form.reps),
          sets: Number(form.sets),
          weight: Number(form.weight)
        },
        notes: form.notes
      });
      setSuccess('Session logged successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Failed to log session. Make sure you have a workout type created.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>🏋️ Log Training Session</h2>
          {error && <p style={{ color: 'red', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px' }}>{error}</p>}
          {success && <p style={{ color: 'green', background: '#dcfce7', padding: '0.75rem', borderRadius: '8px' }}>{success}</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Workout Type *</label>
              <select
                required
                value={form.workoutType}
                onChange={e => setForm({ ...form, workoutType: e.target.value })}
                style={inputStyle}
              >
                <option value="">Select workout type</option>
                {workouts.map(w => (
                  <option key={w._id} value={w._id}>{w.name} ({w.category})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Date *</label>
                <input type="date" required value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Duration (mins) *</label>
                <input type="number" required placeholder="45" value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })} style={inputStyle} />
              </div>
            </div>

            <h4 style={{ color: '#666', marginBottom: '0.75rem' }}>Metrics (optional)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Calories Burned</label>
                <input type="number" placeholder="350" value={form.caloriesBurned}
                  onChange={e => setForm({ ...form, caloriesBurned: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Distance (km)</label>
                <input type="number" placeholder="5" value={form.distance}
                  onChange={e => setForm({ ...form, distance: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Reps</label>
                <input type="number" placeholder="12" value={form.reps}
                  onChange={e => setForm({ ...form, reps: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Sets</label>
                <input type="number" placeholder="3" value={form.sets}
                  onChange={e => setForm({ ...form, sets: e.target.value })} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Notes</label>
              <textarea rows="3" placeholder="How did it go?" value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <button type="submit" style={{
              width: '100%', padding: '0.75rem',
              background: '#4ade80', color: '#1a1a2e',
              border: 'none', borderRadius: '8px',
              fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
            }}>Log Session</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogSession;