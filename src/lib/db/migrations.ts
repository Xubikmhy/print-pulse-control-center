
import { supabase } from './config';

/**
 * Apply database migrations
 * This function can be used to modify schema as the application evolves
 */
export const applyMigrations = async () => {
  try {
    // Example migration: Add a new column to an existing table
    // You would add new migrations here as your schema evolves
    
    // Migration 1: Add 'color' column to departments table if it doesn't exist
    const { error: migration1Error } = await supabase.rpc('exec', {
      query: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'departments' AND column_name = 'color'
          ) THEN
            ALTER TABLE departments ADD COLUMN color TEXT;
          END IF;
        END
        $$;
      `
    } as any); // Use 'as any' to overcome the type constraint
    
    if (migration1Error) {
      console.error('Migration 1 failed:', migration1Error);
      return { success: false, error: migration1Error };
    }
    
    return { success: true, message: 'All migrations applied successfully' };
  } catch (error: any) {
    console.error('Error applying migrations:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if the required database features are enabled in Supabase
 */
export const checkSupabaseFeatures = async () => {
  try {
    // Try to execute a simple RPC function to check if functions are enabled
    const { data, error } = await supabase.rpc('exec', { 
      query: 'SELECT 1 as test;' 
    } as any); // Use 'as any' to overcome the type constraint
    
    if (error) {
      // If this fails, it might mean that database functions are not enabled
      return { 
        success: false, 
        message: 'Database functions may not be enabled in your Supabase project.',
        error: error.message
      };
    }
    
    return { success: true, message: 'Required features are enabled' };
  } catch (error: any) {
    console.error('Error checking Supabase features:', error);
    return { 
      success: false, 
      message: 'Could not verify Supabase features',
      error: error.message
    };
  }
};
