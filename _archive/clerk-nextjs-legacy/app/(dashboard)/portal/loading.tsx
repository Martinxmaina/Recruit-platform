import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PortalLoading() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-4 w-56" />
			</div>

			<Skeleton className="h-10 w-64" />

			<div className="grid gap-4 md:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-5 w-48" />
							<Skeleton className="h-3 w-24" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-4 w-full" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
