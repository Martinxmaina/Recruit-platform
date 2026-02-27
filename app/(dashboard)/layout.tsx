import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Header } from "@/components/app-shell/header";
import { NoOrgScreen } from "@/components/app-shell/no-org-screen";
import { CopilotProvider, CopilotPanel } from "@/components/copilot";
import { ensureUserHasOrg } from "@/lib/sync-org";
import {
	getNotifications,
	getUnreadCount,
	type Notification,
} from "@/app/(dashboard)/notifications/actions";
import { getCurrentUser, getCurrentOrg } from "@/lib/auth/session";
import { getCurrentRole } from "@/lib/auth/check-role";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/sign-in");
	}

	let org = await getCurrentOrg();
	if (!org) {
		try {
			await ensureUserHasOrg(user.id, user.email ?? undefined);
			org = await getCurrentOrg();
		} catch (err) {
			console.error("Ensure org error:", err);
		}
	}

	if (!org) {
		return <NoOrgScreen />;
	}

	const supabaseConfigured =
		!!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

	const [notifications, unreadCount, role] = supabaseConfigured
		? await Promise.all([
				getNotifications(10),
				getUnreadCount(),
				getCurrentRole(),
			])
		: ([[], 0, "recruiter"] as [Notification[], number, "admin" | "recruiter" | "client"]);

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
			organizationId={org.id}
			userId={user.id}
			userRole={role ?? "recruiter"}
		>
			<div className="flex h-screen overflow-hidden">
				<Sidebar className="hidden md:flex" role={role ?? "recruiter"} userEmail={user.email ?? undefined} />
				<main className="flex min-w-0 flex-1 flex-col overflow-hidden" role="main">
					<Header notifications={serializedNotifications} unreadCount={unreadCount} userEmail={user.email ?? undefined} />
					<div id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
				</main>
				<CopilotPanel />
			</div>
		</CopilotProvider>
	);
}
