import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
					<Link href="/" className="font-semibold tracking-tight">
						Recruitment Platform
					</Link>
					<nav className="flex items-center gap-3">
						<Link
							href="/sign-in"
							className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-400"
						>
							Sign in
						</Link>
						<Link
							href="/sign-up"
							className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
						>
							Sign up
						</Link>
					</nav>
				</div>
			</header>
			<div className="min-h-[calc(100vh-73px)]">{children}</div>
		</div>
	)
}
