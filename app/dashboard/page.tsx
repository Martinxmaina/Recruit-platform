import { auth } from '@clerk/nextjs/server'

export default async function DashboardPage() {
	const { userId } = await auth()
	return (
		<main className="min-h-screen p-8">
			<h1 className="text-2xl font-semibold">Dashboard</h1>
			<p className="mt-2 text-gray-600">Signed in as user: {userId}</p>
		</main>
	)
}
