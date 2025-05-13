import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values
// These will need to be updated with the correct values from the Supabase dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Enhanced debugging for auth issues
const isDebug = process.env.NODE_ENV === 'development' || import.meta.env.VITE_DEBUG_AUTH === 'true';

// Log connection details for debugging
if (isDebug) {
  console.log('*** SUPABASE AUTH DEBUG MODE ***');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Using remote environment:', !supabaseUrl.includes('localhost'));
  console.log('Anon key available:', !!supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'hog-auth-remote',
    debug: isDebug
  }
});

// Export a function to test connection and auth
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, session: data.session, error: null };
  } catch (err) {
    console.error('Supabase connection test failed:', err);
    return { success: false, session: null, error: err };
  }
}; 