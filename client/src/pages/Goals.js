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
  const [submitting, setSubmitting] = useState(false);
  const [updateModal, setUpdateModal] = useState(null); // { goal }
  const [updateValue, setUpdateValue] = useState('');
  const [newGoalId, setNewGoalId] = useState(null);

  const fetchGoals = async () => {
    const res = await axios.get('/goals');
    setGoals(res.data.goals);
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await axios.post('/goals', {
        ...form,
        targetValue: Number(form.targetValue),
        currentValue: Number(form.currentValue)
      });
      setNewGoalId(res.data.goal?._id || null);
      setForm({ title: '', description: '', targetValue: '', currentValue: '', unit: '', deadline: '' });
      fetchGoals();
      setTimeout(() => setNewGoalId(null), 1500);
    } catch (err) {
      setError('Failed to create goal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/goals/${id}`);
    fetchGoals();
  };

  const openUpdateModal = (goal) => {
    setUpdateModal(goal);
    setUpdateValue(String(goal.currentValue));
  };

  const handleUpdateProgress = async () => {
    if (!updateModal) return;
    await axios.patch(`/goals/${updateModal._id}`, { currentValue: Number(updateValue) });
    setUpdateModal(null);
    fetchGoals();
  };

  const activeCount = goals.filter(g => g.status === 'active').length;
  const completedCount = goals.filter(g => g.status === 'completed').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .goals-root {
          min-height: 100vh;
          background: #0f0f14;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        .goals-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 2.5rem 1.25rem 4rem;
        }

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

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes confettiBurst {
          0%   { transform: scale(1); box-shadow: 0 0 0 0 rgba(46,204,113,0.5); }
          50%  { box-shadow: 0 0 0 12px rgba(46,204,113,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46,204,113,0); }
        }

        /* Header */
        .goals-header {
          margin-bottom: 2rem;
          animation: fadeUp 0.45s ease both;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .goals-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          letter-spacing: 2px;
          margin: 0 0 0.2rem;
          line-height: 1;
        }

        .goals-header h1 span { color: #FFB627; text-shadow: 0 0 24px rgba(255,182,39,0.4); }

        .goals-header p {
          color: rgba(255,255,255,0.35);
          font-size: 0.88rem;
          margin: 0;
        }

        .goals-summary {
          display: flex;
          gap: 0.75rem;
        }

        .summary-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.5rem 0.9rem;
          text-align: center;
        }

        .summary-pill-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          line-height: 1;
          color: var(--pill-color, #fff);
        }

        .summary-pill-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(255,255,255,0.3);
          margin-top: 0.1rem;
        }

        /* Panel */
        .goals-panel {
          background: #1a1a24;
          border-radius: 16px;
          padding: 1.75rem 2rem;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
          animation: fadeUp 0.45s ease both;
        }

        .goals-panel:nth-child(2) { animation-delay: 0.05s; }
        .goals-panel:nth-child(3) { animation-delay: 0.1s; }

        .panel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.15rem;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.75);
          margin: 0 0 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Section label */
        .form-section {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.22);
          margin: 1.25rem 0 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-section::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        /* Error */
        .goals-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          border-radius: 10px;
          padding: 0.7rem 1rem;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
          animation: shake 0.4s ease;
        }

        /* Form grid */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-field { display: flex; flex-direction: column; }

        .form-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.4rem;
        }

        .form-input,
        .form-textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.7rem 0.9rem;
          font-size: 0.92rem;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }

        .form-input::placeholder { color: rgba(255,255,255,0.18); }

        .form-input:focus {
          border-color: rgba(255,182,39,0.45);
          box-shadow: 0 0 0 3px rgba(255,182,39,0.08);
          background: rgba(255,182,39,0.03);
        }

        .form-input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
        }

        .form-full { grid-column: 1 / -1; }

        /* Submit */
        .goals-submit {
          margin-top: 1.5rem;
          padding: 0.85rem 2rem;
          background: linear-gradient(135deg, #FFB627, #FF6B35);
          color: #0f0f14;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(255,182,39,0.25);
        }

        .goals-submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(255,182,39,0.4);
        }

        .goals-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Goal card */
        .goal-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.25rem 1.35rem;
          margin-bottom: 0.85rem;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.2s, transform 0.2s;
          animation: cardIn 0.4s ease both;
        }

        .goal-card:hover {
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-1px);
        }

        .goal-card.completed {
          border-color: rgba(46,204,113,0.2);
          animation: confettiBurst 0.6s ease both;
        }

        .goal-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.85rem;
          gap: 0.75rem;
        }

        .goal-title {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.2rem;
          line-height: 1.3;
        }

        .goal-desc {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          margin: 0;
          font-style: italic;
        }

        .goal-status {
          flex-shrink: 0;
          padding: 0.2rem 0.7rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .goal-status.active {
          background: rgba(0,180,216,0.12);
          color: #00B4D8;
          border: 1px solid rgba(0,180,216,0.25);
        }

        .goal-status.completed {
          background: rgba(46,204,113,0.12);
          color: #2ECC71;
          border: 1px solid rgba(46,204,113,0.25);
        }

        /* Progress */
        .goal-track {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          height: 7px;
          margin-bottom: 0.6rem;
          overflow: hidden;
        }

        .goal-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.6s cubic-bezier(0.25,1,0.5,1);
        }

        .goal-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .goal-meta {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
        }

        .goal-meta strong {
          color: rgba(255,255,255,0.6);
          font-weight: 600;
        }

        .goal-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-update {
          background: rgba(46,204,113,0.1);
          border: 1px solid rgba(46,204,113,0.3);
          color: #2ECC71;
          padding: 0.3rem 0.8rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-update:hover {
          background: rgba(46,204,113,0.2);
        }

        .btn-delete {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: rgba(239,68,68,0.7);
          padding: 0.3rem 0.8rem;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-delete:hover {
          background: rgba(239,68,68,0.15);
          color: #f87171;
        }

        .empty-state {
          text-align: center;
          padding: 2.5rem 0;
          color: rgba(255,255,255,0.25);
          font-size: 0.9rem;
        }

        /* Modal overlay */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeUp 0.2s ease;
        }

        .modal-box {
          background: #1a1a24;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }

        .modal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.3rem;
          letter-spacing: 1.5px;
          margin: 0 0 0.4rem;
          color: #FFB627;
        }

        .modal-sub {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          margin: 0 0 1.25rem;
        }

        .modal-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,182,39,0.3);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          outline: none;
          margin-bottom: 1.25rem;
        }

        .modal-input:focus {
          border-color: #FFB627;
          box-shadow: 0 0 0 3px rgba(255,182,39,0.1);
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
        }

        .modal-cancel {
          flex: 1;
          padding: 0.7rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-cancel:hover { border-color: rgba(255,255,255,0.2); color: #fff; }

        .modal-confirm {
          flex: 1;
          padding: 0.7rem;
          background: linear-gradient(135deg, #FFB627, #FF6B35);
          border: none;
          border-radius: 10px;
          color: #0f0f14;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .modal-confirm:hover { opacity: 0.9; }

        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
          .goals-panel { padding: 1.25rem; }
          .goals-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="goals-root">
        <Navbar />
        <div className="goals-body">

          {/* Header */}
          <div className="goals-header">
            <div>
              <h1>YOUR <span>GOALS</span></h1>
              <p>Set targets. Track progress. Crush them.</p>
            </div>
            <div className="goals-summary">
              <div className="summary-pill" style={{ '--pill-color': '#00B4D8' }}>
                <div className="summary-pill-val">{activeCount}</div>
                <div className="summary-pill-label">Active</div>
              </div>
              <div className="summary-pill" style={{ '--pill-color': '#2ECC71' }}>
                <div className="summary-pill-val">{completedCount}</div>
                <div className="summary-pill-label">Done</div>
              </div>
            </div>
          </div>

          {/* Add Goal Form */}
          <div className="goals-panel">
            <div className="panel-title">🎯 Add New Goal</div>
            {error && <div className="goals-error">⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Goal Title *</label>
                  <input
                    required
                    className="form-input"
                    placeholder="Run 100km this month"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Unit *</label>
                  <input
                    required
                    className="form-input"
                    placeholder="km, sessions, kg..."
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Target Value *</label>
                  <input
                    required
                    type="number"
                    className="form-input"
                    placeholder="100"
                    value={form.targetValue}
                    onChange={e => setForm({ ...form, targetValue: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Starting Value</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={form.currentValue}
                    onChange={e => setForm({ ...form, currentValue: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Deadline *</label>
                  <input
                    required
                    type="date"
                    className="form-input"
                    value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Description</label>
                  <input
                    className="form-input"
                    placeholder="Optional notes..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="goals-submit" disabled={submitting}>
                {submitting ? 'Adding...' : '+ Add Goal'}
              </button>
            </form>
          </div>

          {/* Goals List */}
          <div className="goals-panel">
            <div className="panel-title">
              📋 All Goals
              <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontFamily: 'DM Sans', fontWeight: 500, color: 'rgba(255,255,255,0.25)', letterSpacing: 0, textTransform: 'none' }}>
                {goals.length} total
              </span>
            </div>
            {goals.length === 0 ? (
              <div className="empty-state">No goals yet — add your first one above! 🎯</div>
            ) : (
              goals.map((goal, i) => {
                const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                const isComplete = progress >= 100;
                const fillColor = isComplete ? '#2ECC71' : progress > 60 ? '#FFB627' : '#FF6B35';
                const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={goal._id}
                    className={`goal-card ${isComplete ? 'completed' : ''}`}
                    style={{ animationDelay: `${i * 0.05}s`, borderLeftColor: newGoalId === goal._id ? '#FFB627' : undefined }}
                  >
                    <div className="goal-card-top">
                      <div>
                        <div className="goal-title">
                          {isComplete && '✅ '}{goal.title}
                        </div>
                        {goal.description && <div className="goal-desc">{goal.description}</div>}
                      </div>
                      <span className={`goal-status ${goal.status}`}>{goal.status}</span>
                    </div>

                    <div className="goal-track">
                      <div
                        className="goal-fill"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${fillColor}88, ${fillColor})`,
                          boxShadow: `0 0 8px ${fillColor}55`
                        }}
                      />
                    </div>

                    <div className="goal-meta-row">
                      <div className="goal-meta">
                        <strong>{goal.currentValue}</strong> / {goal.targetValue} {goal.unit}
                        {' · '}
                        <strong style={{ color: fillColor }}>{Math.round(progress)}%</strong>
                        {' · '}
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Deadline passed'}
                      </div>
                      <div className="goal-actions">
                        <button className="btn-update" onClick={() => openUpdateModal(goal)}>Update</button>
                        <button className="btn-delete" onClick={() => handleDelete(goal._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>

      {/* Update Progress Modal */}
      {updateModal && (
        <div className="modal-overlay" onClick={() => setUpdateModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Update Progress</div>
            <div className="modal-sub">
              {updateModal.title} · current: {updateModal.currentValue} {updateModal.unit}
            </div>
            <input
              type="number"
              className="modal-input"
              value={updateValue}
              autoFocus
              onChange={e => setUpdateValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUpdateProgress()}
            />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setUpdateModal(null)}>Cancel</button>
              <button className="modal-confirm" onClick={handleUpdateProgress}>Save Progress</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Goals;