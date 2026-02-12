import Link from 'next/link'

export default function Home() {
	return (
		<main className="min-h-screen p-8">
			<h1 className="text-2xl font-semibold">Recruitment Platform</h1>
			<p className="mt-2 text-gray-600">Welcome. Sign in or sign up using the header.</p>
			<p className="mt-4">
				<Link href="/dashboard" className="text-blue-600 underline">
					Dashboard
				</Link>{' '}
				(protected; requires sign-in).
			</p>
		</main>
	)
}
