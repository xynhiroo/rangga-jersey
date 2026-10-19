import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient as createSsrServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function createAdminClient() {
  const rawUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!rawUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  const supabaseUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
  const cookieStore = await cookies();

  return createSsrServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component ketika cookie store bersifat read-only
        }
      },
    },
  });
}

export { createServerClient as createClient };
export default createServerClient;

