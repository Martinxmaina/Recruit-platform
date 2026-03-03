import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_ENV_MSG =
	"Missing Supabase env. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local in the app directory (e.g. clerk-nextjs/.env.local when running from clerk-nextjs).";

/** Raw service-role client (no RLS context). Use only for reads that don't need app.current_user_*. */
function getServiceRoleClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) throw new Error(SUPABASE_ENV_MSG);
	return createClient<Database>(url, key, { auth: { persistSession: false } });
}

/**
 * Creates a Supabase client using the service role key,
 * then sets app.current_user_id and app.current_user_name via set_user_context
 * so RLS and activity log triggers use the correct user.
 *
 * Use in API routes and server actions for org-scoped queries.
 */
export async function createAdminClient(
	userId: string,
	displayName?: string | null
) {
	const supabase = getServiceRoleClient();
	const { error } = await supabase.rpc("set_user_context", {
		p_user_id: userId,
		p_user_name: displayName ?? null,
	});
	if (error) {
		console.error("Failed to set user context:", error.message);
		throw new Error("Failed to set user context for RLS");
	}
	return supabase;
}

/**
 * Fetches org_members.display_name for the given user in the given org.
 * Used so createAdminClient can set app.current_user_name for activity log.
 */
export async function getMemberDisplayName(
	userId: string,
	organizationId: string
): Promise<string | null> {
	const supabase = getServiceRoleClient();
	const { data } = await supabase
		.from("org_members")
		.select("display_name")
		.eq("user_id", userId)
		.eq("organization_id", organizationId)
		.maybeSingle();
	return data?.display_name ?? null;
}
