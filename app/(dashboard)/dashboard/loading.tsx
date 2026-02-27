import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-2">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-4 w-64" />
			</div>

			{/* Stats cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="pt-6">
							<Skeleton className="mb-2 h-4 w-24" />
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<Skeleton className="h-4 w-40" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-[200px] w-full" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className="h-4 w-40" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-[200px] w-full" />
					</CardContent>
				</Card>
			</div>

			{/* Bottom section */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<Skeleton className="h-4 w-40" />
						</CardHeader>
						<CardContent className="space-y-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton key={i} className="h-12 w-full" />
							))}
						</CardContent>
					</Card>
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-4 w-32" />
					</CardHeader>
					<CardContent className="space-y-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-10 w-full" />
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
