"use client";

import { CreateOrganization } from "@clerk/nextjs";

/**
 * Shown when a signed-in user has no active Clerk organization.
 * Prompts them to create or select one before accessing the dashboard.
 */
export function NoOrgScreen() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
			<div className="text-center">
				<h1 className="text-2xl font-bold">Create Your Organization</h1>
				<p className="mt-2 text-muted-foreground">
					You need an organization to access the recruitment dashboard.
					Create one below or ask your admin for an invite.
				</p>
			</div>
			<CreateOrganization
				afterCreateOrganizationUrl="/dashboard"
				skipInvitationScreen={false}
			/>
		</div>
	);
}
