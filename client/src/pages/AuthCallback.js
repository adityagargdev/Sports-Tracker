import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      handleGoogleCallback(token)
        .then(role => {
          if (!role) {
            navigate('/select-role');
          } else {
            navigate('/dashboard');
          }
        })
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, [handleGoogleCallback, navigate]);

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Signing you in...</div>;
};

export default AuthCallback;