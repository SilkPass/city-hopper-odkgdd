import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://xsvuohhpetiebfctswnu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzdnVvaGhwZXRpZWJmY3Rzd251Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTIwNTIsImV4cCI6MjA3OTc4ODA1Mn0.iZS0OQ-2SxdlC36DGSrP5VipnambJwM9E8DDr-5w0ek";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
