import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or localStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = localStorage.getItem('kps_supabase_url');
  const localKey = localStorage.getItem('kps_supabase_anon_key');

  const url = localUrl || envUrl || '';
  const anonKey = localKey || envKey || '';

  return {
    url,
    anonKey,
    isConfigured: !!(url && anonKey && url.startsWith('http')),
  };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (url && anonKey) {
    localStorage.setItem('kps_supabase_url', url.trim());
    localStorage.setItem('kps_supabase_anon_key', anonKey.trim());
  } else {
    localStorage.removeItem('kps_supabase_url');
    localStorage.removeItem('kps_supabase_anon_key');
  }
};

let cachedClient: SupabaseClient | null = null;
let lastClientKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  const currentKey = `${config.url}::${config.anonKey}`;
  if (!cachedClient || lastClientKey !== currentKey) {
    try {
      cachedClient = createClient(config.url, config.anonKey);
      lastClientKey = currentKey;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return cachedClient;
};

// Check if cloud database is reachable
export const testSupabaseConnection = async (url: string, key: string): Promise<{ success: boolean; message: string }> => {
  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('samaj_persons').select('id').limit(1);
    
    // Even if table doesn't exist yet, a response with code 42P01 (relation does not exist) or success means connection is valid!
    if (!error || error.code === '42P01') {
      return {
        success: true,
        message: 'સફળતાપૂર્વક સુપાબેઝ ક્લાઉડ સાથે જોડાઈ ગયું! / Successfully connected to Supabase Cloud Database!',
      };
    }

    return {
      success: false,
      message: `કનેક્શન નિષ્ફળ: ${error.message} (${error.code})`,
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'કનેક્શન નિષ્ફળ થયું.',
    };
  }
};
