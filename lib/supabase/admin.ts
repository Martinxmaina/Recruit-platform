import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_ENV_MSG =
	"Missing Supabase env. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local in the app directory (e.g. clerk-nextjs/.env.local when running from clerk-nextjs).";

/**
 * Creates a Supabase client using the service role key,
 * then sets `app.current_user_id` via a Postgres function
 * so RLS policies resolve correctly for the given user.
 *
 * Use in API routes and server actions for org-scoped queries.
 */
export async function createAdminClient(userId: string) {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) {
		throw new Error(SUPABASE_ENV_MSG);
	}
	const supabase = createClient<Database>(url, key, {
		auth: { persistSession: false },
	});

	// Set user context for RLS via the custom Postgres function
	const { error } = await supabase.rpc("set_user_context", {
		p_user_id: userId,
	});

	if (error) {
		console.error("Failed to set user context:", error.message);
		throw new Error("Failed to set user context for RLS");
	}

	return supabase;
}
