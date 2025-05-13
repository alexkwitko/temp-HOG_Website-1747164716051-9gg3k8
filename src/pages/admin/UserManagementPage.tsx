import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabaseClient';
import { createAdminUser } from '../../utils/userManager';
import { User } from '@supabase/supabase-js';

type UserWithProfile = {
  id: string;
  email: string;
  role: string;
  fullName: string;
  created_at: string;
  last_sign_in?: string;
};

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // New user form state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'customer'>('customer');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  
  // Load users
  const loadUsers = async () => {
    setLoading(true);
    
    try {
      // Get auth users
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (authError) throw authError;
      
      const mappedUsers = authUsers.map(user => ({
        id: user.id,
        email: user.email || '',
        role: user.role || 'customer',
        fullName: user.full_name || '',
        created_at: user.created_at || '',
        last_sign_in: user.last_sign_in || ''
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load users on initial page load
  useEffect(() => {
    loadUsers();
  }, []);
  
  // Create new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    setCreateError('');
    setCreateSuccess('');
    
    try {
      // Validate
      if (!newEmail || !newPassword || !newFullName) {
        throw new Error('All fields are required');
      }
      
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const result = await createAdminUser({
        email: newEmail,
        password: newPassword,
        fullName: newFullName,
        role: newRole
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create user');
      }
      
      setCreateSuccess(`User ${newEmail} created successfully`);
      
      // Reset form
      setNewEmail('');
      setNewPassword('');
      setNewFullName('');
      setNewRole('customer');
      
      // Refresh user list
      await loadUsers();
      
      // Close modal after a moment
      setTimeout(() => {
        setCreateModalOpen(false);
        setCreateSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      setCreateError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setCreatingUser(false);
    }
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>User Management - House of Grappling Admin</title>
      </Helmet>
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 bg-background text-white rounded hover:bg-green-700"
        >
          Create User
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-background">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{user.fullName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-text hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button className="text-text hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-text">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Create User Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New User</h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-text hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            {createError && (
              <div className="mb-4 p-3 bg-background text-text rounded">
                {createError}
              </div>
            )}
            
            {createSuccess && (
              <div className="mb-4 p-3 bg-background text-text rounded">
                {createSuccess}
              </div>
            )}
            
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className="block text-text mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-text mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-text mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-text mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'customer')}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-text border border-gray-300 rounded mr-2 hover:bg-background"
                  disabled={creatingUser}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-background text-white rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={creatingUser}
                >
                  {creatingUser ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagementPage; 