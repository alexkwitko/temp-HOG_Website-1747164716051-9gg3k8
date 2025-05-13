import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the service role key
// NOTE: This should only be used in trusted server environments
// and never exposed to the client side or browser

// Use hardcoded values instead of environment variables for consistency
const supabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase URL or service role key. Make sure to set them in your .env file.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey); 