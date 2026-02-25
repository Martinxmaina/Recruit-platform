import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

export type CurrentOrg = { id: string; name: string };

/**
 * Get the current Supabase session (server-side).
 * Returns null if env is missing or Supabase is unreachable.
 */
export async function getSession() {
	try {
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
		if (!url || !anonKey) return null;
		const supabase = await createClient();
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session;
	} catch {
		return null;
	}
}

/**
 * Get the current authenticated user from the session, or null.
 */
export async function getCurrentUser(): Promise<User | null> {
	const session = await getSession();
	return session?.user ?? null;
}

/**
 * Get the current user's organization (first org from org_members).
 * Returns null if user has no org or env is missing; call ensureUserHasOrg then re-fetch if needed.
 */
export async function getCurrentOrg(): Promise<CurrentOrg | null> {
	const user = await getCurrentUser();
	if (!user) return null;
	try {
		const supabase = await createAdminClient(user.id);
		const { data: member } = await supabase
			.from("org_members")
			.select("organization_id, organizations(id, name)")
			.eq("user_id", user.id)
			.limit(1)
			.maybeSingle();

		if (!member || !member.organizations) return null;
		const org = member.organizations as { id: string; name: string };
		return { id: org.id, name: org.name };
	} catch {
		return null;
	}
}
