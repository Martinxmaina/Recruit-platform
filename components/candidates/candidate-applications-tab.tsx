import { getCandidateApplications } from "@/app/(dashboard)/candidates/actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import Link from "next/link";

interface CandidateApplicationsTabProps {
	candidateId: string;
}

export async function CandidateApplicationsTab({ candidateId }: CandidateApplicationsTabProps) {
	const applications = await getCandidateApplications(candidateId);

	if (applications.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Briefcase className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No applications found.</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Job</TableHead>
						<TableHead>Client</TableHead>
						<TableHead>Applied Date</TableHead>
						<TableHead>Stage</TableHead>
						<TableHead>Screening Score</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{applications.map((application: any) => {
						const job = application.jobs;
						const client = job?.clients;

						return (
							<TableRow key={application.id}>
								<TableCell>
									{job ? (
										<Link
											href={`/jobs/${job.id}`}
											className="font-medium hover:underline"
										>
											{job.title}
										</Link>
									) : (
										"—"
									)}
								</TableCell>
								<TableCell className="text-muted-foreground">
									{client?.name || "—"}
								</TableCell>
								<TableCell className="text-muted-foreground">
									{application.applied_at
										? new Date(application.applied_at).toLocaleDateString()
										: "—"}
								</TableCell>
								<TableCell>
									<Badge variant="outline">{application.stage}</Badge>
								</TableCell>
								<TableCell>
									{application.screening_score !== null ? (
										<Badge
											variant={
												application.screening_score >= 70
													? "default"
													: application.screening_score >= 50
														? "secondary"
														: "outline"
											}
										>
											{application.screening_score}%
										</Badge>
									) : (
										<span className="text-muted-foreground">—</span>
									)}
								</TableCell>
								<TableCell>
									<Badge
										variant={
											application.status === "active"
												? "default"
												: application.status === "rejected"
													? "secondary"
													: "outline"
										}
									>
										{application.status}
									</Badge>
								</TableCell>
								<TableCell>
									{job && (
										<Link
											href={`/jobs/${job.id}`}
											className="text-primary hover:underline text-sm"
										>
											View Job
										</Link>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
