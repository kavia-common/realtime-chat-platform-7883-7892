import React, { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// PUBLIC_INTERFACE
export default function AuthScreen() {
  const { signin, signup } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');
      try {
        if (mode === 'signin') {
          await signin(email, password);
        } else {
          const { user: newUser } = await signup(email, password);
          if (!newUser) {
            setError('Signup failed. Please try again.');
          } else if (newUser?.identities?.length === 0) {
            // Email confirmation required
            setError(
              'Please check your email for the confirmation link. You will need to confirm your email before signing in.'
            );
            setMode('signin');
            setEmail('');
            setPassword('');
          } else if (newUser) {
            setMode('signin');
            setEmail('');
            setPassword('');
            setError('Account created successfully! Please sign in.');
          }
        }
      } catch (err) {
        setError(err?.message || 'Authentication failed');
      } finally {
        setSubmitting(false);
      }
    },
    [mode, email, password, signin, signup]
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(37,99,235,0.06) 0%, rgba(249,250,251,1) 100%)',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          boxShadow: '0 24px 48px rgba(17,24,39,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '18px 18px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'linear-gradient(180deg, rgba(37,99,235,0.06) 0%, rgba(255,255,255,1) 100%)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#2563EB',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 12,
              boxShadow: '0 6px 14px rgba(37,99,235,0.28)',
              fontWeight: 800,
            }}
          >
            OC
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#111827' }}>
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Ocean Professional</div>
          </div>
        </div>

        <form onSubmit={submit} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {error && (
            <div
              role="alert"
              style={{
                background: '#FEF2F2',
                color: '#B91C1C',
                border: '1px solid #FECACA',
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                outline: 'none',
                fontSize: 14,
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                outline: 'none',
                fontSize: 14,
              }}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 6,
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 14px',
              borderRadius: 10,
              fontWeight: 700,
              boxShadow: '0 12px 22px rgba(37,99,235,0.25)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div
          style={{
            padding: 18,
            borderTop: '1px solid #F3F4F6',
            background: '#FAFAFB',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
            style={{
              background: 'transparent',
              color: '#2563EB',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
