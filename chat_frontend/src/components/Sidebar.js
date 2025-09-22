import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar({ users }) {
  return (
    <aside
      className="sidebar"
      style={{
        width: 280,
        minWidth: 220,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ fontWeight: 800, color: '#111827', marginBottom: 8 }}>Online</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {users.length === 0 && (
          <div style={{ color: '#6B7280', fontSize: 14 }}>No one is online right now.</div>
        )}
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 10,
              border: '1px solid #F3F4F6',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                {u.email || 'Unknown'}
              </div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Active</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
