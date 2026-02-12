import type { Metadata } from 'next'
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
	title: 'Recruitment Platform',
	description: 'Multi-tenant recruiting platform for agencies',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body>
					<header className="border-b px-6 py-4 flex items-center justify-between">
						<span className="font-semibold">Recruitment Platform</span>
						<nav className="flex items-center gap-4">
							<SignedOut>
								<SignInButton mode="modal" />
								<SignUpButton mode="modal" />
							</SignedOut>
							<SignedIn>
								<UserButton afterSignOutUrl="/" />
							</SignedIn>
						</nav>
					</header>
					{children}
				</body>
			</html>
		</ClerkProvider>
	)
}
