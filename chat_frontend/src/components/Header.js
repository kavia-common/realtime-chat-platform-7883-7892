import React from 'react';
import { useAuth } from '../contexts/AuthContext';

// PUBLIC_INTERFACE
export default function Header() {
  const { user, signout } = useAuth();

  return (
    <header
      className="app-header"
      style={{
        background: 'linear-gradient(180deg, rgba(37,99,235,0.06) 0%, rgba(249,250,251,1) 100%)',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            backgroundColor: '#2563EB',
            color: '#ffffff',
            display: 'grid',
            placeItems: 'center',
            borderRadius: 10,
            boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
            fontWeight: 800,
          }}
          aria-label="Ocean Chat"
        >
          OC
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#111827' }}>Ocean Chat</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Modern real-time chat</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#FFFFFF',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#10B981',
                  borderRadius: '9999px',
                  boxShadow: '0 0 0 3px rgba(16,185,129,0.15)',
                }}
              />
              <span style={{ fontSize: 14, color: '#111827' }}>{user.email}</span>
            </div>
            <button
              onClick={signout}
              style={{
                backgroundColor: '#F59E0B',
                border: 'none',
                color: '#111827',
                fontWeight: 700,
                padding: '8px 12px',
                borderRadius: 8,
                boxShadow: '0 8px 16px rgba(245,158,11,0.25)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(1px)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              aria-label="Sign out"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
