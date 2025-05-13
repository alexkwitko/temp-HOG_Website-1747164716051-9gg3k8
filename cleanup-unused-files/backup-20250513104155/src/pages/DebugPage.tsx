import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Helmet } from 'react-helmet-async';
import { SupabaseClient } from '@supabase/supabase-js';

// Add a helper for type safety
const getSupabaseUrl = (client: SupabaseClient): string => {
  const anyClient = client as any;
  if (anyClient._url && typeof anyClient._url === 'string') {
    return anyClient._url;
  }
  return 'Not available';
};

const DebugPage: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [importInfo, setImportInfo] = useState<string>('');

  useEffect(() => {
    // Show which supabaseClient is being imported
    const importPath = '../lib/supabaseClient';
    
    // Get the internal URL from supabase client
    const url = getSupabaseUrl(supabase);
    
    // Check if cookies are enabled
    const cookiesEnabled = navigator.cookieEnabled ? 'Enabled' : 'Disabled';
    
    // Check local storage
    let localStorageAvailable = 'Available';
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch {
      localStorageAvailable = 'Not available';
    }
    
    setImportInfo(`
Import path: ${importPath}
Connection URL: ${url}
Cookies: ${cookiesEnabled}
LocalStorage: ${localStorageAvailable}
User-Agent: ${navigator.userAgent}
    `);
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setMessage('Testing connection...');
    
    try {
      // Try to connect to Supabase
      const { data, error } = await supabase.from('collections').select('count(*)');
      
      if (error) {
        throw error;
      }
      
      setMessage(`Connection successful! Data: ${JSON.stringify(data)}`);
    } catch (err) {
      console.error('Connection error:', err);
      setMessage(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const signInAsAdmin = async () => {
    setLoading(true);
    setMessage('Signing in as admin...');
    
    try {
      // Clear any existing sessions
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@hogbjj.com',
        password: 'admin123'
      });
      
      if (error) {
        throw error;
      }
      
      setMessage(`Admin sign in successful! User: ${data.user?.email}
User ID: ${data.user?.id}
Role: ${JSON.stringify(data.user?.app_metadata)}
Session: ${data.session ? 'Active' : 'None'}`);
    } catch (err) {
      console.error('Sign in error:', err);
      setMessage(`Sign in error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const signInAsCustomer = async () => {
    setLoading(true);
    setMessage('Signing in as customer...');
    
    try {
      // Clear any existing sessions
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'customer@hogbjj.com',
        password: 'customer123'
      });
      
      if (error) {
        throw error;
      }
      
      setMessage(`Customer sign in successful! User: ${data.user?.email}
User ID: ${data.user?.id}
Role: ${JSON.stringify(data.user?.app_metadata)}
Session: ${data.session ? 'Active' : 'None'}`);
    } catch (err) {
      console.error('Sign in error:', err);
      setMessage(`Sign in error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const signInDirect = async () => {
    setLoading(true);
    setMessage('Signing in directly with admin...');
    
    try {
      // Direct sign-in bypassing any potential issues with auth provider url
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');
      
      const response = await fetch('http://localhost:54321/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          email: 'admin@hogbjj.com',
          password: 'admin123'
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed');
      }
      
      setMessage(`Direct sign in response: ${JSON.stringify(result, null, 2)}`);
      
      // Manually set the session
      if (result.access_token && result.refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token: result.access_token,
          refresh_token: result.refresh_token
        });
        
        if (error) {
          throw error;
        }
        
        setMessage(`Successfully set session manually!
Access token: ${result.access_token.substring(0, 10)}...
User ID: ${result.user?.id || 'Not available'}`);
      }
    } catch (err) {
      console.error('Direct sign in error:', err);
      setMessage(`Direct sign in error: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
        setMessage(`Active session for: ${data.session.user.email}
User ID: ${data.session.user.id}
Metadata: ${JSON.stringify(data.session.user.app_metadata)}
Token expires: ${new Date(data.session.expires_at! * 1000).toLocaleString()}`);
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

  const signOut = async () => {
    setLoading(true);
    setMessage('Signing out...');
    
    try {
      // Also clear localStorage
      localStorage.removeItem('sb-refresh-token');
      localStorage.removeItem('sb-access-token');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setMessage('Signed out successfully and cleared local storage');
    } catch (err) {
      console.error('Sign out error:', err);
      setMessage(`Sign out error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Helmet>
        <title>Debug - House of Grappling</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Supabase Debug Page</h1>
      
      <div className="mb-6 p-4 bg-background rounded">
        <p><strong>Supabase URL:</strong> http://localhost:54321</p>
        {importInfo && (
          <pre className="mt-4 p-3 bg-background rounded-md overflow-x-auto whitespace-pre-wrap text-sm">
            {importInfo}
          </pre>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="p-3 bg-background text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Database Connection
        </button>
        
        <button 
          onClick={signInAsAdmin}
          disabled={loading}
          className="p-3 bg-background text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Sign In as Admin
        </button>
        
        <button 
          onClick={signInAsCustomer}
          disabled={loading}
          className="p-3 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
        >
          Sign In as Customer
        </button>
        
        <button 
          onClick={signInDirect}
          disabled={loading}
          className="p-3 bg-background text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Direct Sign In (Bypass Client)
        </button>
        
        <button 
          onClick={checkSession}
          disabled={loading}
          className="p-3 bg-background text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          Check Current Session
        </button>
        
        <button 
          onClick={signOut}
          disabled={loading}
          className="p-3 bg-background text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Sign Out & Clear Storage
        </button>
      </div>
      
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {message && (
        <div className="p-4 bg-background rounded">
          <pre className="whitespace-pre-wrap">{message}</pre>
        </div>
      )}
    </div>
  );
};

export default DebugPage; 