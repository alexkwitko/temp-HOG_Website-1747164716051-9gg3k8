import { createClient } from '@supabase/supabase-js';

async function checkHomePageComponents() {
  const supabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Checking home_page_components table...');
  
  try {
    const { data: homePageComponents, error: homePageComponentsError } = await supabase
      .from('home_page_components')
      .select('*')
      .order('order');
    
    if (homePageComponentsError) {
      console.error('Error querying home_page_components table:', homePageComponentsError);
      return;
    }
    
    console.log('Home page components data:');
    console.log(JSON.stringify(homePageComponents, null, 2));
    
    // Check methodology component specifically
    const methodologyComponent = homePageComponents?.find(comp => comp.id === 'methodology');
    if (methodologyComponent) {
      console.log('\nMethodology component:');
      console.log(JSON.stringify(methodologyComponent, null, 2));
    } else {
      console.log('\nMethodology component not found in home_page_components table');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkHomePageComponents(); 