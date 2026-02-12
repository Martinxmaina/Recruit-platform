import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type AppRole = "admin" | "recruiter" | "client";

/**
 * Returns the current user's role within the organization.
 * Falls back to "recruiter" if no role is found.
 */
export async function getCurrentRole(): Promise<AppRole> {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return "recruiter";

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return "recruiter";

	const { data: member } = await supabase
		.from("org_members")
		.select("role")
		.eq("organization_id", org.id)
		.eq("user_id", userId)
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
