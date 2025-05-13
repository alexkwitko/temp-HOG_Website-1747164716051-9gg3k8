import { createClient } from '@supabase/supabase-js';

async function testMethodologyTable() {
  const supabaseUrl = 'https://yxwwmjubpkyzwmvilmsw.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseKey) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Testing methodology table...');
  
  // Test 1: Check if the methodology table exists
  console.log('\nTest 1: Checking if methodology table exists...');
  const { error: tableExistsError } = await supabase.rpc('exec_sql', { 
    sql: `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = 'methodology'
          );` 
  });
  
  if (tableExistsError) {
    console.error('Error checking if methodology table exists:', tableExistsError);
  } else {
    console.log('✅ Table existence check successful');
  }
  
  // Test 2: Check table structure
  console.log('\nTest 2: Checking methodology table structure...');
  const { error: structureError } = await supabase.rpc('exec_sql', { 
    sql: `SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'methodology';` 
  });
  
  if (structureError) {
    console.error('Error checking methodology table structure:', structureError);
  } else {
    console.log('✅ Table structure check successful');
  }
  
  // Test 3: Try to fetch data with direct SQL
  console.log('\nTest 3: Trying to fetch methodology data with SQL...');
  const { error: fetchSqlError } = await supabase.rpc('exec_sql', { 
    sql: `SELECT * FROM public.methodology ORDER BY "order";` 
  });
  
  if (fetchSqlError) {
    console.error('Error fetching methodology data with SQL:', fetchSqlError);
  } else {
    console.log('✅ SQL fetch successful');
  }
  
  // Test 4: Try to fetch data with Supabase client
  console.log('\nTest 4: Trying to fetch methodology data with Supabase client...');
  const { data, error: fetchError } = await supabase
    .from('methodology')
    .select('*')
    .order('order');
  
  if (fetchError) {
    console.error('Error fetching methodology data with Supabase client:', fetchError);
  } else if (!data || data.length === 0) {
    console.error('No data found in methodology table');
  } else {
    console.log(`✅ Found ${data.length} methodology items with Supabase client:`);
    console.log(data);
  }
  
  // Test 5: Check RLS policies
  console.log('\nTest 5: Checking Row Level Security policies...');
  const { error: policyError } = await supabase.rpc('exec_sql', { 
    sql: `SELECT * FROM pg_policies WHERE tablename = 'methodology';` 
  });
  
  if (policyError) {
    console.error('Error checking methodology policies:', policyError);
  } else {
    console.log('✅ Policy check successful');
  }
  
  // Test 6: Try to insert a test record
  console.log('\nTest 6: Trying to insert a test record...');
  const testItem = {
    id: 'test_method_' + Date.now(),
    title: 'Test Method',
    description: 'This is a test methodology item.',
    icon_name: 'Shield',
    order: 999,
    is_active: true
  };
  
  const { error: insertError } = await supabase
    .from('methodology')
    .insert([testItem]);
  
  if (insertError) {
    console.error('Error inserting test methodology item:', insertError);
  } else {
    console.log('✅ Test record insertion successful');
    
    // Clean up the test record
    console.log('Cleaning up test record...');
    const { error: deleteError } = await supabase
      .from('methodology')
      .delete()
      .eq('id', testItem.id);
    
    if (deleteError) {
      console.error('Error deleting test record:', deleteError);
    } else {
      console.log('✅ Test record cleanup successful');
    }
  }
}

testMethodologyTable(); 