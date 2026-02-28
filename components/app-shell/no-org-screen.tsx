import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/(public)/(auth)/actions";

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
					We could not set up your organization. Try again or sign out and sign in again.
				</p>
			</div>
			<div className="flex flex-wrap justify-center gap-4">
				<Button asChild>
					<Link href="/dashboard">Try again</Link>
				</Button>
				<form action={signOut} className="inline">
					<Button type="submit" variant="outline">
						Sign out
					</Button>
				</form>
				<Button variant="ghost" asChild>
					<Link href="/sign-in">Sign in again</Link>
				</Button>
			</div>
		</div>
	);
}
