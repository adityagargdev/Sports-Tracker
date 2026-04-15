const StatCard = ({ title, value, unit, color, icon }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`,
      minWidth: '150px'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value}</div>
      <div style={{ color: '#666', fontSize: '0.9rem' }}>{unit}</div>
      <div style={{ color: '#333', fontWeight: '500', marginTop: '0.25rem' }}>{title}</div>
    </div>
  );
};

export default StatCard;