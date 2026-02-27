"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/(auth)/actions";

interface HomeAuthBarProps {
	user: { email?: string } | null;
}

export function HomeAuthBar({ user }: HomeAuthBarProps) {
	return (
		<header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
			<span className="font-semibold">Recruitment Platform</span>
			<nav className="flex items-center gap-4">
				{!user ? (
					<>
						<Button variant="ghost" asChild>
							<Link href="/sign-in">Sign in</Link>
						</Button>
						<Button asChild>
							<Link href="/sign-up">Sign up</Link>
						</Button>
					</>
				) : (
					<>
						<Button variant="outline" asChild>
							<Link href="/dashboard">Dashboard</Link>
						</Button>
						<span className="text-sm text-muted-foreground">{user.email}</span>
						<form action={signOut} className="inline">
							<Button type="submit" variant="ghost">
								Sign out
							</Button>
						</form>
					</>
				)}
			</nav>
		</header>
	);
}
