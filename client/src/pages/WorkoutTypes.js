import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const WorkoutTypes = () => {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'cardio', description: '' });
  const [error, setError] = useState('');

  const fetchWorkouts = async () => {
    const res = await axios.get('/workouts');
    setWorkouts(res.data.workouts);
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/workouts', form);
      setForm({ name: '', category: 'cardio', description: '' });
      fetchWorkouts();
    } catch (err) {
      setError('Failed to create workout type.');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/workouts/${id}`);
    fetchWorkouts();
  };

  const categoryColors = {
    cardio: '#60a5fa',
    strength: '#f97316',
    flexibility: '#4ade80',
    sports: '#a855f7',
    other: '#94a3b8'
  };

  const inputStyle = {
    width: '100%', padding: '0.6rem', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>

        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>💪 Add Workout Type</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Name *</label>
                <input required placeholder="Running" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Category *</label>
                <select value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Description</label>
              <input placeholder="Optional description" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} style={inputStyle} />
            </div>
            <button type="submit" style={{
              padding: '0.75rem 2rem', background: '#60a5fa', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '1rem',
              fontWeight: '600', cursor: 'pointer'
            }}>Add Workout Type</button>
          </form>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>Your Workout Types</h2>
          {workouts.length === 0 ? (
            <p style={{ color: '#666' }}>No workout types yet. Add one above!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {workouts.map(w => (
                <div key={w._id} style={{
                  border: `2px solid ${categoryColors[w.category]}`,
                  borderRadius: '10px', padding: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#1a1a2e' }}>{w.name}</h3>
                    <button onClick={() => handleDelete(w._id)} style={{
                      background: '#ef4444', color: 'white', border: 'none',
                      borderRadius: '6px', padding: '0.2rem 0.6rem', cursor: 'pointer'
                    }}>✕</button>
                  </div>
                  <span style={{
                    background: categoryColors[w.category], color: 'white',
                    padding: '0.2rem 0.6rem', borderRadius: '999px',
                    fontSize: '0.8rem', marginTop: '0.5rem', display: 'inline-block'
                  }}>{w.category}</span>
                  {w.description && <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.9rem' }}>{w.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutTypes;