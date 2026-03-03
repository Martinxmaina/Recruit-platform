"use server";

import { randomBytes } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserOrg } from "@/lib/api/helpers";
import { revalidatePath } from "next/cache";
import { sendInviteEmail } from "@/lib/email/invite";

/**
 * Update the current user's display name (shown in activity log).
 */
export async function updateMyDisplayName(displayName: string | null) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const { error } = await supabase
		.from("org_members")
		.update({ display_name: displayName?.trim() || null })
		.eq("organization_id", ctx.orgId)
		.eq("user_id", ctx.userId);

	if (error) {
		console.error("Display name update error:", error.message);
		return { error: error.message };
	}
	revalidatePath("/settings");
	return { success: true };
}

interface InviteResult {
	success: boolean;
	message: string;
}

/** Map form role (org:admin / org:member) to DB role. */
function mapInviteRole(formRole: string): string {
	if (formRole === "org:admin") return "admin";
	if (formRole === "org:member") return "member";
	return "member";
}

/**
 * Server action to invite a member to the current organization.
 * Creates an invitation, sends email with sign-up link; user is added to org on sign-up.
 */
export async function inviteMemberAction(
	_prev: InviteResult,
	formData: FormData
): Promise<InviteResult> {
	const ctx = await getCurrentUserOrg();
	if (!ctx) {
		return { success: false, message: "Not authenticated or no organization selected." };
	}

	const email = (formData.get("email") as string)?.trim();
	if (!email || !email.includes("@")) {
		return { success: false, message: "Please provide a valid email address." };
	}

	const formRole = (formData.get("role") as string) || "org:member";
	const role = mapInviteRole(formRole);

	const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
	if (!appUrl) {
		return {
			success: false,
			message:
				"Set NEXT_PUBLIC_APP_URL in .env so invite emails contain the correct sign-up link.",
		};
	}
	if (!process.env.RESEND_API_KEY || !process.env.INVITE_FROM_EMAIL) {
		return {
			success: false,
			message:
				"Email not configured. Set RESEND_API_KEY and INVITE_FROM_EMAIL in .env",
		};
	}

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);

	// Optional: avoid duplicate pending invite for same org+email
	const { data: existing } = await supabase
		.from("invitations")
		.select("id")
		.eq("organization_id", ctx.orgId)
		.eq("email", email)
		.is("used_at", null)
		.gt("expires_at", new Date().toISOString())
		.limit(1)
		.maybeSingle();
	if (existing) {
		return {
			success: false,
			message: "An invitation was already sent to this email.",
		};
	}

	const token = randomBytes(32).toString("hex");
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7);

	const { error: insertError } = await supabase.from("invitations").insert({
		organization_id: ctx.orgId,
		email,
		role,
		token,
		expires_at: expiresAt.toISOString(),
	});

	if (insertError) {
		console.error("Invitation insert error:", insertError.message);
		return { success: false, message: insertError.message };
	}

	const signUpUrl = `${appUrl}/sign-up?invite=${token}`;

	let orgName: string | undefined;
	const { data: orgRow } = await supabase
		.from("organizations")
		.select("name")
		.eq("id", ctx.orgId)
		.single();
	if (orgRow?.name) orgName = orgRow.name;

	const sendResult = await sendInviteEmail({
		to: email,
		signUpUrl,
		inviterName: ctx.displayName ?? undefined,
		orgName,
	});
	if (sendResult.error) {
		return { success: false, message: sendResult.error };
	}

	revalidatePath("/settings");
	return { success: true, message: `Invitation sent to ${email}.` };
}

/**
 * Accept an invitation after sign-up: add user to the invited org and mark invite used.
 * Called from signUp action when formData contains invite token.
 */
export async function acceptInvite(userId: string, token: string): Promise<void> {
	if (!token?.trim()) return;

	const supabase = await createAdminClient(userId, null);
	const { data: inv } = await supabase
		.from("invitations")
		.select("id, organization_id, role")
		.eq("token", token.trim())
		.is("used_at", null)
		.gt("expires_at", new Date().toISOString())
		.maybeSingle();

	if (!inv) return;

	await supabase.from("org_members").insert({
		organization_id: inv.organization_id,
		user_id: userId,
		role: inv.role,
	});
	await supabase
		.from("invitations")
		.update({ used_at: new Date().toISOString() })
		.eq("id", inv.id);
}

/**
 * Server action to update a member's role in the current organization.
 */
export async function updateMemberRole(membershipId: string, newRole: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const validRoles = ["admin", "member"];
	if (!validRoles.includes(newRole)) return { error: "Invalid role" };

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
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
	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
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

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
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
