import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import Navbar from '../components/Navbar';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .dash-root {
    min-height: 100vh;
    background: #0a0a0f;
    font-family: 'Inter', sans-serif;
    color: #fff;
  }

  .dash-body {
    padding: 2rem 1.75rem 5rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  /* Header */
  .dash-header {
    margin-bottom: 2rem;
    animation: fadeUp 0.4s ease both;
  }

  .dash-header h1 {
    font-size: clamp(1.4rem, 3vw, 1.75rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #fff;
    margin: 0 0 0.25rem;
    line-height: 1.2;
  }

  .dash-subtitle {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.3);
    margin: 0;
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  /* Stat grid */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .stat-card {
    background: #111118;
    border-radius: 10px;
    padding: 1.1rem 1.25rem;
    border: 1px solid rgba(255,255,255,0.05);
    animation: fadeUp 0.4s ease both;
    transition: border-color 0.2s;
  }

  .stat-card:hover { border-color: rgba(255,255,255,0.1); }

  .stat-card:nth-child(1) { animation-delay: 0.05s; }
  .stat-card:nth-child(2) { animation-delay: 0.1s; }
  .stat-card:nth-child(3) { animation-delay: 0.15s; }
  .stat-card:nth-child(4) { animation-delay: 0.2s; }

  .stat-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.01em;
    margin-bottom: 0.6rem;
  }

  .stat-value {
    font-size: 1.85rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .stat-unit {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.25);
    font-weight: 400;
  }

  .stat-accent {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #818cf8;
    margin-bottom: 0.7rem;
  }

  /* Panels */
  .panel {
    background: #111118;
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    border: 1px solid rgba(255,255,255,0.05);
    animation: fadeUp 0.4s ease both;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .panel-title {
    font-size: 0.82rem;
    font-weight: 600;
    color: rgba(255,255,255,0.8);
    letter-spacing: -0.01em;
  }

  .panel-meta {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.22);
    font-weight: 400;
  }

  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .chart-grid .panel:nth-child(1) { animation-delay: 0.25s; }
  .chart-grid .panel:nth-child(2) { animation-delay: 0.3s; }

  /* Goals */
  .goals-panel { margin-bottom: 1.25rem; animation-delay: 0.35s; }

  .goal-item { margin-bottom: 1.1rem; }
  .goal-item:last-child { margin-bottom: 0; }

  .goal-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.35rem;
  }

  .goal-name {
    font-size: 0.82rem;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
    letter-spacing: -0.01em;
  }

  .goal-numbers {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.28);
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }

  .goal-track {
    background: rgba(255,255,255,0.05);
    border-radius: 999px;
    height: 4px;
    overflow: hidden;
  }

  .goal-fill {
    height: 100%;
    border-radius: 999px;
    background: #818cf8;
    transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .goal-fill.complete { background: #34d399; }

  .goal-meta {
    font-size: 0.68rem;
    color: rgba(255,255,255,0.2);
    margin-top: 0.3rem;
    font-weight: 400;
  }

  /* Sessions table */
  .sessions-panel { animation-delay: 0.4s; }

  .sessions-table {
    width: 100%;
    border-collapse: collapse;
  }

  .sessions-table th {
    text-align: left;
    padding: 0 0.625rem 0.625rem;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: rgba(255,255,255,0.2);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .sessions-table td {
    padding: 0.75rem 0.625rem;
    font-size: 0.82rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.6);
    vertical-align: middle;
    letter-spacing: -0.01em;
  }

  .sessions-table tr:last-child td { border-bottom: none; }
  .sessions-table tr:hover td { color: rgba(255,255,255,0.8); }

  .workout-badge {
    background: rgba(129,140,248,0.1);
    color: rgba(129,140,248,0.9);
    border: 1px solid rgba(129,140,248,0.18);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 500;
    white-space: nowrap;
    letter-spacing: -0.01em;
  }

  .date-cell { color: rgba(255,255,255,0.28); font-size: 0.78rem; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .duration-cell { color: rgba(255,255,255,0.7); font-weight: 500; font-variant-numeric: tabular-nums; }
  .cal-cell { color: rgba(255,255,255,0.5); font-variant-numeric: tabular-nums; }
  .notes-cell { color: rgba(255,255,255,0.22); font-size: 0.78rem; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* Empty */
  .empty-state { text-align: center; padding: 2.5rem 0; }
  .empty-state p { color: rgba(255,255,255,0.22); font-size: 0.82rem; margin: 0 0 0.875rem; }
  .empty-link {
    display: inline-block; color: #818cf8; text-decoration: none;
    font-weight: 500; font-size: 0.8rem;
    border: 1px solid rgba(129,140,248,0.25); padding: 0.45rem 1rem;
    border-radius: 6px; transition: all 0.15s; letter-spacing: -0.01em;
  }
  .empty-link:hover { background: rgba(129,140,248,0.08); border-color: rgba(129,140,248,0.4); }

  /* Responsive */
  @media (max-width: 900px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    .chart-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    .sessions-table th:nth-child(4), .sessions-table td:nth-child(4),
    .sessions-table th:nth-child(5), .sessions-table td:nth-child(5) { display: none; }
  }
`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sessionsRes, goalsRes] = await Promise.all([
          axios.get('/sessions/stats/weekly'),
          axios.get('/sessions'),
          axios.get('/goals')
        ]);
        setStats(statsRes.data.stats);
        setSessions(sessionsRes.data.sessions);
        setGoals(goalsRes.data.goals);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = sessions.slice(0, 7).reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    duration: s.duration,
    calories: s.metrics.caloriesBurned
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: '#1a1a24',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '0.6rem 0.875rem',
        fontSize: '0.78rem',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 4, fontSize: '0.7rem' }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: '#fff', fontWeight: 500 }}>
            {p.value}{' '}
            <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
              {p.name === 'duration' ? 'min' : 'kcal'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const activeGoals = goals.filter(g => g.status === 'active').length;

  const statCards = [
    { title: 'Sessions this week', value: stats?.totalSessions || 0, unit: 'sessions' },
    { title: 'Total duration',     value: stats?.totalDuration  || 0, unit: 'min' },
    { title: 'Calories burned',    value: stats?.totalCalories  || 0, unit: 'kcal' },
    { title: 'Active goals',       value: activeGoals,                unit: 'goals' },
  ];

  if (loading) return (
    <div className="dash-root">
      <style>{css}</style>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)', gap: '0.75rem', flexDirection: 'column' }}>
        <div style={{ width: 20, height: 20, border: '2px solid rgba(129,140,248,0.15)', borderTop: '2px solid #818cf8', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <span style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter,sans-serif', fontSize: '0.8rem' }}>Loading…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="dash-root">
        <Navbar />
        <div className="dash-body">

          {/* Header */}
          <div className="dash-header">
            <h1>Dashboard</h1>
            <p className="dash-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Weekly overview
            </p>
          </div>

          {/* Stat Cards */}
          <div className="stat-grid">
            {statCards.map((card) => (
              <div key={card.title} className="stat-card">
                <div className="stat-accent" />
                <div className="stat-label">{card.title}</div>
                <div className="stat-value">{card.value.toLocaleString()}</div>
                <div className="stat-unit">{card.unit}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="chart-grid">
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Session duration</span>
                <span className="panel-meta">Last 7 sessions</span>
              </div>
              {chartData.length === 0 ? (
                <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '0.8rem' }}>
                  No data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="duration" stroke="#818cf8" strokeWidth={2} dot={{ r: 3, fill: '#818cf8', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#818cf8' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Calories burned</span>
                <span className="panel-meta">Last 7 sessions</span>
              </div>
              {chartData.length === 0 ? (
                <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '0.8rem' }}>
                  No data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="calories" fill="#818cf8" radius={[3, 3, 0, 0]} maxBarSize={32} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Goals */}
          <div className="panel goals-panel">
            <div className="panel-header">
              <span className="panel-title">Goals</span>
              <span className="panel-meta">{activeGoals} active</span>
            </div>
            {goals.length === 0 ? (
              <div className="empty-state">
                <p>No goals set yet.</p>
                <a href="/goals" className="empty-link">+ Add a goal</a>
              </div>
            ) : (
              goals.map(goal => {
                const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                const isComplete = progress >= 100;
                return (
                  <div key={goal._id} className="goal-item">
                    <div className="goal-row">
                      <span className="goal-name">{goal.title}</span>
                      <span className="goal-numbers">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                    </div>
                    <div className="goal-track">
                      <div className={`goal-fill ${isComplete ? 'complete' : ''}`} style={{ width: `${progress}%` }} />
                    </div>
                    <div className="goal-meta">
                      {Math.round(progress)}% · Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sessions table */}
          <div className="panel sessions-panel">
            <div className="panel-header">
              <span className="panel-title">Recent sessions</span>
              <span className="panel-meta">{sessions.length} total</span>
            </div>
            {sessions.length === 0 ? (
              <div className="empty-state">
                <p>No sessions logged yet.</p>
                <a href="/log-session" className="empty-link">+ Log a session</a>
              </div>
            ) : (
              <table className="sessions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Workout</th>
                    <th>Duration</th>
                    <th>Calories</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(0, 5).map(s => (
                    <tr key={s._id}>
                      <td className="date-cell">
                        {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td>
                        <span className="workout-badge">{s.workoutType?.name || 'Unknown'}</span>
                      </td>
                      <td className="duration-cell">{s.duration} min</td>
                      <td className="cal-cell">{s.metrics.caloriesBurned} kcal</td>
                      <td className="notes-cell">{s.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
