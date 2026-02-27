import { CandidateForm } from "@/components/candidates/candidate-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewCandidatePage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Add New Candidate</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Create a new candidate profile
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Candidate Information</CardTitle>
				</CardHeader>
				<CardContent>
					<CandidateForm />
				</CardContent>
			</Card>
		</div>
	);
}
