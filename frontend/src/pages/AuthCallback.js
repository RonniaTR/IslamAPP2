import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash;
    const sessionId = new URLSearchParams(hash.replace('#', '?')).get('session_id');

    if (!sessionId) {
      navigate('/login', { replace: true });
      return;
    }

    api.post(`/auth/session?session_id=${sessionId}`, {}, { timeout: 10000 })
      .then(({ data }) => {
        setUser(data);
        window.history.replaceState({}, '', window.location.pathname);
        navigate('/', { replace: true });
      })
      .catch(() => {
        setError(true);
        setTimeout(() => navigate('/login', { replace: true }), 2500);
      });
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #111D30 0%, #070D18 70%)' }}
      data-testid="auth-callback">
      <div className="flex flex-col items-center gap-4 text-center px-6">
        {!error ? (
          <>
            <div className="w-10 h-10 border-2 rounded-full animate-spin"
              style={{ borderColor: '#C8A55A', borderTopColor: 'transparent' }} />
            <p className="text-sm font-medium" style={{ color: '#EBE5D8' }}>Giriş yapılıyor...</p>
            <p className="text-xs" style={{ color: '#7E8A9E' }}>Lütfen bekleyiniz</p>
          </>
        ) : (
          <>
            <div className="text-3xl">⚠️</div>
            <p className="text-sm font-medium" style={{ color: '#EBE5D8' }}>Bağlantı hatası</p>
            <p className="text-xs" style={{ color: '#7E8A9E' }}>Giriş sayfasına yönlendiriliyorsunuz...</p>
          </>
        )}
      </div>
    </div>
  );
}
