import Link from 'next/link'

export default function Home() {
	const appUrl = process.env.NEXT_PUBLIC_APP_URL
	const dashboardHref = appUrl ? `${appUrl.replace(/\/$/, '')}/dashboard` : '/dashboard'
	return (
		<main className="min-h-screen p-8">
			<h1 className="text-2xl font-semibold">Recruitment Platform</h1>
			<p className="mt-2 text-gray-600">Welcome. Sign in or sign up using the header.</p>
			<p className="mt-4">
				<Link href={dashboardHref} className="text-blue-600 underline">
					Dashboard
				</Link>{' '}
				(protected; requires sign-in).
			</p>
		</main>
	)
}
