import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Verifies the current request is from a logged-in admin.
 * RLS policies already enforce this at the database level — this is a
 * fast, explicit check so API routes can return a clean 401/403 instead
 * of a generic database error.
 */
export async function requireAdmin(): Promise<
  { ok: true; supabase: SupabaseClient; userId: string } | { ok: false; status: number; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, message: "Not signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false, status: 403, message: "Admin access required." };
  }

  return { ok: true, supabase, userId: user.id };
}
