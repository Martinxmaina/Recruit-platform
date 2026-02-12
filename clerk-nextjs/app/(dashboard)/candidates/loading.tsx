import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CandidatesLoading() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-4 w-48" />
				</div>
				<Skeleton className="h-9 w-28" />
			</div>

			{/* Filter bar */}
			<div className="flex gap-3">
				<Skeleton className="h-9 flex-1 max-w-sm" />
				<Skeleton className="h-9 w-28" />
				<Skeleton className="h-9 w-28" />
			</div>

			{/* Table skeleton */}
			<Card>
				<CardContent className="pt-6 space-y-3">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-14 w-full" />
					))}
				</CardContent>
			</Card>
		</div>
	);
}
