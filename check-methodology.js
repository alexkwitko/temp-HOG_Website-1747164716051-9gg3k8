import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NjQ4MjYsImV4cCI6MjA2MjE0MDgyNn0.k6A7n8EErBL7750slWm-ftTHjkR3Ofac-mdgHhGcy0E';

async function checkMethodology() {
  console.log('Creating Supabase client...');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Checking methodology table contents...');
  
  try {
    const { data, error } = await supabase
      .from('methodology')
      .select('*')
      .order('order');
    
    if (error) {
      console.error('Error querying methodology table:', error);
      return;
    }
    
    console.log(`Found ${data.length} methodology items:`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkMethodology(); 