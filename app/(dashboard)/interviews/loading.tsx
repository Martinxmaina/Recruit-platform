import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function InterviewsLoading() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-6 w-28" />
				<Skeleton className="h-4 w-52" />
			</div>

			<Skeleton className="h-10 w-48" />

			<Card>
				<CardHeader>
					<Skeleton className="h-4 w-40" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[350px] w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
