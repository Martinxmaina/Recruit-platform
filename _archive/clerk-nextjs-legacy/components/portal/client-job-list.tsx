import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock } from "lucide-react";

interface PortalJob {
	id: string;
	title: string;
	status: string;
	location: string | null;
	work_type: string | null;
	client_name: string;
	created_at: string | null;
}

interface ClientJobListProps {
	jobs: PortalJob[];
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
	switch (status) {
		case "open": return "default";
		case "filled": return "secondary";
		case "closed": return "destructive";
		default: return "outline";
	}
}

export function ClientJobList({ jobs }: ClientJobListProps) {
	if (jobs.length === 0) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<Briefcase className="mb-3 size-8 text-muted-foreground/50" />
					<p className="text-sm text-muted-foreground">No jobs found.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{jobs.map((job) => (
				<Card key={job.id} className="hover:border-primary/30 transition-colors">
					<CardHeader className="pb-2">
						<div className="flex items-start justify-between">
							<CardTitle className="text-sm font-semibold">{job.title}</CardTitle>
							<Badge variant={statusVariant(job.status)} className="text-[10px]">
								{job.status}
							</Badge>
						</div>
						{job.client_name && (
							<p className="text-xs text-muted-foreground">{job.client_name}</p>
						)}
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
							{job.location && (
								<span className="flex items-center gap-1">
									<MapPin className="size-3" /> {job.location}
								</span>
							)}
							{job.work_type && (
								<span className="flex items-center gap-1">
									<Briefcase className="size-3" /> {job.work_type}
								</span>
							)}
							{job.created_at && (
								<span className="flex items-center gap-1">
									<Clock className="size-3" />
									{new Date(job.created_at).toLocaleDateString()}
								</span>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
