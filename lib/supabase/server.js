import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createServerClient() {
  const rawUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!rawUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  // Bersihkan trailing slash atau /rest/v1 jika tidak sengaja disertakan
  const supabaseUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export { createServerClient as createClient };
export default createServerClient;
