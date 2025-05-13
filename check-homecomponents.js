import { createClient } from '@supabase/supabase-js';

async function checkHomeComponents() {
  const supabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Checking homepage components config...');
  
  try {
    const { data: homeComponents, error: homeComponentsError } = await supabase
      .from('home_components')
      .select('*')
      .order('order');
    
    if (homeComponentsError) {
      console.error('Error querying home_components table:', homeComponentsError);
      
      // Check if table exists
      if (homeComponentsError.code === '42P01') {
        console.log('home_components table does not exist');
      }
      return;
    }
    
    console.log('Home components data:');
    console.log(JSON.stringify(homeComponents, null, 2));
    
    // Check methodology component specifically
    const methodologyComponent = homeComponents?.find(comp => comp.id === 'methodology');
    if (methodologyComponent) {
      console.log('\nMethodology component:');
      console.log(JSON.stringify(methodologyComponent, null, 2));
    } else {
      console.log('\nMethodology component not found in home_components table');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkHomeComponents(); 