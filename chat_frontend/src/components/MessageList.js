import React, { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export default function MessageList({ messages, currentUser }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className="message-list"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        background: '#F9FAFB',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {messages.map((m) => {
        const mine = currentUser && m.user_id === currentUser.id;
        return (
          <div
            key={m.id || `${m.user_id}-${m.created_at}`}
            style={{
              display: 'flex',
              justifyContent: mine ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                background: mine ? '#2563EB' : '#FFFFFF',
                color: mine ? '#FFFFFF' : '#111827',
                border: mine ? '1px solid rgba(37,99,235,0.35)' : '1px solid #E5E7EB',
                padding: '10px 12px',
                borderRadius: 14,
                borderTopRightRadius: mine ? 4 : 14,
                borderTopLeftRadius: mine ? 14 : 4,
                boxShadow: mine
                  ? '0 10px 20px rgba(37,99,235,0.25)'
                  : '0 8px 18px rgba(17,24,39,0.06)',
                transition: 'transform 0.15s ease',
              }}
            >
              {!mine && (
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
                  {m.user_email || 'Anonymous'}
                </div>
              )}
              <div style={{ fontSize: 14, lineHeight: 1.45, wordBreak: 'break-word' }}>
                {m.content}
              </div>
              <div style={{ fontSize: 11, color: mine ? '#E5E7EB' : '#9CA3AF', marginTop: 6 }}>
                {new Date(m.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
