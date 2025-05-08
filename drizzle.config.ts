
import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.VITE_DATABASE_URL || '',
  },
  // Ensure this runs only in Node.js environments
  verbose: true,
  strict: true,
} satisfies Config;
