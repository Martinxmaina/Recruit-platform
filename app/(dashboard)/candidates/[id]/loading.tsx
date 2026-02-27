import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CandidateDetailLoading() {
	return (
		<div className="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
			{/* Left sidebar skeleton */}
			<div className="lg:col-span-4 space-y-6">
				<Card>
					<CardContent className="pt-6 flex flex-col items-center space-y-4">
						<Skeleton className="size-32 rounded-full" />
						<Skeleton className="h-6 w-40" />
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-48" />
						<div className="flex gap-3 w-full">
							<Skeleton className="h-9 flex-1" />
							<Skeleton className="h-9 flex-1" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6 space-y-3">
						<Skeleton className="h-4 w-32" />
						<div className="flex flex-wrap gap-2">
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton key={i} className="h-6 w-20 rounded-full" />
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main content skeleton */}
			<div className="lg:col-span-8 space-y-6">
				<Card>
					<CardContent className="pt-6">
						<Skeleton className="h-[150px] w-full" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6 space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-[200px] w-full" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
