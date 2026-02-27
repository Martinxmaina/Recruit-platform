import { getClientActivity } from "@/app/(dashboard)/clients/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ClientActivityTabProps {
	clientId: string;
}

export async function ClientActivityTab({ clientId }: ClientActivityTabProps) {
	const activities = await getClientActivity(clientId);

	if (activities.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Clock className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No activity recorded yet.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{activities.map((activity) => (
				<Card key={activity.id}>
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div className="space-y-1">
								<h4 className="font-semibold">{activity.title}</h4>
								{activity.message && (
									<p className="text-sm text-muted-foreground">
										{activity.message}
									</p>
								)}
								<p className="text-xs text-muted-foreground">
									{activity.created_at
										? new Date(activity.created_at).toLocaleString()
										: "—"}
								</p>
							</div>
							{activity.link && (
								<a
									href={activity.link}
									className="text-primary hover:underline text-sm"
								>
									View
								</a>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
