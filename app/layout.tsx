import type { Metadata } from 'next'
import Link from 'next/link'
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
		<html lang="en">
			<body>
				<header className="border-b px-6 py-4 flex items-center justify-between">
					<span className="font-semibold">Recruitment Platform</span>
					<nav className="flex items-center gap-4">
						<Link href="/sign-in" className="text-blue-600 underline">
							Sign in
						</Link>
						<Link href="/sign-up" className="text-blue-600 underline">
							Sign up
						</Link>
					</nav>
				</header>
				{children}
			</body>
		</html>
	)
}
