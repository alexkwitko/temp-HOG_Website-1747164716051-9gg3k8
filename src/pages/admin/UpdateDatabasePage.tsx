import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';

const UpdateDatabasePage: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const logMessage = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  // Function for creating necessary stored procedures
  const createHelperFunctions = async () => {
    logMessage("Creating helper database functions...");
    
    try {
      // Create function to check if a table exists
      const { error: createTableFnError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            CREATE OR REPLACE FUNCTION create_table_if_not_exists(
              table_name text, 
              column_definitions text
            ) RETURNS void AS $$
            BEGIN
              IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = table_name) THEN
                EXECUTE format('CREATE TABLE %I (%s)', table_name, column_definitions);
              END IF;
            END;
            $$ LANGUAGE plpgsql;
          `
        }
      );
      
      if (createTableFnError) {
        throw new Error(`Error creating create_table_if_not_exists function: ${createTableFnError.message}`);
      }
      
      // Create function to add a column if it doesn't exist
      const { error: addColumnFnError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            CREATE OR REPLACE FUNCTION add_column_if_not_exists(
              table_name text, 
              column_name text, 
              column_type text
            ) RETURNS void AS $$
            BEGIN
              IF NOT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = $1 AND column_name = $2
              ) THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
                  table_name, column_name, column_type);
              END IF;
            END;
            $$ LANGUAGE plpgsql;
          `
        }
      );
      
      if (addColumnFnError) {
        throw new Error(`Error creating add_column_if_not_exists function: ${addColumnFnError.message}`);
      }
      
      logMessage("Helper functions created successfully!");
      return true;
    } catch (error) {
      logMessage(`Error creating helper functions: ${(error as Error).message}`);
      return false;
    }
  };

  // Update database for color palette hierarchy
  const updatePaletteHierarchy = async () => {
    logMessage("Beginning color palette hierarchy setup...");
    
    try {
      // First ensure helper functions exist
      const functionsCreated = await createHelperFunctions();
      if (!functionsCreated) {
        throw new Error("Failed to create helper functions");
      }
      
      // Create home_page_config table
      const { error: createTableError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            SELECT create_table_if_not_exists(
              'home_page_config',
              'id serial primary key, palette_id text, use_site_palette boolean default true'
            );
          `
        }
      );
      
      if (createTableError) {
        throw new Error(`Error creating home_page_config table: ${createTableError.message}`);
      }
      
      logMessage("Created home_page_config table");
      
      // Add palette_override column to home_page_components
      const { error: addColumnError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            SELECT add_column_if_not_exists(
              'home_page_components',
              'palette_override',
              'text'
            );
          `
        }
      );
      
      if (addColumnError) {
        throw new Error(`Error adding palette_override column: ${addColumnError.message}`);
      }
      
      logMessage("Added palette_override column to home_page_components");
      
      // Add hero text background columns
      const { error: textBgEnabledError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            SELECT add_column_if_not_exists(
              'home_page_components',
              'text_background_enabled',
              'boolean default false'
            );
          `
        }
      );
      
      if (textBgEnabledError) {
        throw new Error(`Error adding text_background_enabled column: ${textBgEnabledError.message}`);
      }
      
      const { error: textBgColorError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            SELECT add_column_if_not_exists(
              'home_page_components',
              'text_background_color',
              'text default ''rgba(0,0,0,0.7)'''
            );
          `
        }
      );
      
      if (textBgColorError) {
        throw new Error(`Error adding text_background_color column: ${textBgColorError.message}`);
      }
      
      const { error: textBgOpacityError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            SELECT add_column_if_not_exists(
              'home_page_components',
              'text_background_opacity',
              'integer default 70'
            );
          `
        }
      );
      
      if (textBgOpacityError) {
        throw new Error(`Error adding text_background_opacity column: ${textBgOpacityError.message}`);
      }
      
      logMessage("Added hero text background columns to home_page_components");
      
      // Make sure the site_settings table has the color_palette_settings_json column
      const { error: addJsonColumnError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            SELECT add_column_if_not_exists(
              'site_settings',
              'color_palette_settings_json',
              'jsonb'
            );
          `
        }
      );
      
      if (addJsonColumnError) {
        throw new Error(`Error adding color_palette_settings_json column: ${addJsonColumnError.message}`);
      }
      
      logMessage("Added color_palette_settings_json column to site_settings");
      
      // Set up default row in home_page_config
      const { error: insertDefaultError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            INSERT INTO home_page_config (id, palette_id, use_site_palette)
            VALUES (1, NULL, true)
            ON CONFLICT (id) DO NOTHING;
          `
        }
      );
      
      if (insertDefaultError) {
        throw new Error(`Error inserting default config: ${insertDefaultError.message}`);
      }
      
      logMessage("Inserted default row in home_page_config");
      
      // Add RLS policy for home_page_config
      const { error: rlsError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            ALTER TABLE home_page_config ENABLE ROW LEVEL SECURITY;
            
            DROP POLICY IF EXISTS select_all ON home_page_config;
            CREATE POLICY select_all ON home_page_config 
              FOR SELECT 
              USING (true);
            
            DROP POLICY IF EXISTS update_admin ON home_page_config;
            CREATE POLICY update_admin ON home_page_config 
              FOR UPDATE 
              USING (auth.role() = 'authenticated')
              WITH CHECK (auth.role() = 'authenticated');
            
            DROP POLICY IF EXISTS insert_admin ON home_page_config;
            CREATE POLICY insert_admin ON home_page_config 
              FOR INSERT 
              WITH CHECK (auth.role() = 'authenticated');
          `
        }
      );
      
      if (rlsError) {
        throw new Error(`Error setting up RLS policies: ${rlsError.message}`);
      }
      
      logMessage("Set up RLS policies for home_page_config");
      
      // Make sure the color palette related entries exist in site_settings
      const { error: insertPaletteError } = await supabase.rpc(
        'exec_sql', 
        { 
          sql_string: `
            INSERT INTO site_settings (key, value, type, label, color_palette_settings_json)
            VALUES (
              'color_palette', 
              'default', 
              'json', 
              'Color Palette Settings',
              '{"globalPaletteId": "monochrome", "useUniformColors": true}'
            )
            ON CONFLICT (key) DO NOTHING;
          `
        }
      );
      
      if (insertPaletteError) {
        throw new Error(`Error inserting palette settings: ${insertPaletteError.message}`);
      }
      
      logMessage("Inserted default color palette settings");
      
      logMessage("Color palette hierarchy setup completed successfully!");
      return true;
    } catch (error) {
      logMessage(`Error setting up color palette hierarchy: ${(error as Error).message}`);
      return false;
    }
  };

  const runMigration = async () => {
    setRunning(true);
    setSuccess(null);
    setLogs([]);
    
    try {
      logMessage("Starting database update...");
      const success = await updatePaletteHierarchy();
      setSuccess(success);
      
      if (success) {
        logMessage("Database update completed successfully!");
      } else {
        logMessage("Database update failed!");
      }
    } catch (error) {
      logMessage(`Unexpected error: ${(error as Error).message}`);
      setSuccess(false);
    } finally {
      setRunning(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Database Update - Color Palette Hierarchy</h1>
        
        <div className="mb-6">
          <p className="mb-4">
            This migration will set up the necessary database structure for the color palette hierarchy system:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Create home_page_config table for page-level palette settings</li>
            <li>Add palette_override column to home_page_components</li>
            <li>Add hero text background settings columns</li>
            <li>Add color_palette_settings_json column to site_settings</li>
            <li>Set up default values and RLS policies</li>
          </ul>
          <p className="text-sm text-text mb-4">
            <strong>WARNING:</strong> Make sure to backup your database before running this migration. 
            While this migration should be safe to run multiple times, it's always good to have a backup.
          </p>
        </div>
        
        <div className="mb-6">
          <button
            onClick={runMigration}
            disabled={running}
            className={`px-4 py-2 rounded font-medium ${
              running 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {running ? 'Running Migration...' : 'Run Migration'}
          </button>
        </div>
        
        {logs.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Migration Log:</h2>
            <div className="bg-black text-white p-4 rounded overflow-auto max-h-96">
              {logs.map((log, index) => (
                <div key={index} className="font-mono text-sm">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {success !== null && (
          <div className={`p-4 rounded ${
            success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {success 
              ? 'Migration completed successfully!' 
              : 'Migration failed. Check the logs for details.'}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UpdateDatabasePage; 