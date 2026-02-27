import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Sparkles } from "lucide-react";

interface JobScreeningTabProps {
	jobId: string;
}

type JobScreeningResult = {
	id: string;
};

export function JobScreeningTab({ jobId: _jobId }: JobScreeningTabProps) {
	// TODO: Fetch screening results
	const screeningResults: JobScreeningResult[] = [];

	if (screeningResults.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Sparkles className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No screening results yet.</p>
				<p className="mt-2 text-sm text-muted-foreground">
					Run AI screening to see candidate matches and scores.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Candidate</TableHead>
						<TableHead>Score</TableHead>
						<TableHead>Match Reasons</TableHead>
						<TableHead>Red Flags</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{screeningResults.map((result) => (
						<TableRow key={result.id}>
							<TableCell>—</TableCell>
							<TableCell>—</TableCell>
							<TableCell>—</TableCell>
							<TableCell>—</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
