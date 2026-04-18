import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AthleteView = () => {
  const { athleteId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [comment, setComment] = useState('');
  const [goalForm, setGoalForm] = useState({
    title: '', targetValue: '', currentValue: '0', unit: '', deadline: ''
  });
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [submittingGoal, setSubmittingGoal] = useState(false);

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

  useEffect(() => { fetchSessions(); }, [athleteId]);

  const showMsg = (text, type = 'success') => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleComment = async (sessionId) => {
    try {
      await axios.post(`/coach/sessions/${sessionId}/comment`, { comment });
      showMsg('Comment added!');
      setComment('');
      setActiveSession(null);
      fetchSessions();
    } catch (err) {
      showMsg('Failed to add comment', 'error');
    }
  };

  const handleAssignGoal = async (e) => {
    e.preventDefault();
    setSubmittingGoal(true);
    try {
      await axios.post(`/coach/athletes/${athleteId}/goals`, {
        ...goalForm,
        targetValue: Number(goalForm.targetValue),
        currentValue: Number(goalForm.currentValue)
      });
      showMsg('Goal assigned successfully!');
      setGoalForm({ title: '', targetValue: '', currentValue: '0', unit: '', deadline: '' });
    } catch (err) {
      showMsg('Failed to assign goal', 'error');
    } finally {
      setSubmittingGoal(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f0f14' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(255,107,53,0.15)', borderTop: '3px solid #FF6B35', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        .av-root { min-height: 100vh; background: #0f0f14; font-family: 'DM Sans', sans-serif; color: #fff; }
        .av-body { max-width: 960px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .av-header { margin-bottom: 2rem; animation: fadeUp 0.45s ease both; display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .av-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 5vw, 2.8rem); letter-spacing: 2px; margin: 0 0 0.2rem; line-height: 1; }
        .av-header h1 span { color: #00B4D8; text-shadow: 0 0 24px rgba(0,180,216,0.4); }
        .av-header p { color: rgba(255,255,255,0.35); font-size: 0.88rem; margin: 0; }

        .btn-back {
          background: transparent; border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.45); padding: 0.45rem 1rem; border-radius: 8px;
          font-size: 0.82rem; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-back:hover { border-color: rgba(255,255,255,0.25); color: #fff; }

        /* Toast */
        .av-toast {
          border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.875rem;
          margin-bottom: 1.25rem; font-weight: 500; animation: slideDown 0.3s ease;
        }
        .av-toast.success { background: rgba(46,204,113,0.1); border: 1px solid rgba(46,204,113,0.3); color: #2ECC71; }
        .av-toast.error   { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.3);  color: #f87171; animation: shake 0.4s ease; }

        /* Panel */
        .av-panel { background: #1a1a24; border-radius: 16px; padding: 1.75rem 2rem; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 40px rgba(0,0,0,0.3); margin-bottom: 1.5rem; animation: fadeUp 0.45s ease both; }
        .av-panel:nth-child(3) { animation-delay: 0.05s; }
        .av-panel:nth-child(4) { animation-delay: 0.1s; }

        .panel-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.15rem; letter-spacing: 1.5px; color: rgba(255,255,255,0.75); margin: 0 0 1.5rem; }

        /* Goal form */
        .goal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .form-field { display: flex; flex-direction: column; }
        .form-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.4); margin-bottom: 0.4rem; }
        .form-input {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 0.7rem 0.9rem; font-size: 0.92rem;
          font-family: 'DM Sans', sans-serif; color: #fff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.18); }
        .form-input:focus {
          border-color: rgba(0,180,216,0.45);
          box-shadow: 0 0 0 3px rgba(0,180,216,0.08);
          background: rgba(0,180,216,0.03);
        }
        .form-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }

        .btn-assign {
          padding: 0.8rem 2rem; background: linear-gradient(135deg, #00B4D8, #2ECC71);
          color: #0f0f14; border: none; border-radius: 10px; font-size: 0.9rem;
          font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(0,180,216,0.25);
        }
        .btn-assign:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-assign:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Session cards */
        .session-card {
          border: 1px solid rgba(255,255,255,0.07); border-radius: 14px;
          padding: 1.25rem; margin-bottom: 0.85rem;
          background: rgba(255,255,255,0.02); transition: border-color 0.2s;
        }
        .session-card:hover { border-color: rgba(255,255,255,0.12); }

        .session-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; }

        .workout-badge {
          display: inline-block; background: rgba(255,107,53,0.12);
          color: #FF6B35; border: 1px solid rgba(255,107,53,0.25);
          padding: 0.2rem 0.65rem; border-radius: 999px;
          font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;
        }

        .session-stats { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.35rem; }
        .session-stat { font-size: 0.82rem; color: rgba(255,255,255,0.45); }
        .session-stat strong { color: rgba(255,255,255,0.75); font-weight: 600; }

        .session-notes { font-size: 0.82rem; color: rgba(255,255,255,0.3); margin-top: 0.4rem; font-style: italic; }

        .coach-comment {
          background: rgba(255,182,39,0.07); border: 1px solid rgba(255,182,39,0.15);
          border-radius: 8px; padding: 0.6rem 0.85rem; margin-top: 0.6rem;
          font-size: 0.82rem; color: rgba(255,255,255,0.6);
        }
        .coach-comment span { color: #FFB627; font-weight: 600; }

        .btn-comment {
          flex-shrink: 0; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);
          padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.8rem;
          font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s;
        }
        .btn-comment:hover { border-color: rgba(255,182,39,0.35); color: #FFB627; }
        .btn-comment.active { border-color: rgba(255,182,39,0.35); color: #FFB627; background: rgba(255,182,39,0.06); }

        /* Comment box */
        .comment-box { margin-top: 1rem; animation: slideDown 0.2s ease; }
        .comment-textarea {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,182,39,0.25); border-radius: 10px;
          padding: 0.75rem; font-size: 0.875rem; font-family: 'DM Sans', sans-serif;
          color: #fff; resize: vertical; outline: none; min-height: 70px;
          transition: border-color 0.2s;
        }
        .comment-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .comment-textarea:focus { border-color: rgba(255,182,39,0.5); box-shadow: 0 0 0 3px rgba(255,182,39,0.08); }

        .btn-save-comment {
          margin-top: 0.5rem; padding: 0.5rem 1.25rem;
          background: rgba(255,182,39,0.1); border: 1px solid rgba(255,182,39,0.3);
          color: #FFB627; border-radius: 8px; font-size: 0.85rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s;
        }
        .btn-save-comment:hover { background: rgba(255,182,39,0.2); }

        .empty-state { text-align: center; padding: 2.5rem 0; color: rgba(255,255,255,0.25); font-size: 0.9rem; }

        @media (max-width: 600px) {
          .goal-grid { grid-template-columns: 1fr; }
          .av-panel { padding: 1.25rem; }
          .av-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="av-root">
        <Navbar />
        <div className="av-body">

          <div className="av-header">
            <div>
              <h1>ATHLETE <span>VIEW</span></h1>
              <p>Review sessions and assign goals to this athlete.</p>
            </div>
            <button className="btn-back" onClick={() => navigate('/coach')}>← Back</button>
          </div>

          {message && <div className={`av-toast ${msgType}`}>{message}</div>}

          {/* Assign Goal */}
          <div className="av-panel">
            <div className="panel-title">🎯 Assign Goal</div>
            <form onSubmit={handleAssignGoal}>
              <div className="goal-grid">
                <div className="form-field">
                  <label className="form-label">Goal Title *</label>
                  <input required className="form-input" placeholder="Run 50km this week"
                    value={goalForm.title} onChange={e => setGoalForm({ ...goalForm, title: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Unit *</label>
                  <input required className="form-input" placeholder="km, sessions..."
                    value={goalForm.unit} onChange={e => setGoalForm({ ...goalForm, unit: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Target Value *</label>
                  <input required type="number" className="form-input" placeholder="50"
                    value={goalForm.targetValue} onChange={e => setGoalForm({ ...goalForm, targetValue: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Deadline *</label>
                  <input required type="date" className="form-input"
                    value={goalForm.deadline} onChange={e => setGoalForm({ ...goalForm, deadline: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-assign" disabled={submittingGoal}>
                {submittingGoal ? 'Assigning...' : '🎯 Assign Goal'}
              </button>
            </form>
          </div>

          {/* Sessions */}
          <div className="av-panel">
            <div className="panel-title">
              🏃 Training Sessions
              <span style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', fontWeight: 500, color: 'rgba(255,255,255,0.25)', letterSpacing: 0, textTransform: 'none', marginLeft: '0.75rem' }}>
                {sessions.length} total
              </span>
            </div>

            {sessions.length === 0 ? (
              <div className="empty-state">This athlete has no sessions logged yet.</div>
            ) : (
              sessions.map(session => (
                <div key={session._id} className="session-card">
                  <div className="session-top">
                    <div style={{ flex: 1 }}>
                      <span className="workout-badge">{session.workoutType?.name || 'Unknown'}</span>
                      <div className="session-stats">
                        <span className="session-stat">
                          📅 <strong>{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
                        </span>
                        <span className="session-stat">
                          ⏱ <strong style={{ color: '#00B4D8' }}>{session.duration} mins</strong>
                        </span>
                        <span className="session-stat">
                          🔥 <strong style={{ color: '#FF6B35' }}>{session.metrics.caloriesBurned} kcal</strong>
                        </span>
                      </div>
                      {session.notes && (
                        <div className="session-notes">📝 {session.notes}</div>
                      )}
                      {session.coachComment && (
                        <div className="coach-comment">
                          <span>Coach:</span> {session.coachComment}
                        </div>
                      )}
                    </div>
                    <button
                      className={`btn-comment ${activeSession === session._id ? 'active' : ''}`}
                      onClick={() => setActiveSession(activeSession === session._id ? null : session._id)}
                    >
                      💬 {session.coachComment ? 'Edit' : 'Comment'}
                    </button>
                  </div>

                  {activeSession === session._id && (
                    <div className="comment-box">
                      <textarea
                        className="comment-textarea"
                        placeholder="Add coaching feedback..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                      />
                      <button className="btn-save-comment" onClick={() => handleComment(session._id)}>
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
    </>
  );
};

export default AthleteView;