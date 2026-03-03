import { getJobApplications } from "@/app/(dashboard)/applications/actions";
import { UserSearch } from "lucide-react";
import { JobApplicantsWithSidebar } from "./job-applicants-with-sidebar";

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

	return (
		<div className="space-y-4">
			<JobApplicantsWithSidebar applications={applications as any[]} />
		</div>
	);
}
