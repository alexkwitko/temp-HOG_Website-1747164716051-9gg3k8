import { supabase } from '../lib/supabase/supabaseClient';

/**
 * Run raw SQL directly via the 'exec_sql' RPC function
 * This is useful for admin operations or fixing permissions
 */
export async function executeRawSQL(sql: string) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Exception executing SQL:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err : new Error('Unknown error executing SQL') 
    };
  }
}

/**
 * Fix permissions for the site_settings table
 * This addresses the "permission denied for table users" error
 */
export async function fixSiteSettingsPermissions() {
  const sql = `
    -- 1. Update admin users to ensure consistent role format
    UPDATE auth.users
    SET 
      raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
      ),
      raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{isAdmin}',
        'true'
      )
    WHERE 
      email = 'admin@hogbjj.com' 
      OR raw_app_meta_data->>'role' = 'admin' 
      OR raw_user_meta_data->>'isAdmin' = 'true';

    -- 2. Disable RLS temporarily
    ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

    -- 3. Drop existing policies
    DROP POLICY IF EXISTS "Admins can read and write site_settings" ON site_settings;
    DROP POLICY IF EXISTS "All users can read site_settings" ON site_settings;
    DROP POLICY IF EXISTS "Anonymous users can read site_settings" ON site_settings;

    -- 4. Create proper policies using simplified conditions
    CREATE POLICY "Admins can read and write site_settings" 
    ON site_settings 
    FOR ALL 
    TO authenticated 
    USING (
      (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
    ) 
    WITH CHECK (
      (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
    );

    -- 5. Everyone can read settings
    CREATE POLICY "Everyone can read site_settings" 
    ON site_settings 
    FOR SELECT 
    TO authenticated, anon
    USING (true);

    -- 6. Re-enable RLS
    ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
  `;
  
  return executeRawSQL(sql);
}

/**
 * Get current user permissions and roles for debugging
 */
export async function getCurrentUserPermissions() {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session) {
      return { success: false, error: 'No active session' };
    }
    
    const userId = session.session.user.id;
    
    // Get user metadata
    const { data: userData, error: userError } = await supabase.rpc('get_user_metadata', { 
      user_id: userId 
    });
    
    if (userError) {
      return { success: false, error: userError };
    }
    
    return { 
      success: true, 
      data: {
        userId,
        email: session.session.user.email,
        metadata: userData
      } 
    };
  } catch (err) {
    console.error('Error getting user permissions:', err);
    return { success: false, error: err };
  }
} 