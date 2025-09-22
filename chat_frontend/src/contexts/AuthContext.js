import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signup: async () => {},
  signin: async () => {},
  signout: async () => {},
});

/**
 * AuthProvider provides authentication state and actions across the app.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    (async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // PUBLIC_INTERFACE
  const signup = useCallback(async (email, password) => {
    // Verify SITE_URL is configured
    if (!process.env.REACT_APP_SITE_URL) {
      throw new Error('REACT_APP_SITE_URL environment variable is required for email confirmation');
    }

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.REACT_APP_SITE_URL,
      },
    });
    
    if (signUpError) {
      console.error('Signup error:', signUpError);
      if (signUpError.message.includes('Email rate limit')) {
        throw new Error('Too many signup attempts. Please try again later.');
      }
      throw signUpError;
    }
    
    // Create user profile if signup successful
    if (data?.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          display_name: data.user.email?.split('@')[0] || 'Anonymous',
          online_status: true,
        });
      
      // If profile creation fails, we should handle it but not block auth
      if (profileError) {
        if (profileError.code === '23505') { // Duplicate key error
          console.warn('User profile already exists');
        } else {
          console.error('Error creating user profile:', profileError);
        }
      }
    }
    
    return data;
  }, []);

  // PUBLIC_INTERFACE
  const signin = useCallback(async (email, password) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  // PUBLIC_INTERFACE
  const signout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = {
    user,
    session,
    loading,
    signup,
    signin,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access the Auth context
 */
export function useAuth() {
  return useContext(AuthContext);
}
