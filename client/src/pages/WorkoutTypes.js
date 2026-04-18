import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const CATEGORIES = [
  { value: 'cardio',      label: 'Cardio',       icon: '🏃', color: '#00B4D8', glow: 'rgba(0,180,216,0.2)' },
  { value: 'strength',    label: 'Strength',     icon: '🏋️', color: '#FF6B35', glow: 'rgba(255,107,53,0.2)' },
  { value: 'flexibility', label: 'Flexibility',  icon: '🧘', color: '#2ECC71', glow: 'rgba(46,204,113,0.2)' },
  { value: 'sports',      label: 'Sports',       icon: '⚽', color: '#FFB627', glow: 'rgba(255,182,39,0.2)' },
  { value: 'other',       label: 'Other',        icon: '💡', color: '#9b8ea8', glow: 'rgba(155,142,168,0.2)' },
];

const getCat = (val) => CATEGORIES.find(c => c.value === val) || CATEGORIES[4];

const WorkoutTypes = () => {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'cardio', description: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState(null);

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('/workouts');
      setWorkouts(res.data.workouts);
    } catch (err) {
      console.error('Failed to fetch workouts', err);
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await axios.post('/workouts', form);
      const newId = res.data.workout?._id;
      setForm({ name: '', category: 'cardio', description: '' });
      await fetchWorkouts();
      setSuccessId(newId);
      setTimeout(() => setSuccessId(null), 1500);
    } catch (err) {
      // Surface the actual server error message if available
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Failed to create workout type${msg ? `: ${msg}` : '. Check the console for details.'}`);
      console.error('Create workout error:', err.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/workouts/${id}`);
      fetchWorkouts();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .wt-root {
          min-height: 100vh;
          background: #0f0f14;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        .wt-body {
          max-width: 860px;
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
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes popIn {
          0%   { transform: scale(0.92); opacity: 0; }
          60%  { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Header */
        .wt-header {
          margin-bottom: 2rem;
          animation: fadeUp 0.45s ease both;
        }

        .wt-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          letter-spacing: 2px;
          margin: 0 0 0.2rem;
          line-height: 1;
        }

        .wt-header h1 span { color: #FF6B35; text-shadow: 0 0 24px rgba(255,107,53,0.45); }

        .wt-header p {
          color: rgba(255,255,255,0.35);
          font-size: 0.88rem;
          margin: 0;
        }

        /* Panel */
        .wt-panel {
          background: #1a1a24;
          border-radius: 16px;
          padding: 1.75rem 2rem;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
          animation: fadeUp 0.45s ease both;
        }

        .wt-panel:nth-child(2) { animation-delay: 0.05s; }
        .wt-panel:nth-child(3) { animation-delay: 0.1s; }

        .panel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.15rem;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.75);
          margin: 0 0 1.5rem;
        }

        /* Error / success */
        .wt-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
          animation: shake 0.4s ease;
        }

        /* Category picker */
        .cat-picker {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .cat-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.9rem;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.45);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
        }

        .cat-btn:hover {
          border-color: rgba(255,255,255,0.2);
          color: #fff;
        }

        .cat-btn.active {
          color: var(--cat-color);
          border-color: var(--cat-color);
          background: var(--cat-glow);
          box-shadow: 0 0 12px var(--cat-glow);
        }

        /* Form fields */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
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

        .form-input {
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
          border-color: rgba(255,107,53,0.45);
          box-shadow: 0 0 0 3px rgba(255,107,53,0.08);
          background: rgba(255,107,53,0.03);
        }

        .form-full { grid-column: 1 / -1; }

        /* Submit */
        .wt-submit {
          margin-top: 1.25rem;
          padding: 0.85rem 2rem;
          background: linear-gradient(135deg, #FF6B35, #FFB627);
          color: #0f0f14;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(255,107,53,0.25);
        }

        .wt-submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(255,107,53,0.4);
        }

        .wt-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Workout cards grid */
        .wt-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
        }

        .wt-card {
          border-radius: 14px;
          padding: 1.1rem 1.2rem;
          border: 1px solid var(--card-border);
          background: rgba(255,255,255,0.02);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: cardIn 0.4s ease both;
        }

        .wt-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--card-color);
          opacity: 0.8;
        }

        .wt-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.3);
        }

        .wt-card.new {
          animation: popIn 0.4s ease both;
          border-color: var(--card-color) !important;
          box-shadow: 0 0 20px var(--card-glow);
        }

        .wt-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.6rem;
        }

        .wt-card-name {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
          line-height: 1.3;
        }

        .wt-delete {
          background: transparent;
          border: 1px solid rgba(239,68,68,0.2);
          color: rgba(239,68,68,0.5);
          border-radius: 7px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .wt-delete:hover {
          background: rgba(239,68,68,0.12);
          color: #f87171;
          border-color: rgba(239,68,68,0.4);
        }

        .wt-cat-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.18rem 0.6rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--card-color);
          background: var(--card-glow);
          border: 1px solid var(--card-border);
          margin-bottom: 0.5rem;
        }

        .wt-card-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.3);
          margin: 0;
          font-style: italic;
          line-height: 1.4;
        }

        .empty-state {
          text-align: center;
          padding: 2.5rem 0;
          color: rgba(255,255,255,0.25);
          font-size: 0.9rem;
        }

        @media (max-width: 560px) {
          .form-grid { grid-template-columns: 1fr; }
          .wt-grid { grid-template-columns: 1fr; }
          .wt-panel { padding: 1.25rem; }
        }
      `}</style>

      <div className="wt-root">
        <Navbar />
        <div className="wt-body">

          {/* Header */}
          <div className="wt-header">
            <h1>WORKOUT <span>TYPES</span></h1>
            <p>Define your training disciplines — use them when logging sessions.</p>
          </div>

          {/* Add Form */}
          <div className="wt-panel">
            <div className="panel-title">💪 Add Workout Type</div>
            {error && <div className="wt-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Category picker */}
              <div style={{ marginBottom: '1rem' }}>
                <div className="form-label" style={{ marginBottom: '0.5rem' }}>Category *</div>
                <div className="cat-picker">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      className={`cat-btn ${form.category === cat.value ? 'active' : ''}`}
                      style={{ '--cat-color': cat.color, '--cat-glow': cat.glow }}
                      onClick={() => setForm({ ...form, category: cat.value })}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Name *</label>
                  <input
                    required
                    className="form-input"
                    placeholder="e.g. Running, Bench Press..."
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
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

              <button type="submit" className="wt-submit" disabled={submitting}>
                {submitting ? 'Adding...' : '+ Add Workout Type'}
              </button>
            </form>
          </div>

          {/* Workout list */}
          <div className="wt-panel">
            <div className="panel-title">
              🗂 Your Workout Types
              <span style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', fontWeight: 500, color: 'rgba(255,255,255,0.25)', letterSpacing: 0, textTransform: 'none', marginLeft: '0.75rem' }}>
                {workouts.length} total
              </span>
            </div>

            {workouts.length === 0 ? (
              <div className="empty-state">No workout types yet — add one above! 💪</div>
            ) : (
              <div className="wt-grid">
                {workouts.map((w, i) => {
                  const cat = getCat(w.category);
                  const isNew = successId === w._id;
                  return (
                    <div
                      key={w._id}
                      className={`wt-card ${isNew ? 'new' : ''}`}
                      style={{
                        '--card-color': cat.color,
                        '--card-glow': cat.glow,
                        '--card-border': isNew ? cat.color : 'rgba(255,255,255,0.07)',
                        animationDelay: `${i * 0.04}s`
                      }}
                    >
                      <div className="wt-card-top">
                        <div className="wt-card-name">{w.name}</div>
                        <button className="wt-delete" onClick={() => handleDelete(w._id)} title="Delete">✕</button>
                      </div>
                      <div className="wt-cat-badge">
                        {cat.icon} {cat.label}
                      </div>
                      {w.description && <p className="wt-card-desc">{w.description}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default WorkoutTypes;