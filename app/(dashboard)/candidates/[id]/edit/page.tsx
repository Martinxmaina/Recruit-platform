import { notFound } from "next/navigation";
import { getCandidate } from "@/app/(dashboard)/candidates/actions";
import { CandidateForm } from "@/components/candidates/candidate-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditCandidatePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const candidate = await getCandidate(id);

	if (!candidate) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Edit Candidate</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Update candidate information
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Candidate Information</CardTitle>
				</CardHeader>
				<CardContent>
					<CandidateForm candidate={candidate} />
				</CardContent>
			</Card>
		</div>
	);
}
