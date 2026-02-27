import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signIn } from '@/app/(public)/(auth)/actions'
import { getSession } from '@/lib/auth/session'

export default async function SignInPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string; message?: string }>
}) {
	const session = await getSession()
	if (session) {
		redirect('/dashboard')
	}

	const { error, message } = await searchParams

	return (
		<div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center px-6 py-16">
			<div className="w-full rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/40">
				<h1 className="text-2xl font-semibold">Sign in</h1>
				<p className="mt-2 text-sm text-slate-300">
					Enter your account credentials to continue.
				</p>

				{error ? (
					<p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
						{decodeURIComponent(error)}
					</p>
				) : null}
				{message ? (
					<p className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
						{decodeURIComponent(message)}
					</p>
				) : null}

				<form action={signIn} className="mt-6 space-y-4">
					<div>
						<label htmlFor="email" className="mb-1 block text-sm text-slate-200">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							autoComplete="email"
							className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-blue-400/40 placeholder:text-slate-500 focus:ring-2"
							placeholder="you@company.com"
						/>
					</div>

					<div>
						<label htmlFor="password" className="mb-1 block text-sm text-slate-200">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							autoComplete="current-password"
							className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-blue-400/40 placeholder:text-slate-500 focus:ring-2"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						className="w-full rounded-md bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
					>
						Sign in
					</button>
				</form>

				<p className="mt-4 text-center text-sm text-slate-300">
					No account yet?{' '}
					<Link href="/sign-up" className="font-medium text-blue-300 underline">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	)
}
