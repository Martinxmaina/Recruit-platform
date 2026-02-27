import { getCandidateActivity } from "@/app/(dashboard)/activity/actions";
import { ActivityTimeline } from "@/components/activity/activity-timeline";

interface CandidateActivityTabProps {
	candidateId: string;
}

export async function CandidateActivityTab({
	candidateId,
}: CandidateActivityTabProps) {
	const activities = await getCandidateActivity(candidateId);

	return <ActivityTimeline activities={activities} showCandidateLinks={false} />;
}
