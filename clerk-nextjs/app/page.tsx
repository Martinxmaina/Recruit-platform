import Link from "next/link";
import { HomeAuthBar } from "@/components/home-auth-bar";
import { getCurrentUser } from "@/lib/auth/session";

export default async function Home() {
	let user = null;
	try {
		user = await getCurrentUser();
	} catch {
		// Env missing or Supabase unreachable: show unauthenticated UI
	}
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<HomeAuthBar user={user ? { email: user.email ?? undefined } : null} />
			<main className="flex flex-1 items-center justify-center">
				<div className="flex max-w-3xl flex-col items-center gap-6 px-16 py-32 text-center sm:items-start sm:text-left">
					<h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight">
						Recruitment Platform
					</h1>
					<p className="max-w-md text-lg leading-8 text-muted-foreground">
						Sign in or sign up above.{" "}
						<Link href="/dashboard" className="font-medium text-foreground underline">
							Dashboard
						</Link>{" "}
						is protected.
					</p>
				</div>
			</main>
		</div>
	);
}
