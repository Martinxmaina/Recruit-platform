import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<div className="space-y-2">
				<Skeleton className="h-7 w-24" />
				<Skeleton className="h-4 w-64" />
			</div>

			{/* Org profile skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-40" />
				</CardHeader>
				<CardContent className="flex items-center gap-4">
					<Skeleton className="size-16 rounded-lg" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-40" />
						<Skeleton className="h-4 w-28" />
					</div>
				</CardContent>
			</Card>

			{/* Members skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-32" />
				</CardHeader>
				<CardContent className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full" />
					))}
				</CardContent>
			</Card>
		</div>
	);
}
