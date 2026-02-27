export default function SignUpPage() {
	return (
		<div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 p-8">
			<p className="text-muted-foreground text-center">
				This app now uses Supabase authentication only.
			</p>
			<p className="text-muted-foreground text-center">
				Run the main dashboard from the <code className="rounded bg-gray-100 px-1 py-0.5">clerk-nextjs</code>{' '}
				app and open <code className="rounded bg-gray-100 px-1 py-0.5">/sign-up</code> there.
			</p>
		</div>
	)
}
