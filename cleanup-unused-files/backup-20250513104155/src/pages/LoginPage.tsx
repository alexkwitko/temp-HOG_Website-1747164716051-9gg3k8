import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { supabase } from '../lib/supabaseClient';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, isAdmin } = useAuth();

  // Suggested defaults for local testing
  useEffect(() => {
    // Prepopulate credentials for faster testing
    if (process.env.NODE_ENV === 'development') {
      setEmail('admin@hogbjj.com');
      setPassword('admin123');
    }
  }, []);

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (user) {
      console.log("User logged in:", user.email);
      console.log("Is admin:", isAdmin);
      console.log("User metadata:", user.user_metadata);
      
      // Check if user is admin based on user metadata
      const userIsAdmin = user.user_metadata?.role === 'admin' || user.email === 'alexkwitko@gmail.com';
      
      if (userIsAdmin) {
        console.log("Redirecting to admin dashboard");
        navigate('/admin');
      } else {
        // For regular users, redirect to home or the page they were trying to access
        const from = location.state?.from?.pathname || '/';
        console.log("Redirecting regular user to:", from);
        navigate(from);
      }
    }
  }, [user, isAdmin, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      // Redirection will be handled by the useEffect above
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Authentication error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      alert('Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-text">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-text">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-text hover:text-red-500"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-background border-l-4 border-red-500 p-4 text-text text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-text rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-text rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-text hover:text-red-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-background hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign in'}
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="pt-4 border-t mt-6 text-xs text-text">
              <p>Development credentials:</p>
              <p>Admin: admin@hogbjj.com / admin123</p>
              <p>Customer: customer@hogbjj.com / customer123</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 