"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface InviteResult {
	success: boolean;
	message: string;
}

/**
 * Server action to invite a member to the current Clerk organization.
 */
export async function inviteMemberAction(
	_prev: InviteResult,
	formData: FormData
): Promise<InviteResult> {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return { success: false, message: "Not authenticated or no organization selected." };
	}

	const email = formData.get("email") as string;
	const role = formData.get("role") as string;

	if (!email || !email.includes("@")) {
		return { success: false, message: "Please provide a valid email address." };
	}

	const validRoles = ["org:admin", "org:member"];
	const clerkRole = validRoles.includes(role) ? role : "org:member";

	try {
		const client = await clerkClient();
		await client.organizations.createOrganizationInvitation({
			organizationId: orgId,
			emailAddress: email,
			role: clerkRole,
			inviterUserId: userId,
		});

		return { success: true, message: `Invitation sent to ${email}.` };
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : "Failed to send invitation.";
		console.error("Invite error:", errorMessage);
		return { success: false, message: errorMessage };
	}
}

/**
 * Server action to update a member's role in the current Clerk organization.
 */
export async function updateMemberRole(membershipId: string, newRole: string) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return { error: "Unauthorized" };

	const validRoles = ["org:admin", "org:member"];
	if (!validRoles.includes(newRole)) return { error: "Invalid role" };

	try {
		const client = await clerkClient();
		await client.organizations.updateOrganizationMembership({
			organizationId: orgId,
			userId: membershipId,
			role: newRole,
		});

		revalidatePath("/settings");
		return { success: true };
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Failed to update role.";
		console.error("Role update error:", msg);
		return { error: msg };
	}
}

/**
 * Server action to remove a member from the current Clerk organization.
 */
export async function removeMember(memberUserId: string) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return { error: "Unauthorized" };

	try {
		const client = await clerkClient();
		await client.organizations.deleteOrganizationMembership({
			organizationId: orgId,
			userId: memberUserId,
		});

		revalidatePath("/settings");
		return { success: true };
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Failed to remove member.";
		console.error("Remove member error:", msg);
		return { error: msg };
	}
}
