import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CoachDashboard = () => {
  const [athletes, setAthletes] = useState([]);
  const [coachCode, setCoachCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
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

  const copyCode = () => {
    navigator.clipboard.writeText(coachCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        .cd-root { min-height: 100vh; background: #0f0f14; font-family: 'DM Sans', sans-serif; color: #fff; }
        .cd-body { max-width: 960px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(46,204,113,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(46,204,113,0); }
        }

        .cd-header { margin-bottom: 2rem; animation: fadeUp 0.45s ease both; }
        .cd-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2rem, 5vw, 2.8rem); letter-spacing: 2px; margin: 0 0 0.2rem; line-height: 1; }
        .cd-header h1 span { color: #FFB627; text-shadow: 0 0 24px rgba(255,182,39,0.4); }
        .cd-header p { color: rgba(255,255,255,0.35); font-size: 0.88rem; margin: 0; }

        .cd-panel { background: #1a1a24; border-radius: 16px; padding: 1.75rem 2rem; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 40px rgba(0,0,0,0.3); margin-bottom: 1.5rem; animation: fadeUp 0.45s ease both; }
        .cd-panel:nth-child(2) { animation-delay: 0.05s; }
        .cd-panel:nth-child(3) { animation-delay: 0.1s; }

        .panel-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.15rem; letter-spacing: 1.5px; color: rgba(255,255,255,0.75); margin: 0 0 1.25rem; }

        /* Code block */
        .code-display {
          display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(46,204,113,0.2);
          border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1.25rem;
        }
        .code-value {
          font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; letter-spacing: 6px;
          color: #2ECC71; text-shadow: 0 0 20px rgba(46,204,113,0.4); flex: 1;
        }
        .code-copy {
          background: rgba(46,204,113,0.1); border: 1px solid rgba(46,204,113,0.3);
          color: #2ECC71; padding: 0.45rem 1rem; border-radius: 8px;
          font-size: 0.82rem; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .code-copy:hover { background: rgba(46,204,113,0.2); }
        .code-empty { color: rgba(255,255,255,0.25); font-style: italic; font-size: 0.9rem; margin-bottom: 1rem; }

        .cd-desc { color: rgba(255,255,255,0.35); font-size: 0.85rem; margin: 0 0 1.25rem; }

        .btn-generate {
          padding: 0.75rem 1.75rem; background: linear-gradient(135deg, #2ECC71, #00B4D8);
          color: #0f0f14; border: none; border-radius: 10px; font-size: 0.88rem;
          font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(46,204,113,0.25);
        }
        .btn-generate:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Athlete grid */
        .athlete-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .athlete-card {
          border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.25rem;
          background: rgba(255,255,255,0.02); cursor: pointer;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          animation: cardIn 0.4s ease both;
        }
        .athlete-card:hover {
          border-color: rgba(255,182,39,0.35); transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.3);
        }

        .athlete-card-top { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1rem; }

        .athlete-avatar {
          width: 48px; height: 48px; border-radius: 50%;
          background: linear-gradient(135deg, #FF6B35, #FFB627);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; font-weight: 700; color: #0f0f14; flex-shrink: 0;
          animation: pulse 2s infinite;
        }

        .athlete-name { font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 0.15rem; }
        .athlete-email { font-size: 0.8rem; color: rgba(255,255,255,0.35); }

        .btn-view {
          width: 100%; padding: 0.55rem; background: rgba(255,182,39,0.08);
          border: 1px solid rgba(255,182,39,0.2); color: #FFB627;
          border-radius: 9px; font-size: 0.82rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s;
        }
        .btn-view:hover { background: rgba(255,182,39,0.15); border-color: rgba(255,182,39,0.4); }

        .empty-state { text-align: center; padding: 3rem 0; }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-state p { color: rgba(255,255,255,0.3); font-size: 0.9rem; margin: 0.25rem 0; }

        @media (max-width: 600px) {
          .athlete-grid { grid-template-columns: 1fr; }
          .cd-panel { padding: 1.25rem; }
        }
      `}</style>

      <div className="cd-root">
        <Navbar />
        <div className="cd-body">

          <div className="cd-header">
            <h1>COACH <span>DASHBOARD</span></h1>
            <p>Manage your athletes, assign goals, and track progress.</p>
          </div>

          {/* Coach Code */}
          <div className="cd-panel">
            <div className="panel-title">🔑 Your Coach Code</div>
            <p className="cd-desc">Share this code with athletes so they can link to you.</p>
            {coachCode ? (
              <div className="code-display">
                <div className="code-value">{coachCode}</div>
                <button className="code-copy" onClick={copyCode}>
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            ) : (
              <p className="code-empty">No code generated yet.</p>
            )}
            <button className="btn-generate" onClick={generateCode}>
              {coachCode ? '🔄 Regenerate Code' : '✨ Generate Code'}
            </button>
          </div>

          {/* Athletes */}
          <div className="cd-panel">
            <div className="panel-title">
              👥 Your Athletes
              <span style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', fontWeight: 500, color: 'rgba(255,255,255,0.25)', letterSpacing: 0, textTransform: 'none', marginLeft: '0.75rem' }}>
                {athletes.length} linked
              </span>
            </div>

            {athletes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p>No athletes linked yet.</p>
                <p>Generate a code above and share it with your athletes!</p>
              </div>
            ) : (
              <div className="athlete-grid">
                {athletes.map((athlete, i) => (
                  <div
                    key={athlete._id}
                    className="athlete-card"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => navigate(`/coach/athlete/${athlete._id}`)}
                  >
                    <div className="athlete-card-top">
                      <div className="athlete-avatar">
                        {athlete.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="athlete-name">{athlete.name}</div>
                        <div className="athlete-email">{athlete.email}</div>
                      </div>
                    </div>
                    <button className="btn-view">View Sessions & Goals →</button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default CoachDashboard;