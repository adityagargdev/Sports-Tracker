import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const LinkCoach = () => {
  const [code, setCode] = useState('');
  const [myCoach, setMyCoach] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get('/coach/my-coach')
      .then(res => setMyCoach(res.data.coach))
      .catch(() => {});
  }, []);

  const handleLink = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post('/coach/link', { coachCode: code });
      setMessage(res.data.message);
      const coachRes = await axios.get('/coach/my-coach');
      setMyCoach(coachRes.data.coach);
      setCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to link coach. Check the code and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        .lc-root { min-height: 100vh; background: #0f0f14; font-family: 'DM Sans', sans-serif; color: #fff; }
        .lc-body { max-width: 520px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }

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
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(46,204,113,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(46,204,113,0); }
        }

        .lc-header { margin-bottom: 2rem; animation: fadeUp 0.45s ease both; }
        .lc-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 5vw, 2.8rem); letter-spacing: 2px; margin: 0 0 0.2rem; line-height: 1; }
        .lc-header h1 span { color: #2ECC71; text-shadow: 0 0 24px rgba(46,204,113,0.4); }
        .lc-header p { color: rgba(255,255,255,0.35); font-size: 0.88rem; margin: 0; }

        /* Coach card */
        .coach-card {
          background: rgba(46,204,113,0.06); border: 1px solid rgba(46,204,113,0.2);
          border-radius: 16px; padding: 1.5rem 1.75rem; margin-bottom: 1.5rem;
          animation: fadeUp 0.45s ease both; display: flex; align-items: center; gap: 1rem;
        }
        .coach-avatar {
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, #2ECC71, #00B4D8);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; font-weight: 700; color: #0f0f14; flex-shrink: 0;
          animation: pulse 2s infinite;
        }
        .coach-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #2ECC71; margin-bottom: 0.2rem; }
        .coach-name { font-size: 1.05rem; font-weight: 700; color: #fff; }
        .coach-email { font-size: 0.82rem; color: rgba(255,255,255,0.35); }

        /* Panel */
        .lc-panel {
          background: #1a1a24; border-radius: 16px; padding: 1.75rem 2rem;
          border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 40px rgba(0,0,0,0.3);
          animation: fadeUp 0.45s ease both; animation-delay: 0.05s;
        }

        .panel-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.15rem; letter-spacing: 1.5px; color: rgba(255,255,255,0.75); margin: 0 0 0.5rem; }
        .panel-desc { color: rgba(255,255,255,0.35); font-size: 0.85rem; margin: 0 0 1.5rem; line-height: 1.5; }

        /* Alerts */
        .lc-success { background: rgba(46,204,113,0.1); border: 1px solid rgba(46,204,113,0.3); color: #2ECC71; border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.875rem; margin-bottom: 1.25rem; font-weight: 500; }
        .lc-error   { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.3);  color: #f87171;  border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.875rem; margin-bottom: 1.25rem; animation: shake 0.4s ease; }

        /* Code input */
        .code-input-wrap { position: relative; margin-bottom: 1.25rem; }
        .code-input {
          width: 100%; padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; font-size: 1.4rem; font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 6px; text-align: center; color: #fff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .code-input::placeholder { color: rgba(255,255,255,0.15); font-size: 1rem; letter-spacing: 2px; font-family: 'DM Sans', sans-serif; }
        .code-input:focus {
          border-color: rgba(46,204,113,0.45);
          box-shadow: 0 0 0 3px rgba(46,204,113,0.1);
          background: rgba(46,204,113,0.03);
        }

        /* Hint */
        .code-hint { text-align: center; font-size: 0.75rem; color: rgba(255,255,255,0.2); margin-bottom: 1.25rem; }

        /* Submit */
        .lc-submit {
          width: 100%; padding: 0.9rem;
          background: linear-gradient(135deg, #2ECC71, #00B4D8);
          color: #0f0f14; border: none; border-radius: 12px;
          font-size: 0.95rem; font-weight: 700; font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.5px; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(46,204,113,0.25);
        }
        .lc-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(46,204,113,0.4); }
        .lc-submit:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="lc-root">
        <Navbar />
        <div className="lc-body">

          <div className="lc-header">
            <h1>LINK <span>COACH</span></h1>
            <p>Connect with your coach to get feedback and assigned goals.</p>
          </div>

          {/* Linked coach card */}
          {myCoach && (
            <div className="coach-card">
              <div className="coach-avatar">
                {myCoach.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="coach-label">✅ Your Coach</div>
                <div className="coach-name">{myCoach.name}</div>
                <div className="coach-email">{myCoach.email}</div>
              </div>
            </div>
          )}

          {/* Link form */}
          <div className="lc-panel">
            <div className="panel-title">🔗 {myCoach ? 'Change Coach' : 'Link to a Coach'}</div>
            <p className="panel-desc">
              Enter the code your coach shared with you. You'll be able to see their feedback and receive assigned goals.
            </p>

            {message && <div className="lc-success">✅ {message}</div>}
            {error   && <div className="lc-error">⚠️ {error}</div>}

            <form onSubmit={handleLink}>
              <div className="code-input-wrap">
                <input
                  required
                  type="text"
                  className="code-input"
                  placeholder="AB12CD34"
                  value={code}
                  maxLength={10}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                />
              </div>
              <div className="code-hint">Enter the code exactly as your coach shared it</div>
              <button type="submit" className="lc-submit" disabled={submitting}>
                {submitting ? 'Linking...' : '🔗 Link to Coach'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default LinkCoach;