"use client";

import Link from "next/link";
import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function HomeAuthBar() {
	return (
		<header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
			<span className="font-semibold">Recruitment Platform</span>
			<nav className="flex items-center gap-4">
				<SignedOut>
					<SignInButton
						mode="modal"
						fallbackRedirectUrl="/dashboard"
						forceRedirectUrl="/dashboard"
					>
						<Button variant="ghost">Sign in</Button>
					</SignInButton>
					<SignUpButton
						mode="modal"
						fallbackRedirectUrl="/dashboard"
						forceRedirectUrl="/dashboard"
					>
						<Button>Sign up</Button>
					</SignUpButton>
				</SignedOut>
				<SignedIn>
					<Button variant="outline" asChild>
						<Link href="/dashboard">Dashboard</Link>
					</Button>
					<UserButton afterSignOutUrl="/" />
				</SignedIn>
			</nav>
		</header>
	);
}
