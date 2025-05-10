
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log connection info in development mode
if (import.meta.env.DEV && !supabaseUrl) {
  console.warn('Missing Supabase URL. Please check your .env file');
}

if (import.meta.env.DEV && !supabaseAnonKey) {
  console.warn('Missing Supabase Anon Key. Please check your .env file');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
  db: {
    schema: 'public',
  },
});

// Enable query logging if specified in .env
if (import.meta.env.VITE_ENABLE_DB_LOGGING === 'true') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Supabase Auth Event:', event);
  });
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
