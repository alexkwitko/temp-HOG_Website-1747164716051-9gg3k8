import { createAdminUser } from './userManager';

/**
 * Create a single admin user without affecting other database records
 */
export async function createSingleAdmin(email: string, password: string, fullName: string) {
  try {
    console.log(`Creating admin user: ${email}`);
    
    const result = await createAdminUser({
      email,
      password,
      fullName,
      role: 'admin'
    });
    
    if (result.success) {
      console.log('Admin user created successfully!');
      return { success: true, user: result.user };
    } else {
      console.error('Failed to create admin:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error creating admin:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 