import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface CandidateWorkHistoryTabProps {
	candidateId: string;
}

type CandidateWorkHistoryItem = {
	id: string;
};

export function CandidateWorkHistoryTab({ candidateId: _candidateId }: CandidateWorkHistoryTabProps) {
	// TODO: Fetch work history from database or n8n enriched data
	const workHistory: CandidateWorkHistoryItem[] = [];

	if (workHistory.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Briefcase className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No work history available.</p>
				<p className="mt-2 text-sm text-muted-foreground">
					Work history will be displayed here when available from enriched profile data.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{workHistory.map((item) => (
				<Card key={item.id}>
					<CardContent className="pt-6">
						{/* Work history item */}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
