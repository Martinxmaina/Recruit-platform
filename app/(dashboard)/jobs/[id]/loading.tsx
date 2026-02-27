import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function JobDetailLoading() {
	return (
		<div className="space-y-6">
			{/* Header skeleton */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-start justify-between">
						<div className="space-y-2">
							<Skeleton className="h-7 w-64" />
							<Skeleton className="h-4 w-40" />
							<div className="flex gap-2 mt-3">
								<Skeleton className="h-5 w-16 rounded-full" />
								<Skeleton className="h-5 w-20 rounded-full" />
								<Skeleton className="h-5 w-24 rounded-full" />
							</div>
						</div>
						<div className="flex gap-2">
							<Skeleton className="h-9 w-20" />
							<Skeleton className="h-9 w-20" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs skeleton */}
			<div>
				<Skeleton className="h-10 w-full max-w-lg mb-4" />
				<Card>
					<CardContent className="pt-6 space-y-4">
						<Skeleton className="h-[300px] w-full" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
