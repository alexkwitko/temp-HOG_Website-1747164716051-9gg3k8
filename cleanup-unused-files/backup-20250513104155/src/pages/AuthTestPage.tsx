import React, { useState } from 'react';
import AuthDebug from '../components/AuthDebug';
import { Helmet } from 'react-helmet-async';
import { resetAndCreateDefaultUsers } from '../utils/userManager';

const AuthTestPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createTestUsers = async () => {
    setLoading(true);
    setMessage('Creating test users...');
    
    try {
      const result = await resetAndCreateDefaultUsers();
      
      if (result.success) {
        setMessage(`Users created successfully!
Admin: ${result.admin ? 'Success' : 'Failed'}
Customer: ${result.customer ? 'Success' : 'Failed'}`);
      } else {
        setMessage(`Error creating users: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to create users:', err);
      setMessage(`Error creating users: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Auth Test - House of Grappling</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8 text-center">Authentication Test Page</h1>
      
      <div className="mb-6">
        <button
          onClick={createTestUsers}
          disabled={loading}
          className="w-full p-3 bg-background text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Working...' : 'Reset & Create Test Users'}
        </button>
        
        {message && (
          <div className="mt-4 p-4 bg-background rounded">
            <pre className="whitespace-pre-wrap text-sm">{message}</pre>
          </div>
        )}
      </div>
      
      <AuthDebug />
      
      <div className="mt-8 p-4 bg-background rounded max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">Test Credentials:</h2>
        <ul className="list-disc pl-5">
          <li><strong>Admin:</strong> admin@hogbjj.com / admin123</li>
          <li><strong>Customer:</strong> customer@hogbjj.com / customer123</li>
        </ul>
      </div>
    </div>
  );
};

export default AuthTestPage; 