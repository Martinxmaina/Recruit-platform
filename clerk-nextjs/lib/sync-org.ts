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

/**
 * Ensures a Clerk organization and its member exist in Supabase.
 *
 * Idempotent: if the org + member already exist, this is a no-op.
 *
 * @param clerkOrgId - The Clerk organization ID (e.g. "org_abc123")
 * @param orgName    - Human-readable org name from Clerk
 * @param userId     - The Clerk user ID (e.g. "user_abc123")
 * @param role       - Role to assign if inserting ("admin" | "recruiter" | "viewer")
 */
const SUPABASE_ENV_MSG =
	"Supabase env missing. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local in the app directory (e.g. clerk-nextjs/.env.local when running from clerk-nextjs).";

export async function ensureOrgInSupabase(
	clerkOrgId: string,
	orgName: string,
	userId: string,
	role: string = "admin"
): Promise<string | null> {
	const supabase = getServiceClient();
	if (!supabase) {
		console.warn(SUPABASE_ENV_MSG);
		return null;
	}

	// 1. Upsert the organization (insert if clerk_org_id doesn't exist yet)
	const { data: org, error: orgError } = await supabase
		.from("organizations")
		.upsert(
			{ clerk_org_id: clerkOrgId, name: orgName },
			{ onConflict: "clerk_org_id" }
		)
		.select("id")
		.single();

	if (orgError) {
		console.error("Failed to upsert organization:", orgError.message);
		throw new Error(`Org sync failed: ${orgError.message}`);
	}

	// 2. Upsert the org member (insert if user_id + organization_id pair doesn't exist)
	const { error: memberError } = await supabase
		.from("org_members")
		.upsert(
			{
				organization_id: org.id,
				user_id: userId,
				role,
			},
			{ onConflict: "organization_id,user_id" }
		);

	if (memberError) {
		console.error("Failed to upsert org member:", memberError.message);
		throw new Error(`Org member sync failed: ${memberError.message}`);
	}

	return org.id;
}
