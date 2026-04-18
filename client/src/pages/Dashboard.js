import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import Navbar from '../components/Navbar';

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
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#1a1a24',
          border: '1px solid rgba(255,107,53,0.25)',
          borderRadius: 8,
          padding: '0.6rem 0.9rem',
          fontSize: '0.82rem',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</div>
          {payload.map((p, i) => (
            <div key={i} style={{ color: p.color, fontWeight: 600 }}>
              {p.value} {p.name === 'duration' ? 'mins' : 'kcal'}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f0f14' }}>
      <Navbar />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 'calc(100vh - 64px)', flexDirection: 'column', gap: '1rem'
      }}>
        <div style={{
          width: 48, height: 48,
          border: '3px solid rgba(255,107,53,0.15)',
          borderTop: '3px solid #FF6B35',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>
          Loading your stats...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const activeGoals = goals.filter(g => g.status === 'active').length;

  const statCards = [
    {
      title: 'Sessions This Week',
      value: stats?.totalSessions || 0,
      unit: 'sessions',
      icon: '🏋️',
      color: '#2ECC71',
      glow: 'rgba(46,204,113,0.2)',
    },
    {
      title: 'Total Duration',
      value: stats?.totalDuration || 0,
      unit: 'mins',
      icon: '⏱️',
      color: '#00B4D8',
      glow: 'rgba(0,180,216,0.2)',
    },
    {
      title: 'Calories Burned',
      value: stats?.totalCalories || 0,
      unit: 'kcal',
      icon: '🔥',
      color: '#FF6B35',
      glow: 'rgba(255,107,53,0.2)',
    },
    {
      title: 'Active Goals',
      value: activeGoals,
      unit: 'goals',
      icon: '🎯',
      color: '#FFB627',
      glow: 'rgba(255,182,39,0.2)',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .dash-root {
          min-height: 100vh;
          background: #0f0f14;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
        }

        .dash-body {
          padding: 2rem 1.5rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Page header */
        .dash-header {
          margin-bottom: 2rem;
          animation: fadeUp 0.5s ease both;
        }

        .dash-header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          letter-spacing: 2px;
          color: #fff;
          margin: 0 0 0.25rem;
          line-height: 1;
        }

        .dash-header h1 span {
          color: #FF6B35;
          text-shadow: 0 0 30px rgba(255,107,53,0.5);
        }

        .dash-subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
          margin: 0;
        }

        /* Stat cards */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .stat-card {
          background: #1a1a24;
          border-radius: 14px;
          padding: 1.25rem;
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: cardIn 0.5s ease both;
        }

        .stat-card:hover {
          transform: translateY(-3px);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--card-color);
          opacity: 0.8;
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(255,255,255,0.4);
        }

        .stat-icon {
          font-size: 1.2rem;
          opacity: 0.85;
        }

        .stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.4rem;
          letter-spacing: 1px;
          color: var(--card-color);
          line-height: 1;
          text-shadow: 0 0 20px var(--card-glow);
        }

        .stat-unit {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          margin-top: 0.25rem;
          font-weight: 500;
        }

        /* Chart panels */
        .chart-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .panel {
          background: #1a1a24;
          border-radius: 14px;
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,0.05);
          animation: cardIn 0.5s ease both;
        }

        .panel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.8);
          margin: 0 0 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .panel-title span {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.3);
          margin-left: auto;
        }

        /* Goals section */
        .goals-panel {
          background: #1a1a24;
          border-radius: 14px;
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 1.75rem;
          animation: cardIn 0.5s ease both;
        }

        .goal-item {
          margin-bottom: 1.25rem;
        }

        .goal-item:last-child { margin-bottom: 0; }

        .goal-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.4rem;
        }

        .goal-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        .goal-numbers {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
        }

        .goal-track {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          height: 7px;
          overflow: hidden;
        }

        .goal-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          position: relative;
        }

        .goal-fill::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 6px; height: 100%;
          background: rgba(255,255,255,0.5);
          border-radius: 999px;
        }

        .goal-meta {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.25);
          margin-top: 0.35rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem 0;
        }

        .empty-state p {
          color: rgba(255,255,255,0.3);
          margin: 0 0 0.75rem;
          font-size: 0.9rem;
        }

        .empty-link {
          display: inline-block;
          color: #FF6B35;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          border: 1px solid rgba(255,107,53,0.35);
          padding: 0.45rem 1rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .empty-link:hover {
          background: rgba(255,107,53,0.1);
        }

        /* Sessions table */
        .sessions-panel {
          background: #1a1a24;
          border-radius: 14px;
          padding: 1.5rem;
          border: 1px solid rgba(255,255,255,0.05);
          animation: cardIn 0.5s ease both;
        }

        .sessions-table {
          width: 100%;
          border-collapse: collapse;
        }

        .sessions-table th {
          text-align: left;
          padding: 0 0.75rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.25);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .sessions-table td {
          padding: 0.85rem 0.75rem;
          font-size: 0.875rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
          vertical-align: middle;
        }

        .sessions-table tr:last-child td {
          border-bottom: none;
        }

        .sessions-table tr:hover td {
          background: rgba(255,255,255,0.02);
        }

        .workout-badge {
          background: rgba(255,107,53,0.12);
          color: #FF6B35;
          border: 1px solid rgba(255,107,53,0.25);
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .date-cell {
          color: rgba(255,255,255,0.4);
          font-size: 0.82rem;
          white-space: nowrap;
        }

        .duration-cell {
          color: #00B4D8;
          font-weight: 600;
        }

        .cal-cell {
          color: #FF6B35;
          font-weight: 600;
        }

        .notes-cell {
          color: rgba(255,255,255,0.3);
          font-size: 0.82rem;
          font-style: italic;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Animations */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Stagger */
        .stat-card:nth-child(1) { animation-delay: 0.05s; }
        .stat-card:nth-child(2) { animation-delay: 0.1s; }
        .stat-card:nth-child(3) { animation-delay: 0.15s; }
        .stat-card:nth-child(4) { animation-delay: 0.2s; }

        .chart-grid .panel:nth-child(1) { animation-delay: 0.25s; }
        .chart-grid .panel:nth-child(2) { animation-delay: 0.3s; }
        .goals-panel { animation-delay: 0.35s; }
        .sessions-panel { animation-delay: 0.4s; }

        /* Responsive */
        @media (max-width: 900px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .chart-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .sessions-table th:nth-child(4),
          .sessions-table td:nth-child(4),
          .sessions-table th:nth-child(5),
          .sessions-table td:nth-child(5) { display: none; }
        }
      `}</style>

      <div className="dash-root">
        <Navbar />
        <div className="dash-body">

          {/* Header */}
          <div className="dash-header">
            <h1>YOUR <span>DASHBOARD</span></h1>
            <p className="dash-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Weekly overview
            </p>
          </div>

          {/* Stat Cards */}
          <div className="stat-grid">
            {statCards.map((card) => (
              <div
                key={card.title}
                className="stat-card"
                style={{ '--card-color': card.color, '--card-glow': card.glow }}
              >
                <div className="stat-card-top">
                  <div className="stat-label">{card.title}</div>
                  <div className="stat-icon">{card.icon}</div>
                </div>
                <div className="stat-value">{card.value.toLocaleString()}</div>
                <div className="stat-unit">{card.unit}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="chart-grid">
            <div className="panel">
              <div className="panel-title">
                ⏱ Session Duration
                <span>Last 7 sessions</span>
              </div>
              {chartData.length === 0 ? (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
                  No session data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="duration"
                      stroke="#00B4D8"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#00B4D8', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#00B4D8', boxShadow: '0 0 10px #00B4D8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="panel">
              <div className="panel-title">
                🔥 Calories Burned
                <span>Last 7 sessions</span>
              </div>
              {chartData.length === 0 ? (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
                  No session data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="calories"
                      fill="#FF6B35"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Goals Progress */}
          <div className="goals-panel">
            <div className="panel-title">
              🎯 Goals Progress
              <span>{goals.filter(g => g.status === 'active').length} active</span>
            </div>
            {goals.length === 0 ? (
              <div className="empty-state">
                <p>No goals set yet. Start tracking your progress!</p>
                <a href="/goals" className="empty-link">+ Add First Goal</a>
              </div>
            ) : (
              goals.map(goal => {
                const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                const isComplete = progress >= 100;
                const fillColor = isComplete ? '#2ECC71' : progress > 60 ? '#FFB627' : '#FF6B35';
                return (
                  <div key={goal._id} className="goal-item">
                    <div className="goal-row">
                      <span className="goal-name">
                        {isComplete && '✅ '}
                        {goal.title}
                      </span>
                      <span className="goal-numbers">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="goal-track">
                      <div
                        className="goal-fill"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, ${fillColor}99, ${fillColor})`,
                          boxShadow: `0 0 8px ${fillColor}60`
                        }}
                      />
                    </div>
                    <div className="goal-meta">
                      {Math.round(progress)}% complete · Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent Sessions */}
          <div className="sessions-panel">
            <div className="panel-title">
              🏃 Recent Sessions
              <span>{sessions.length} total</span>
            </div>
            {sessions.length === 0 ? (
              <div className="empty-state">
                <p>No sessions logged yet. Time to get moving!</p>
                <a href="/log-session" className="empty-link">+ Log First Session</a>
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
                        <span className="workout-badge">
                          {s.workoutType?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="duration-cell">{s.duration} mins</td>
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