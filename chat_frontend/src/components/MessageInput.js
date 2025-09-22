import React, { useCallback, useState } from 'react';

// PUBLIC_INTERFACE
export default function MessageInput({ onSend }) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      setSending(true);
      try {
        await onSend(trimmed);
        setValue('');
      } finally {
        setSending(false);
      }
    },
    [value, onSend]
  );

  return (
    <form
      onSubmit={submit}
      style={{
        borderTop: '1px solid #E5E7EB',
        padding: 12,
        background: '#FFFFFF',
        display: 'flex',
        gap: 10,
      }}
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={sending}
        style={{
          flex: 1,
          padding: '12px 14px',
          borderRadius: 10,
          border: '1px solid #E5E7EB',
          outline: 'none',
          fontSize: 14,
          transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.15)';
          e.currentTarget.style.borderColor = '#2563EB';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = '#E5E7EB';
        }}
      />
      <button
        type="submit"
        disabled={sending}
        style={{
          backgroundColor: '#2563EB',
          color: '#FFFFFF',
          border: 'none',
          padding: '12px 16px',
          borderRadius: 10,
          fontWeight: 700,
          boxShadow: '0 12px 22px rgba(37,99,235,0.25)',
          cursor: sending ? 'not-allowed' : 'pointer',
          opacity: sending ? 0.7 : 1,
        }}
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}
