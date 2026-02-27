import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

interface CandidateEducationTabProps {
	candidateId: string;
}

type CandidateEducationItem = {
	id: string;
};

export function CandidateEducationTab({ candidateId: _candidateId }: CandidateEducationTabProps) {
	// TODO: Fetch education from database or n8n enriched data
	const education: CandidateEducationItem[] = [];

	if (education.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<GraduationCap className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No education information available.</p>
				<p className="mt-2 text-sm text-muted-foreground">
					Education details will be displayed here when available from enriched profile data.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{education.map((item) => (
				<Card key={item.id}>
					<CardContent className="pt-6">
						{/* Education item */}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
