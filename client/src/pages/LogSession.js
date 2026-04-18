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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get('/workouts').then(res => setWorkouts(res.data.workouts));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
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
      setSuccess('Session logged!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Failed to log session. Make sure you have a workout type created.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .ls-root {
          min-height: 100vh;
          background: #0f0f14;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        .ls-body {
          max-width: 640px;
          margin: 0 auto;
          padding: 2.5rem 1.25rem 4rem;
          animation: fadeUp 0.45s ease both;
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

        @keyframes popIn {
          0%   { transform: scale(0.92); opacity: 0; }
          60%  { transform: scale(1.03); }
          100% { transform: scale(1); opacity: 1; }
        }

        .ls-header {
          margin-bottom: 2rem;
        }

        .ls-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.6rem;
          letter-spacing: 2px;
          margin: 0 0 0.2rem;
          line-height: 1;
          color: #fff;
        }

        .ls-header h1 span { color: #FF6B35; text-shadow: 0 0 24px rgba(255,107,53,0.45); }

        .ls-header p {
          color: rgba(255,255,255,0.35);
          font-size: 0.88rem;
          margin: 0;
        }

        /* Card */
        .ls-card {
          background: #1a1a24;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        }

        /* Alerts */
        .ls-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
          animation: shake 0.4s ease;
        }

        .ls-success {
          background: rgba(46,204,113,0.1);
          border: 1px solid rgba(46,204,113,0.3);
          color: #2ECC71;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
          animation: popIn 0.35s ease both;
          text-align: center;
          font-weight: 600;
        }

        /* Section label */
        .ls-section-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.25);
          margin: 1.5rem 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ls-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* Field */
        .ls-field {
          margin-bottom: 1rem;
        }

        .ls-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 0.4rem;
        }

        .ls-input,
        .ls-select,
        .ls-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.7rem 0.9rem;
          font-size: 0.92rem;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          -webkit-appearance: none;
        }

        .ls-input::placeholder,
        .ls-textarea::placeholder {
          color: rgba(255,255,255,0.18);
        }

        .ls-input:focus,
        .ls-select:focus,
        .ls-textarea:focus {
          border-color: rgba(255,107,53,0.5);
          box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
          background: rgba(255,107,53,0.04);
        }

        .ls-select option {
          background: #1a1a24;
          color: #fff;
        }

        .ls-textarea {
          resize: vertical;
          min-height: 90px;
        }

        /* Grid layouts */
        .ls-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .ls-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        /* Metric pills row */
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .metric-field {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 0.85rem;
          transition: border-color 0.2s;
        }

        .metric-field:focus-within {
          border-color: rgba(255,182,39,0.3);
        }

        .metric-field .ls-label {
          color: rgba(255,182,39,0.6);
          margin-bottom: 0.3rem;
        }

        .metric-field .ls-input {
          background: transparent;
          border: none;
          padding: 0;
          font-size: 1.05rem;
          font-weight: 600;
          color: #fff;
          box-shadow: none;
        }

        .metric-field .ls-input:focus {
          border: none;
          box-shadow: none;
          background: transparent;
        }

        .metric-unit {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.2);
          margin-top: 0.15rem;
        }

        /* Submit button */
        .ls-submit {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #FF6B35, #FFB627);
          color: #0f0f14;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 1.75rem;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(255,107,53,0.3);
        }

        .ls-submit:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(255,107,53,0.45);
        }

        .ls-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .ls-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 520px) {
          .ls-grid-2, .ls-grid-3, .metric-grid {
            grid-template-columns: 1fr;
          }
          .ls-card { padding: 1.5rem 1.25rem; }
        }
      `}</style>

      <div className="ls-root">
        <Navbar />
        <div className="ls-body">

          <div className="ls-header">
            <h1>LOG <span>SESSION</span></h1>
            <p>Record your training — every rep counts.</p>
          </div>

          <div className="ls-card">
            {error && <div className="ls-error">⚠️ {error}</div>}
            {success && <div className="ls-success">✅ {success} Redirecting...</div>}

            <form onSubmit={handleSubmit}>

              {/* Core info */}
              <div className="ls-section-label">Session Info</div>

              <div className="ls-field">
                <label className="ls-label">Workout Type *</label>
                <select
                  required
                  className="ls-select"
                  value={form.workoutType}
                  onChange={e => setForm({ ...form, workoutType: e.target.value })}
                >
                  <option value="">Select a workout type...</option>
                  {workouts.map(w => (
                    <option key={w._id} value={w._id}>{w.name} · {w.category}</option>
                  ))}
                </select>
              </div>

              <div className="ls-grid-2">
                <div className="ls-field">
                  <label className="ls-label">Date *</label>
                  <input
                    type="date"
                    required
                    className="ls-input"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="ls-field">
                  <label className="ls-label">Duration (mins) *</label>
                  <input
                    type="number"
                    required
                    className="ls-input"
                    placeholder="45"
                    min="1"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="ls-section-label">Metrics <span style={{ color: 'rgba(255,255,255,0.15)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>optional</span></div>

              <div className="metric-grid">
                <div className="metric-field">
                  <label className="ls-label">🔥 Calories</label>
                  <input
                    type="number"
                    className="ls-input"
                    placeholder="350"
                    min="0"
                    value={form.caloriesBurned}
                    onChange={e => setForm({ ...form, caloriesBurned: e.target.value })}
                  />
                  <div className="metric-unit">kcal</div>
                </div>

                <div className="metric-field">
                  <label className="ls-label">📍 Distance</label>
                  <input
                    type="number"
                    className="ls-input"
                    placeholder="5.0"
                    min="0"
                    step="0.1"
                    value={form.distance}
                    onChange={e => setForm({ ...form, distance: e.target.value })}
                  />
                  <div className="metric-unit">km</div>
                </div>

                <div className="metric-field">
                  <label className="ls-label">🔁 Reps</label>
                  <input
                    type="number"
                    className="ls-input"
                    placeholder="12"
                    min="0"
                    value={form.reps}
                    onChange={e => setForm({ ...form, reps: e.target.value })}
                  />
                  <div className="metric-unit">repetitions</div>
                </div>

                <div className="metric-field">
                  <label className="ls-label">📦 Sets</label>
                  <input
                    type="number"
                    className="ls-input"
                    placeholder="3"
                    min="0"
                    value={form.sets}
                    onChange={e => setForm({ ...form, sets: e.target.value })}
                  />
                  <div className="metric-unit">sets</div>
                </div>
              </div>

              {/* Notes */}
              <div className="ls-section-label">Notes</div>

              <div className="ls-field">
                <textarea
                  className="ls-textarea"
                  placeholder="How did it feel? Any PRs? Things to improve..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="ls-submit"
                disabled={submitting || !!success}
              >
                {submitting ? 'Logging...' : '🏋️ Log Session'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogSession;