import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ClientsLoading() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-4 w-40" />
				</div>
				<Skeleton className="h-9 w-28" />
			</div>

			<Card>
				<CardContent className="pt-6 space-y-3">
					<Skeleton className="h-10 w-full" />
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-14 w-full" />
					))}
				</CardContent>
			</Card>
		</div>
	);
}
