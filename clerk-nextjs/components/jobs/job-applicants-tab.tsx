import { getJobApplications } from "@/app/(dashboard)/applications/actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils/date";
import { UserSearch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface JobApplicantsTabProps {
	jobId: string;
}

export async function JobApplicantsTab({ jobId }: JobApplicantsTabProps) {
	const applications = await getJobApplications(jobId);

	if (applications.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<UserSearch className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No applicants found for this job.</p>
			</div>
		);
	}

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Candidate</TableHead>
							<TableHead>Applied Date</TableHead>
							<TableHead>Stage</TableHead>
							<TableHead>Screening Score</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{applications.map((application: any) => {
							const candidate = application.candidates;
							const initials = getInitials(candidate.full_name);

							return (
								<TableRow key={application.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="size-8">
												<AvatarFallback className="bg-primary/10 text-primary">
													{initials}
												</AvatarFallback>
											</Avatar>
											<div>
												<Link
													href={`/candidates/${candidate.id}`}
													className="font-medium hover:underline"
												>
													{candidate.full_name}
												</Link>
												{candidate.email && (
													<div className="text-sm text-muted-foreground">
														{candidate.email}
													</div>
												)}
											</div>
										</div>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{application.applied_at
											? formatDate(application.applied_at)
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
										<Button variant="ghost" size="sm" asChild>
											<Link href={`/candidates/${candidate.id}`}>View</Link>
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
