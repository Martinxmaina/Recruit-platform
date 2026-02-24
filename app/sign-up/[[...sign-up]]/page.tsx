import { redirect } from 'next/navigation'

export default function SignUpPage() {
	const appUrl = process.env.NEXT_PUBLIC_APP_URL
	if (appUrl) {
		redirect(`${appUrl.replace(/\/$/, '')}/sign-up`)
	}
	return (
		<div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 p-8">
			<p className="text-muted-foreground text-center">
				Set <code className="rounded bg-gray-100 px-1 py-0.5">NEXT_PUBLIC_APP_URL</code> to the app
				URL (e.g. run from clerk-nextjs and use that port, or your deployed clerk-nextjs URL).
			</p>
		</div>
	)
}
