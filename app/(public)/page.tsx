import Link from 'next/link'

const features = [
	{
		title: 'Candidate Pipeline',
		description: 'Track every applicant stage from sourcing to placement.',
	},
	{
		title: 'Client Collaboration',
		description: 'Share updates with hiring teams in one secure workspace.',
	},
	{
		title: 'Interview Coordination',
		description: 'Schedule interviews and keep feedback organized.',
	},
	{
		title: 'Recruiting Insights',
		description: 'Measure conversion rates and team performance in real time.',
	},
]

const stats = [
	{ value: '5x', label: 'Faster shortlist turnaround' },
	{ value: '40%', label: 'Less admin work for recruiters' },
	{ value: '99.9%', label: 'Reliable cloud platform uptime' },
]

export default function Home() {
	return (
		<main className="bg-slate-950 text-slate-100">
			<section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
				<p className="rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-wider text-slate-300">
					Recruitment platform
				</p>
				<h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
					Recruit smarter with one platform for jobs, candidates, and clients.
				</h1>
				<p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
					Manage jobs, candidates, interviews, and client collaboration from one
					unified workspace.
				</p>
				<div className="mt-10 flex flex-col gap-3 sm:flex-row">
					<Link
						href="/sign-up"
						className="rounded-md bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-400"
					>
						Create account
					</Link>
					<Link
						href="/sign-in"
						className="rounded-md border border-slate-600 px-6 py-3 font-medium text-slate-100 transition hover:border-slate-400"
					>
						Sign in
					</Link>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 py-16">
				<h2 className="text-2xl font-semibold sm:text-3xl">Everything your team needs</h2>
				<div className="mt-8 grid gap-4 sm:grid-cols-2">
					{features.map((feature) => (
						<article
							key={feature.title}
							className="rounded-xl border border-slate-800 bg-slate-900 p-6"
						>
							<h3 className="text-lg font-semibold">{feature.title}</h3>
							<p className="mt-2 text-sm text-slate-300">{feature.description}</p>
						</article>
					))}
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 py-12">
				<div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-8 sm:grid-cols-3">
					{stats.map((stat) => (
						<div key={stat.label}>
							<p className="text-3xl font-bold text-blue-400">{stat.value}</p>
							<p className="mt-2 text-sm text-slate-300">{stat.label}</p>
						</div>
					))}
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 pb-20 pt-10">
				<div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-8 text-center">
					<h2 className="text-2xl font-semibold">Start hiring with confidence</h2>
					<p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
						Create your account to start building candidate pipelines, managing
						client workspaces, and accelerating placements.
					</p>
					<Link
						href="/sign-up"
						className="mt-6 inline-block rounded-md bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-400"
					>
						Get started
					</Link>
				</div>
			</section>
		</main>
	)
}
