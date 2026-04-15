import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AthleteView = () => {
  const { athleteId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [comment, setComment] = useState('');
  const [goalForm, setGoalForm] = useState({
    title: '', targetValue: '', currentValue: '0', unit: '', deadline: ''
  });
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`/coach/athletes/${athleteId}/sessions`);
        setSessions(res.data.sessions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [athleteId]);

  const handleComment = async (sessionId) => {
    try {
      await axios.post(`/coach/sessions/${sessionId}/comment`, { comment });
      setMessage('Comment added!');
      setComment('');
      setActiveSession(null);
      const res = await axios.get(`/coach/athletes/${athleteId}/sessions`);
      setSessions(res.data.sessions);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to add comment');
    }
  };

  const handleAssignGoal = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/coach/athletes/${athleteId}/goals`, {
        ...goalForm,
        targetValue: Number(goalForm.targetValue),
        currentValue: Number(goalForm.currentValue)
      });
      setMessage('Goal assigned successfully!');
      setGoalForm({ title: '', targetValue: '', currentValue: '0', unit: '', deadline: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to assign goal');
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.6rem', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box'
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

        <h1 style={{ color: '#1a1a2e', marginBottom: '1.5rem' }}>👤 Athlete Sessions</h1>

        {message && (
          <div style={{
            background: '#dcfce7', color: '#16a34a',
            padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem'
          }}>{message}</div>
        )}

        {/* Assign Goal */}
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>🎯 Assign Goal to Athlete</h2>
          <form onSubmit={handleAssignGoal}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Goal Title *</label>
                <input required placeholder="Run 50km this week" value={goalForm.title}
                  onChange={e => setGoalForm({ ...goalForm, title: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Unit *</label>
                <input required placeholder="km, sessions..." value={goalForm.unit}
                  onChange={e => setGoalForm({ ...goalForm, unit: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Target Value *</label>
                <input required type="number" placeholder="50" value={goalForm.targetValue}
                  onChange={e => setGoalForm({ ...goalForm, targetValue: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500' }}>Deadline *</label>
                <input required type="date" value={goalForm.deadline}
                  onChange={e => setGoalForm({ ...goalForm, deadline: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <button type="submit" style={{
              padding: '0.75rem 2rem', background: '#a855f7',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
            }}>Assign Goal</button>
          </form>
        </div>

        {/* Sessions */}
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>Training Sessions</h2>
          {sessions.length === 0 ? (
            <p style={{ color: '#666' }}>This athlete has no sessions yet.</p>
          ) : (
            sessions.map(session => (
              <div key={session._id} style={{
                border: '1px solid #e5e7eb', borderRadius: '10px',
                padding: '1.25rem', marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{
                      background: '#dbeafe', color: '#1d4ed8',
                      padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem'
                    }}>{session.workoutType?.name}</span>
                    <div style={{ marginTop: '0.5rem', color: '#1a1a2e', fontWeight: '500' }}>
                      {new Date(session.date).toLocaleDateString()} · {session.duration} mins · {session.metrics.caloriesBurned} kcal
                    </div>
                    {session.notes && (
                      <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        📝 {session.notes}
                      </div>
                    )}
                    {session.coachComment && (
                      <div style={{
                        background: '#fef3c7', padding: '0.5rem 0.75rem',
                        borderRadius: '6px', marginTop: '0.5rem', fontSize: '0.9rem'
                      }}>
                        💬 Coach: {session.coachComment}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveSession(activeSession === session._id ? null : session._id)}
                    style={{
                      padding: '0.4rem 0.75rem', background: '#f0f4f8',
                      border: '1px solid #d1d5db', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '0.85rem'
                    }}>
                    💬 Comment
                  </button>
                </div>

                {activeSession === session._id && (
                  <div style={{ marginTop: '1rem' }}>
                    <textarea
                      rows="2"
                      placeholder="Add coaching feedback..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                    <button
                      onClick={() => handleComment(session._id)}
                      style={{
                        marginTop: '0.5rem', padding: '0.5rem 1rem',
                        background: '#4ade80', border: 'none',
                        borderRadius: '6px', cursor: 'pointer',
                        fontWeight: '600', color: '#1a1a2e'
                      }}>
                      Save Comment
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AthleteView;