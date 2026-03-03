import { redirect } from "next/navigation";
import { OrgProfile } from "@/components/settings/org-profile";
import { DisplayNameForm } from "@/components/settings/display-name-form";
import { MembersList } from "@/components/settings/members-list";
import { InviteForm } from "@/components/settings/invite-form";
import { GoogleCalendarSettings } from "./google-calendar";
import { getAuthUrl } from "@/lib/google/calendar";
import { createAdminClient } from "@/lib/supabase/admin";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser, getCurrentOrg } from "@/lib/auth/session";
import { getMembers } from "./actions";

export default async function SettingsPage() {
	const user = await getCurrentUser();
	const org = await getCurrentOrg();
	if (!user || !org) redirect("/dashboard");

	const members = await getMembers();

	let gcalConnected = false;
	let displayName: string | null = null;
	try {
		const supabase = await createAdminClient(user.id);
		const { data: member } = await supabase
			.from("org_members")
			.select("google_calendar_token, display_name")
			.eq("organization_id", org.id)
			.eq("user_id", user.id)
			.single();
		gcalConnected = !!member?.google_calendar_token;
		displayName = member?.display_name ?? null;
	} catch {
		// Ignore
	}

	let gcalAuthUrl: string | null = null;
	try {
		if (
			process.env.GOOGLE_CLIENT_ID &&
			process.env.GOOGLE_CLIENT_SECRET &&
			process.env.GOOGLE_REDIRECT_URI
		) {
			gcalAuthUrl = getAuthUrl(org.id);
		}
	} catch {
		// Ignore
	}

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
				imageUrl={null}
				slug=""
				createdAt={0}
			/>

			<Separator />

			<DisplayNameForm initialDisplayName={displayName} />

			<Separator />

			<MembersList members={members} />

			<Separator />

			<InviteForm orgId={org.id} appUrl={process.env.NEXT_PUBLIC_APP_URL ?? ""} />

			<Separator />

			<GoogleCalendarSettings isConnected={gcalConnected} authUrl={gcalAuthUrl ?? null} />
		</div>
	);
}
