import { getClientJobs } from "@/app/(dashboard)/clients/actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Briefcase } from "lucide-react";

interface ClientJobsTabProps {
	clientId: string;
}

export async function ClientJobsTab({ clientId }: ClientJobsTabProps) {
	const jobs = await getClientJobs(clientId);

	if (jobs.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Briefcase className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No jobs found for this client.</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Location</TableHead>
						<TableHead>Work Type</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Posted</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{jobs.map((job) => (
						<TableRow key={job.id}>
							<TableCell className="font-medium">
								<Link
									href={`/jobs/${job.id}`}
									className="hover:underline"
								>
									{job.title}
								</Link>
							</TableCell>
							<TableCell className="text-muted-foreground">
								{job.location || "—"}
							</TableCell>
							<TableCell>
								{job.work_type ? (
									<Badge variant="outline">{job.work_type}</Badge>
								) : (
									"—"
								)}
							</TableCell>
							<TableCell>
								<Badge
									variant={
										job.status === "open"
											? "default"
											: job.status === "closed"
												? "secondary"
												: "outline"
									}
								>
									{job.status}
								</Badge>
							</TableCell>
							<TableCell className="text-muted-foreground">
								{job.posted_at
									? new Date(job.posted_at).toLocaleDateString()
									: "—"}
							</TableCell>
							<TableCell>
								<Link
									href={`/jobs/${job.id}`}
									className="text-primary hover:underline text-sm"
								>
									View
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
