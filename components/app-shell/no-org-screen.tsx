import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Shown when a signed-in user has no organization (e.g. ensureUserHasOrg failed).
 * With Supabase Auth, the dashboard layout already creates an org on first login;
 * this is a fallback if something went wrong.
 */
export function NoOrgScreen() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
			<div className="text-center">
				<h1 className="text-2xl font-bold">No Organization</h1>
				<p className="mt-2 text-muted-foreground">
					We could not set up your organization. Try refreshing the page or sign out and sign in again.
				</p>
			</div>
			<div className="flex gap-4">
				<Button asChild>
					<Link href="/dashboard">Go to dashboard</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/sign-in">Sign in again</Link>
				</Button>
			</div>
		</div>
	);
}
