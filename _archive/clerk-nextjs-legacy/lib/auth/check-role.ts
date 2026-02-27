import { getCurrentUser, getCurrentOrg } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export type AppRole = "admin" | "recruiter" | "client";

/**
 * Returns the current user's role within the current organization.
 * Falls back to "recruiter" if no user, org, or role is found.
 */
export async function getCurrentRole(): Promise<AppRole> {
	const user = await getCurrentUser();
	const org = await getCurrentOrg();
	if (!user || !org) return "recruiter";

	const supabase = await createAdminClient(user.id);
	const { data: member } = await supabase
		.from("org_members")
		.select("role")
		.eq("organization_id", org.id)
		.eq("user_id", user.id)
		.single();

	return (member?.role as AppRole) ?? "recruiter";
}

/**
 * Check if current user has one of the allowed roles.
 */
export async function hasRole(...roles: AppRole[]): Promise<boolean> {
	const currentRole = await getCurrentRole();
	return roles.includes(currentRole);
}
