import { getJobInterviews } from "@/app/(dashboard)/interviews/actions";
import { getJobApplications } from "@/app/(dashboard)/applications/actions";
import { InterviewsList } from "@/components/interviews/interviews-list";
import { ScheduleInterviewDialog } from "@/components/interviews/schedule-interview-dialog";
import { Button } from "@/components/ui/button";

interface JobInterviewsTabProps {
	jobId: string;
}

export async function JobInterviewsTab({ jobId }: JobInterviewsTabProps) {
	const [interviews, applications] = await Promise.all([
		getJobInterviews(jobId),
		getJobApplications(jobId),
	]);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					Manage interviews for candidates applying to this job
				</p>
				<ScheduleInterviewDialog
					jobId={jobId}
					applications={applications as any}
				/>
			</div>
			<InterviewsList interviews={interviews as any} />
		</div>
	);
}
