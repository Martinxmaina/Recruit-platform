import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Header } from "@/components/app-shell/header";
import { NoOrgScreen } from "@/components/app-shell/no-org-screen";
import { CopilotProvider, CopilotPanel } from "@/components/copilot";
import { ensureOrgInSupabase } from "@/lib/sync-org";
import { getNotifications, getUnreadCount } from "@/app/(dashboard)/notifications/actions";
import { getCurrentRole } from "@/lib/auth/check-role";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId, orgId, orgSlug } = await auth();

	// If the user has an active Clerk org, sync it to Supabase
	if (userId && orgId) {
		try {
			await ensureOrgInSupabase(
				orgId,
				orgSlug ?? orgId,
				userId,
				"admin"
			);
		} catch (err) {
			console.error("Org sync error:", err);
		}
	}

	// If no org is selected, show org creation/selection prompt
	if (!orgId) {
		return <NoOrgScreen />;
	}

	// Fetch notifications + role in parallel
	const [notifications, unreadCount, role] = await Promise.all([
		getNotifications(10),
		getUnreadCount(),
		getCurrentRole(),
	]);

	return (
		<CopilotProvider
			organizationId={orgId}
			userId={userId ?? ""}
			userRole={role}
		>
			<div className="flex h-screen overflow-hidden">
				<Sidebar className="hidden md:flex" role={role} />
				<main className="flex min-w-0 flex-1 flex-col overflow-hidden" role="main">
					<Header notifications={notifications} unreadCount={unreadCount} />
					<div id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
				</main>
				<CopilotPanel />
			</div>
		</CopilotProvider>
	);
}
