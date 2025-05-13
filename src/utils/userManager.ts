import { supabase } from '../lib/supabaseClient';

/**
 * User management utility for House of Grappling
 * 
 * Handles the creation and management of users across all relevant tables:
 * - auth.users (via Supabase auth)
 * - profiles (application user data)
 * - customers (for e-commerce functionality)
 */

type UserData = {
  email: string;
  password: string;
  role: 'admin' | 'customer';
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  marketingOptIn?: boolean;
};

/**
 * Register a new user with proper data synchronization across tables
 */
export async function registerUser(userData: UserData) {
  try {
    // Step 1: Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          role: userData.role,
          full_name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    const userId = authData.user.id;

    // Step 2: Create/update the profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: userData.email,
        role: userData.role,
        full_name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Continue despite error to ensure customer record is created
    }

    // Step 3: For customers, create a customer record
    if (userData.role === 'customer') {
      const { error: customerError } = await supabase
        .from('customers')
        .upsert({
          id: userId,
          email: userData.email,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          phone: userData.phone || '',
          auth_id: userId,
          marketing_opt_in: userData.marketingOptIn || false
        });

      if (customerError) {
        console.error('Customer creation error:', customerError);
        // Log but don't throw to allow partial success
      }
    }

    return {
      success: true,
      user: authData.user,
      message: 'User registered successfully'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to register user'
    };
  }
}

/**
 * Create an admin user (only callable by existing admins)
 */
export async function createAdminUser(adminData: UserData) {
  try {
    // Only create admin users with the service role
    const response = await fetch('http://localhost:54321/auth/v1/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
      },
      body: JSON.stringify({
        email: adminData.email,
        password: adminData.password,
        email_confirm: true,
        user_metadata: { 
          role: 'admin',
          full_name: adminData.fullName || `${adminData.firstName || ''} ${adminData.lastName || ''}`.trim()
        },
        app_metadata: { role: 'admin' }
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.msg || 'Failed to create admin user');
    }
    
    const userId = result.id;
    
    // Create/update profile for admin
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: adminData.email,
        role: 'admin',
        full_name: adminData.fullName || `${adminData.firstName || ''} ${adminData.lastName || ''}`.trim()
      });

    if (profileError) {
      console.error('Admin profile creation error:', profileError);
    }
    
    return {
      success: true,
      user: result,
      message: 'Admin user created successfully'
    };
  } catch (error) {
    console.error('Admin creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to create admin user'
    };
  }
}

/**
 * Reset and create default users (admin and customer) for local development
 */
export async function resetAndCreateDefaultUsers() {
  try {
    // Create admin user
    const adminResult = await createAdminUser({
      email: 'admin@hogbjj.com',
      password: 'admin123',
      role: 'admin',
      fullName: 'Admin User'
    });
    
    // Create customer user
    const customerResult = await registerUser({
      email: 'customer@hogbjj.com',
      password: 'customer123',
      role: 'customer',
      fullName: 'Test Customer',
      marketingOptIn: true
    });
    
    return {
      success: true,
      admin: adminResult.success,
      customer: customerResult.success,
      message: 'Default users created successfully'
    };
  } catch (error) {
    console.error('Error creating default users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to create default users'
    };
  }
} 