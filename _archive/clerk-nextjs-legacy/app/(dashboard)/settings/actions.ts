"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserOrg } from "@/lib/api/helpers";
import { revalidatePath } from "next/cache";

interface InviteResult {
	success: boolean;
	message: string;
}

/**
 * Server action to invite a member to the current organization.
 * With Supabase Auth, invite by email is not built-in; share the sign-up link.
 */
export async function inviteMemberAction(
	_prev: InviteResult,
	formData: FormData
): Promise<InviteResult> {
	const ctx = await getCurrentUserOrg();
	if (!ctx) {
		return { success: false, message: "Not authenticated or no organization selected." };
	}

	const email = formData.get("email") as string;
	if (!email || !email.includes("@")) {
		return { success: false, message: "Please provide a valid email address." };
	}

	// Supabase does not have built-in org invitations. User can sign up at /sign-up
	// and be added to org via ensureUserHasOrg (first org) or a future "invite" flow.
	return {
		success: false,
		message:
			"Invite by email is not available yet. Share your sign-up link with your team.",
	};
}

/**
 * Server action to update a member's role in the current organization.
 */
export async function updateMemberRole(membershipId: string, newRole: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const validRoles = ["admin", "member"];
	if (!validRoles.includes(newRole)) return { error: "Invalid role" };

	const supabase = await createAdminClient(ctx.userId);
	const { error } = await supabase
		.from("org_members")
		.update({ role: newRole })
		.eq("organization_id", ctx.orgId)
		.eq("user_id", membershipId);

	if (error) {
		console.error("Role update error:", error.message);
		return { error: error.message };
	}

	revalidatePath("/settings");
	return { success: true };
}

/**
 * Server action to remove a member from the current organization.
 */
export async function removeMember(memberUserId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	// Prevent removing self if last admin
	const supabase = await createAdminClient(ctx.userId);
	const { data: members } = await supabase
		.from("org_members")
		.select("user_id, role")
		.eq("organization_id", ctx.orgId);

	const admins = members?.filter((m) => m.role === "admin") ?? [];
	if (memberUserId === ctx.userId && admins.length <= 1) {
		return { error: "Cannot remove the last admin." };
	}

	const { error } = await supabase
		.from("org_members")
		.delete()
		.eq("organization_id", ctx.orgId)
		.eq("user_id", memberUserId);

	if (error) {
		console.error("Remove member error:", error.message);
		return { error: error.message };
	}

	revalidatePath("/settings");
	return { success: true };
}

export type SettingsMember = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	imageUrl: string | null;
	role: string;
	createdAt: number;
};

/**
 * Get organization members from org_members for the current org.
 */
export async function getMembers(): Promise<SettingsMember[]> {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data: rows, error } = await supabase
		.from("org_members")
		.select("user_id, role, created_at")
		.eq("organization_id", ctx.orgId)
		.order("created_at", { ascending: true });

	if (error) {
		console.error("Error fetching members:", error);
		return [];
	}

	return (rows ?? []).map((m) => ({
		id: m.user_id,
		firstName: "",
		lastName: "",
		email: "",
		imageUrl: null,
		role: m.role ?? "member",
		createdAt: m.created_at ? new Date(m.created_at).getTime() : 0,
	}));
}
