
import { supabase } from '@/integrations/supabase/client';

// Log connection info in development mode
if (import.meta.env.DEV) {
  console.log('Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL || 'Not set');
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('Missing Supabase URL. Please check your .env file');
  }
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase Anon Key. Please check your .env file');
  }
}

// Test the connection and export connection status
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('departments').select('count').single();
    if (error) throw error;
    console.log('Supabase connection successful');
    return { success: true, message: 'Connection successful' };
  } catch (error: any) {
    console.error('Supabase connection failed:', error.message);
    return { success: false, message: error.message };
  }
};

// We're not using Drizzle directly in the client code
export const db = null;

// Re-export the client for convenience
export { supabase };
