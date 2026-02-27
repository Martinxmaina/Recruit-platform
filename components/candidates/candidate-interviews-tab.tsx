import { getCandidateInterviews } from "@/app/(dashboard)/interviews/actions";
import { getCandidateApplications } from "@/app/(dashboard)/applications/actions";
import { InterviewsList } from "@/components/interviews/interviews-list";
import { ScheduleInterviewDialog } from "@/components/interviews/schedule-interview-dialog";
import { CandidateInterviewFeedback } from "./candidate-interview-feedback";

interface CandidateInterviewsTabProps {
	candidateId: string;
}

export async function CandidateInterviewsTab({
	candidateId,
}: CandidateInterviewsTabProps) {
	const [interviews, applications] = await Promise.all([
		getCandidateInterviews(candidateId),
		getCandidateApplications(candidateId),
	]);

	return (
		<div className="space-y-6">
			<CandidateInterviewFeedback />
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						View and manage interviews for this candidate
					</p>
					<ScheduleInterviewDialog
						candidateId={candidateId}
						applications={applications as any}
					/>
				</div>
				<InterviewsList interviews={interviews as any} />
			</div>
		</div>
	);
}
