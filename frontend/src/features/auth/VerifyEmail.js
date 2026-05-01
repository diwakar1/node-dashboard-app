/**
 * VerifyEmail.js
 * Handles the email verification landing page.
 * User arrives here via the link in their verification email (/verify-email?token=...).
 */
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { USER_ENDPOINTS } from '../../constants/apiEndpoints';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  // Prevent double-invocation in React StrictMode (dev) or accidental re-renders
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the link.');
      return;
    }

    (async () => {
      try {
        const res = await fetch(USER_ENDPOINTS.VERIFY_EMAIL(token));
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      } catch {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    })();
  }, [searchParams]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {status === 'verifying' && (
          <>
            <div style={styles.spinner} />
            <p style={styles.text}>Verifying your email…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ ...styles.icon, color: '#16a34a' }}>&#10003;</div>
            <h2 style={{ ...styles.heading, color: '#16a34a' }}>Email Verified!</h2>
            <p style={styles.text}>{message}</p>
            <p style={styles.text}>
              You will now receive order confirmation emails after placing an order.
            </p>
            <Link to="/login" style={styles.btn}>
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ ...styles.icon, color: '#dc2626' }}>&#10007;</div>
            <h2 style={{ ...styles.heading, color: '#dc2626' }}>Verification Failed</h2>
            <p style={styles.text}>{message}</p>
            <p style={styles.text}>
              The link may have expired. Log in and request a new verification email from your profile.
            </p>
            <Link to="/login" style={styles.btn}>
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f3f4f6',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    maxWidth: '420px',
    width: '100%',
  },
  icon: {
    fontSize: '64px',
    lineHeight: 1,
    marginBottom: '16px',
  },
  heading: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '12px',
  },
  text: {
    color: '#4b5563',
    fontSize: '15px',
    marginBottom: '12px',
    lineHeight: 1.6,
  },
  btn: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 28px',
    background: '#2563eb',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '15px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 16px',
  },
};

export default VerifyEmail;
