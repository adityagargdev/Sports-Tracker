import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', targetValue: '',
    currentValue: '', unit: '', deadline: ''
  });
  const [error, setError] = useState('');

  const fetchGoals = async () => {
    const res = await axios.get('/goals');
    setGoals(res.data.goals);
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/goals', {
        ...form,
        targetValue: Number(form.targetValue),
        currentValue: Number(form.currentValue)
      });
      setForm({ title: '', description: '', targetValue: '', currentValue: '', unit: '', deadline: '' });
      fetchGoals();
    } catch (err) {
      setError('Failed to create goal.');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/goals/${id}`);
    fetchGoals();
  };

  const handleUpdateProgress = async (goal) => {
    const newValue = prompt(`Update progress for "${goal.title}" (current: ${goal.currentValue} ${goal.unit}):`);
    if (newValue === null) return;
    await axios.patch(`/goals/${goal._id}`, { currentValue: Number(newValue) });
    fetchGoals();
  };

  const inputStyle = {
    width: '100%', padding: '0.6rem', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>

        {/* Add Goal Form */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>🎯 Add New Goal</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Goal Title *</label>
                <input required placeholder="Run 100km this month" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Unit *</label>
                <input required placeholder="km, sessions, kg..." value={form.unit}
                  onChange={e => setForm({ ...form, unit: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Target Value *</label>
                <input required type="number" placeholder="100" value={form.targetValue}
                  onChange={e => setForm({ ...form, targetValue: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Current Value</label>
                <input type="number" placeholder="0" value={form.currentValue}
                  onChange={e => setForm({ ...form, currentValue: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Deadline *</label>
                <input required type="date" value={form.deadline}
                  onChange={e => setForm({ ...form, deadline: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Description</label>
                <input placeholder="Optional description" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <button type="submit" style={{
              padding: '0.75rem 2rem', background: '#a855f7', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '1rem',
              fontWeight: '600', cursor: 'pointer'
            }}>Add Goal</button>
          </form>
        </div>

        {/* Goals List */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>Your Goals</h2>
          {goals.length === 0 ? (
            <p style={{ color: '#666' }}>No goals yet. Add your first goal above!</p>
          ) : (
            goals.map(goal => {
              const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
              return (
                <div key={goal._id} style={{
                  border: '1px solid #e5e7eb', borderRadius: '10px',
                  padding: '1.25rem', marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem', color: '#1a1a2e' }}>{goal.title}</h3>
                      {goal.description && <p style={{ margin: '0 0 0.75rem', color: '#666', fontSize: '0.9rem' }}>{goal.description}</p>}
                    </div>
                    <span style={{
                      background: goal.status === 'active' ? '#dbeafe' : '#dcfce7',
                      color: goal.status === 'active' ? '#1d4ed8' : '#16a34a',
                      padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem'
                    }}>{goal.status}</span>
                  </div>
                  <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '10px', marginBottom: '0.5rem' }}>
                    <div style={{
                      background: progress === 100 ? '#4ade80' : '#a855f7',
                      width: `${progress}%`, height: '100%',
                      borderRadius: '999px', transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#666', fontSize: '0.85rem' }}>
                      {goal.currentValue} / {goal.targetValue} {goal.unit} · {Math.round(progress)}% · Due {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleUpdateProgress(goal)} style={{
                        padding: '0.3rem 0.75rem', background: '#4ade80',
                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
                      }}>Update</button>
                      <button onClick={() => handleDelete(goal._id)} style={{
                        padding: '0.3rem 0.75rem', background: '#ef4444',
                        color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
                      }}>Delete</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;