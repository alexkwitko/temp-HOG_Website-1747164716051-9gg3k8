import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Trash2, UserCheck } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';
import { useAuth } from '../../contexts/useAuth';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { createAdminUser } = useAuth();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would need to use Supabase Functions or a server endpoint
      // to fetch users with admin role, as client-side code can't list all users
      // This is a simplified example that would work with proper backend support
      const { data, error } = await supabase
        .from('admin_users_view') // This would be a view you create in Supabase
        .select('*');
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError('Failed to load admin users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    setSuccess(null);
    
    try {
      await createAdminUser(email, password);
      setSuccess(`Admin user ${email} created successfully. They will need to verify their email before logging in.`);
      setEmail('');
      setPassword('');
      // Refresh the user list
      fetchAdminUsers();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create admin user');
      console.error('Error creating admin user:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Admin Users</h2>
        <p className="text-text">Manage admin user accounts</p>
      </div>

      {error && (
        <div className="bg-background border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-text mr-2" />
            <span className="text-text">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-background border-l-4 border-green-400 p-4 mb-6">
          <div className="flex items-center">
            <UserCheck className="h-5 w-5 text-text mr-2" />
            <span className="text-text">{success}</span>
          </div>
        </div>
      )}

      {/* Create Admin Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-medium text-text mb-4">Create New Admin User</h3>
        
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          {createError && (
            <div className="bg-background border-l-4 border-red-400 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-text mr-2" />
                <span className="text-text">{createError}</span>
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary-500 focus:border-secondary-500"
            />
            <p className="mt-1 text-sm text-text">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              {creating ? 'Creating...' : 'Create Admin User'}
            </button>
          </div>
        </form>
      </div>

      {/* Admin Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-neutral-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-text">
            Current Admin Users
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text">No admin users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-background">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                    Last Sign In
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text">
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString() 
                          : 'Never'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-text hover:text-red-900"
                        onClick={() => {
                          // In a real app, you would implement admin user removal
                          alert('Admin user removal would be implemented here');
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage; 