import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Returns a service-role Supabase client that bypasses RLS.
 * Used only for org sync operations (not user-scoped queries).
 */
function getServiceClient(): ReturnType<typeof createClient<Database>> | null {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) {
		return null;
	}
	return createClient<Database>(url, key, { auth: { persistSession: false } });
}

const SUPABASE_ENV_MSG =
	"Supabase env missing. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local in the app directory (e.g. clerk-nextjs/.env.local when running from clerk-nextjs).";

/**
 * Ensures the Supabase user has at least one organization.
 * If no org_members row exists, creates a default org and adds the user as admin.
 * Returns the organization id (existing or newly created).
 */
export async function ensureUserHasOrg(
	supabaseUserId: string,
	email?: string
): Promise<string | null> {
	const supabase = getServiceClient();
	if (!supabase) {
		console.warn(SUPABASE_ENV_MSG);
		return null;
	}

	const { data: existing } = await supabase
		.from("org_members")
		.select("organization_id")
		.eq("user_id", supabaseUserId)
		.limit(1)
		.maybeSingle();

	if (existing) return existing.organization_id;

	const orgName = email ? `${email.split("@")[0]}'s Organization` : "My Organization";
	const { data: org, error: orgError } = await supabase
		.from("organizations")
		.insert({ name: orgName, clerk_org_id: null })
		.select("id")
		.single();

	if (orgError) {
		console.error("Failed to create organization:", orgError.message);
		throw new Error(`Org creation failed: ${orgError.message}`);
	}

	const { error: memberError } = await supabase.from("org_members").insert({
		organization_id: org.id,
		user_id: supabaseUserId,
		role: "admin",
	});

	if (memberError) {
		console.error("Failed to add org member:", memberError.message);
		throw new Error(`Org member creation failed: ${memberError.message}`);
	}

	return org.id;
}
