import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrgProfile } from "@/components/settings/org-profile";
import { MembersList } from "@/components/settings/members-list";
import { InviteForm } from "@/components/settings/invite-form";
import { GoogleCalendarSettings } from "./google-calendar";
import { getAuthUrl } from "@/lib/google/calendar";
import { createAdminClient } from "@/lib/supabase/admin";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		redirect("/dashboard");
	}

	const client = await clerkClient();

	// Fetch organization details
	const org = await client.organizations.getOrganization({
		organizationId: orgId,
	});

	// Fetch current members
	const membershipsResponse =
		await client.organizations.getOrganizationMembershipList({
			organizationId: orgId,
			limit: 100,
		});

	const members = membershipsResponse.data.map((m) => ({
		id: m.publicUserData?.userId ?? m.id,
		firstName: m.publicUserData?.firstName ?? "",
		lastName: m.publicUserData?.lastName ?? "",
		email: m.publicUserData?.identifier ?? "",
		imageUrl: m.publicUserData?.imageUrl ?? "",
		role: m.role,
		createdAt: m.createdAt,
	}));

	// Check Google Calendar connection
	let gcalConnected = false;
	try {
		const supabase = await createAdminClient(userId);
		const { data: supaOrg } = await supabase
			.from("organizations")
			.select("id")
			.eq("clerk_org_id", orgId)
			.single();

		if (supaOrg) {
			const { data: member } = await supabase
				.from("org_members")
				.select("google_calendar_token")
				.eq("organization_id", supaOrg.id)
				.eq("user_id", userId)
				.single();
			gcalConnected = !!member?.google_calendar_token;
		}
	} catch {
		// Ignore
	}

	const gcalAuthUrl = getAuthUrl(orgId);

	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<div>
				<h1 className="text-2xl font-bold">Settings</h1>
				<p className="mt-1 text-muted-foreground">
					Manage your organization profile, members, and invitations.
				</p>
			</div>

			<OrgProfile
				name={org.name}
				imageUrl={org.imageUrl}
				slug={org.slug ?? ""}
				createdAt={org.createdAt}
			/>

			<Separator />

			<MembersList members={members} />

			<Separator />

			<InviteForm orgId={orgId} />

			<Separator />

			<GoogleCalendarSettings isConnected={gcalConnected} authUrl={gcalAuthUrl} />
		</div>
	);
}
