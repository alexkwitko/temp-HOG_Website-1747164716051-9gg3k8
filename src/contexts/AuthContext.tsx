import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';
import { User, AuthError } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  passwordReset: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Helper function to check if user is admin
  const checkIsAdmin = (user: User | null): boolean => {
    if (!user) return false;
    return user.user_metadata?.role === 'admin' || 
           user.email === 'alexkwitko@gmail.com' || 
           user.email === 'admin@hogbjj.com';
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          setIsAdmin(checkIsAdmin(session.user));
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          setIsAdmin(checkIsAdmin(session.user));
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { user: null, error };
      if (data.user) {
        setIsAdmin(checkIsAdmin(data.user));
        return { user: data.user, error: null };
      }
      return { user: null, error: new AuthError('Sign in failed, no user data returned.') };
    } catch (error) {
      console.error('Error signing in:', error);
      return { user: null, error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { user: null, error };
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { user: null, error: error as AuthError };
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      setIsAdmin(false);
      return { error };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error: error as AuthError };
    }
  };

  const passwordReset = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error };
    } catch (error) {
      console.error('Error updating password:', error);
      return { error: error as AuthError };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    passwordReset,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 