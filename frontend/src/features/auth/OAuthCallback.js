/**
 * OAuthCallback.js
 * Landing page for OAuth SSO redirect.
 *
 * After Google/GitHub authenticate the user, the backend redirects here with:
 *   /oauth-callback?accessToken=...&refreshToken=...&user=...
 *
 * This page reads those params, stores them exactly like a normal login,
 * then sends the user to the correct page.
 */
import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { setTokens } from '../../api/auth';
import { TOKEN_CONFIG } from '../../constants/config';
import { useAuth } from '../../context/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setOAuthSession } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error || !accessToken || !refreshToken || !userParam) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userParam);
      // Store session — same as regular login
      localStorage.setItem(TOKEN_CONFIG.USER_KEY, JSON.stringify(user));
      setTokens({ accessToken, refreshToken });
      setOAuthSession(user);
      const redirectPath = user.role === 'admin' ? '/dashboard' : '/products';
      navigate(redirectPath, { replace: true });
    } catch {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [searchParams, navigate, setOAuthSession]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f2f5',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        width: 48, height: 48,
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#4b5563', fontSize: 15 }}>Completing sign in…</p>
    </div>
  );
};

export default OAuthCallback;
