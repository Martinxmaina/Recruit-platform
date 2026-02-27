import { getJobActivity } from "@/app/(dashboard)/activity/actions";
import { ActivityTimeline } from "@/components/activity/activity-timeline";

interface JobActivityTabProps {
	jobId: string;
}

export async function JobActivityTab({ jobId }: JobActivityTabProps) {
	const activities = await getJobActivity(jobId);

	return <ActivityTimeline activities={activities} showCandidateLinks={true} />;
}
