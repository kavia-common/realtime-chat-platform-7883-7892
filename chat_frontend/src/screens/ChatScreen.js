import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOnlineUsers } from '../hooks/useOnlineUsers';
import { useRealtimeMessages } from '../hooks/useRealtimeMessages';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

// PUBLIC_INTERFACE
export default function ChatScreen() {
  const { user } = useAuth();
  const { users } = useOnlineUsers(user);
  const { messages, loading, sendMessage } = useRealtimeMessages(user);

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div
          className="sidebar-wrapper"
          style={{
            display: 'none',
            borderRight: '1px solid #E5E7EB',
          }}
        />
        <div
          style={{
            display: 'flex',
            minHeight: 0,
            flex: 1,
          }}
        >
          <div className="sidebar-container" style={{ display: 'none' }} />
          {/* Responsive: Sidebar hidden on very small screens */}
          <div className="sidebar-desktop" style={{ display: 'none' }} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '280px 1fr',
              width: '100%',
            }}
          >
            <Sidebar users={users} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#FFFFFF',
                borderLeft: '1px solid #F3F4F6',
                borderRight: '1px solid #F3F4F6',
              }}
            >
              {loading ? (
                <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: '#6B7280' }}>
                  Loading messages...
                </div>
              ) : (
                <MessageList messages={messages} currentUser={user} />
              )}
              <MessageInput onSend={sendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
