export default function Home() {
	return (
		<main className="min-h-screen p-8">
			<h1 className="text-2xl font-semibold">Recruitment Platform</h1>
			<p className="mt-2 text-gray-600">
				The main dashboard now lives in the <code className="rounded bg-gray-100 px-1 py-0.5">clerk-nextjs</code> app.
			</p>
			<p className="mt-4 text-gray-600">
				Run <code className="rounded bg-gray-100 px-1 py-0.5">npm run dev</code> inside{' '}
				<code className="rounded bg-gray-100 px-1 py-0.5">clerk-nextjs</code> and open{' '}
				<code className="rounded bg-gray-100 px-1 py-0.5">/dashboard</code> there.
			</p>
		</main>
	)
}
