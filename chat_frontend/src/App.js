import React from 'react';
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthScreen from './screens/AuthScreen';
import ChatScreen from './screens/ChatScreen';

/**
 * Root selector that decides whether to show auth or chat.
 */
function RootGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#F9FAFB',
          color: '#6B7280',
        }}
      >
        Initializing...
      </div>
    );
  }

  return user ? <ChatScreen /> : <AuthScreen />;
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <RootGate />
    </AuthProvider>
  );
}

export default App;
