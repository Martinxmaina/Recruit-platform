import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Header } from "@/components/app-shell/header";
import { NoOrgScreen } from "@/components/app-shell/no-org-screen";
import { CopilotProvider, CopilotPanel } from "@/components/copilot";
import { ensureOrgInSupabase } from "@/lib/sync-org";
import {
	getNotifications,
	getUnreadCount,
	type Notification,
} from "@/app/(dashboard)/notifications/actions";
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

	// Skip Supabase-dependent fetches when env is missing so the app can load (e.g. before clerk-nextjs/.env.local is set)
	const supabaseConfigured =
		!!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

	const [notifications, unreadCount, role] = supabaseConfigured
		? await Promise.all([
				getNotifications(10),
				getUnreadCount(),
				getCurrentRole(),
			])
		: ([[], 0, "recruiter"] as [Notification[], number, "admin" | "recruiter" | "client"]);

	// Ensure RSC-safe payload: only plain serializable props to client components (omit raw metadata to avoid RSC serialization issues)
	const serializedNotifications = notifications.map((n) => ({
		id: n.id,
		organization_id: n.organization_id,
		user_id: n.user_id,
		type: n.type,
		title: n.title,
		message: n.message ?? null,
		link: n.link ?? null,
		metadata: null,
		read_at: n.read_at ?? null,
		created_at: n.created_at ?? null,
	}));

	return (
		<CopilotProvider
			organizationId={orgId}
			userId={userId ?? ""}
			userRole={role ?? "recruiter"}
		>
			<div className="flex h-screen overflow-hidden">
				<Sidebar className="hidden md:flex" role={role ?? "recruiter"} />
				<main className="flex min-w-0 flex-1 flex-col overflow-hidden" role="main">
					<Header notifications={serializedNotifications} unreadCount={unreadCount} />
					<div id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
				</main>
				<CopilotPanel />
			</div>
		</CopilotProvider>
	);
}
