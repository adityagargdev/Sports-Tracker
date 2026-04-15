import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';

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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

        <h1 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>📊 Your Dashboard</h1>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <StatCard
            title="Sessions This Week"
            value={stats?.totalSessions || 0}
            unit="sessions"
            color="#4ade80"
            icon="🏋️"
          />
          <StatCard
            title="Total Duration"
            value={stats?.totalDuration || 0}
            unit="minutes"
            color="#60a5fa"
            icon="⏱️"
          />
          <StatCard
            title="Calories Burned"
            value={stats?.totalCalories || 0}
            unit="kcal"
            color="#f97316"
            icon="🔥"
          />
          <StatCard
            title="Active Goals"
            value={goals.filter(g => g.status === 'active').length}
            unit="goals"
            color="#a855f7"
            icon="🎯"
          />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

          {/* Duration Chart */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#1a1a2e' }}>Session Duration (mins)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="duration" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Calories Chart */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: '#1a1a2e' }}>Calories Burned</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals Progress */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0, color: '#1a1a2e' }}>🎯 Goals Progress</h3>
          {goals.length === 0 ? (
            <p style={{ color: '#666' }}>No goals yet. <a href="/goals">Add your first goal!</a></p>
          ) : (
            goals.map(goal => {
              const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
              return (
                <div key={goal._id} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '500' }}>{goal.title}</span>
                    <span style={{ color: '#666' }}>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                  </div>
                  <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '10px' }}>
                    <div style={{
                      background: progress === 100 ? '#4ade80' : '#60a5fa',
                      width: `${progress}%`,
                      height: '100%',
                      borderRadius: '999px',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    {Math.round(progress)}% complete · Due {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Recent Sessions */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#1a1a2e' }}>🏃 Recent Sessions</h3>
          {sessions.length === 0 ? (
            <p style={{ color: '#666' }}>No sessions logged yet. <a href="/log-session">Log your first session!</a></p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Workout</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Duration</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Calories</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', color: '#666' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 5).map(s => (
                  <tr key={s._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{new Date(s.date).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span style={{
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.85rem'
                      }}>{s.workoutType?.name || 'Unknown'}</span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{s.duration} mins</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{s.metrics.caloriesBurned} kcal</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#666', fontSize: '0.9rem' }}>{s.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;