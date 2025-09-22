import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client initialization using environment variables.
 * Requires:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const requiredEnvVars = {
  REACT_APP_SUPABASE_URL: supabaseUrl,
  REACT_APP_SUPABASE_KEY: supabaseKey,
  REACT_APP_SITE_URL: process.env.REACT_APP_SITE_URL,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    redirectTo: process.env.REACT_APP_SITE_URL,
  },
});
