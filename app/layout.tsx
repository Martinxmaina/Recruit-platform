import type { Metadata } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
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
			<body className="bg-background text-foreground antialiased">
				<TooltipProvider>{children}</TooltipProvider>
			</body>
		</html>
	)
}
