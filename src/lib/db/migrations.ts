
import { supabase } from './config';

/**
 * Execute a migration
 */
export const executeMigration = async (version: number, sql: string) => {
  try {
    // Check if migration already applied
    const { data: migrationExists, error: checkError } = await supabase.rpc('exec', {
      query: `
        SELECT EXISTS (
          SELECT 1 FROM migration_history 
          WHERE version = ${version}
        ) as exists
      `
    } as any); // Use 'as any' to overcome the type constraint

    if (checkError) {
      console.error(`Error checking migration ${version}:`, checkError);
      return { success: false, message: checkError.message };
    }

    // If migration already applied, skip it
    if (migrationExists && Array.isArray(migrationExists) && migrationExists.length > 0 && migrationExists[0].exists) {
      console.log(`Migration ${version} already applied`);
      return { success: true, message: `Migration ${version} already applied` };
    }

    // Execute the migration
    const { error: execError } = await supabase.rpc('exec', {
      query: sql
    } as any); // Use 'as any' to overcome the type constraint

    if (execError) {
      console.error(`Error executing migration ${version}:`, execError);
      return { success: false, message: execError.message };
    }

    // Record the migration
    const { error: recordError } = await supabase.rpc('exec', {
      query: `
        INSERT INTO migration_history (version, applied_at)
        VALUES (${version}, NOW())
      `
    } as any); // Use 'as any' to overcome the type constraint

    if (recordError) {
      console.error(`Error recording migration ${version}:`, recordError);
      return { success: false, message: recordError.message };
    }

    return { success: true, message: `Migration ${version} applied successfully` };
  } catch (error: any) {
    console.error(`Migration ${version} failed:`, error);
    return { success: false, message: error.message };
  }
};

/**
 * Initialize migration system by creating the migration_history table if it doesn't exist
 */
export const initMigrations = async () => {
  try {
    const { error } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS migration_history (
          version INT PRIMARY KEY,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          description TEXT
        )
      `
    } as any); // Use 'as any' to overcome the type constraint

    if (error) {
      console.error('Failed to initialize migrations:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error initializing migrations:', error);
    return false;
  }
};
