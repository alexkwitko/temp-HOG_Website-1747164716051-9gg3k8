import React, { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '../lib/supabaseClient';

const AuthDebug: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('admin@hogbjj.com');
  const [password, setPassword] = useState<string>('admin123');
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested');

  // Helper function to safely access properties that might not exist
  const getSupabaseUrl = (): string => {
    try {
      // @ts-expect-error - Access internal property for debugging only
      const url = supabase._url || 'Not available';
      return url;
    } catch {
      return 'Error accessing URL';
    }
  };

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    setConnectionStatus('Testing...');
    
    try {
      const result = await testSupabaseConnection();
      if (result.success) {
        setConnectionStatus('Connected ✅');
      } else {
        setConnectionStatus(`Error: ${result.error}`);
      }
    } catch (err) {
      setConnectionStatus(`Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    setMessage('Signing in...');
    
    try {
      console.log(`Attempting to sign in with: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      setMessage(`Sign in successful!
User: ${data.user?.email}
Role: ${JSON.stringify(data.user?.app_metadata)}
User Metadata: ${JSON.stringify(data.user?.user_metadata)}
User ID: ${data.user?.id}
Session active: ${data.session ? 'Yes' : 'No'}`);
    } catch (err) {
      console.error('Sign in error:', err);
      setMessage(`Sign in error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setMessage('Signing out...');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setMessage('Signed out successfully');
    } catch (err) {
      console.error('Sign out error:', err);
      setMessage(`Sign out error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    setLoading(true);
    setMessage('Checking session...');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setMessage(`Active session!
User: ${data.session.user.email}
User ID: ${data.session.user.id}
Role: ${JSON.stringify(data.session.user.app_metadata)}
User Metadata: ${JSON.stringify(data.session.user.user_metadata)}
Session expires: ${data.session.expires_at ? new Date(data.session.expires_at * 1000).toLocaleString() : 'N/A'}`);
      } else {
        setMessage('No active session');
      }
    } catch (err) {
      console.error('Session check error:', err);
      setMessage(`Session check error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      setMessage('Please enter an email address');
      return;
    }
    
    setLoading(true);
    setMessage('Sending password reset email...');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      setMessage(`Password reset email sent to ${email}`);
    } catch (err) {
      console.error('Password reset error:', err);
      setMessage(`Password reset error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Auth Debug Tool</h2>
      
      <div className="mb-4 p-3 bg-background rounded">
        <p><strong>Supabase URL:</strong> {getSupabaseUrl()}</p>
        <p><strong>Connection:</strong> {connectionStatus}</p>
        <button 
          onClick={checkConnection}
          className="mt-2 px-2 py-1 bg-background text-xs rounded hover:bg-gray-300"
        >
          Recheck Connection
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-2 mb-4">
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded"
        />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          onClick={signIn}
          disabled={loading}
          className="px-3 py-2 bg-background text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Sign In
        </button>
        <button 
          onClick={signOut}
          disabled={loading}
          className="px-3 py-2 bg-background text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          onClick={checkSession}
          disabled={loading}
          className="px-3 py-2 bg-background text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Check Session
        </button>
        <button 
          onClick={resetPassword}
          disabled={loading}
          className="px-3 py-2 bg-background text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          Reset Password
        </button>
      </div>
      
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {message && (
        <div className="p-4 bg-background rounded">
          <pre className="whitespace-pre-wrap text-sm">{message}</pre>
        </div>
      )}
    </div>
  );
};

export default AuthDebug; 