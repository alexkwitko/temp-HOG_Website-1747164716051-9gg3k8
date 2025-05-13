// Re-export from the main supabase client to avoid duplication
// This ensures all imports from "../lib/supabase/supabaseClient" will work correctly

import { supabase, testSupabaseConnection } from '../supabaseClient';

// Log for debugging
console.log('Using consolidated Supabase client (from supabase directory)');

export { supabase, testSupabaseConnection }; 