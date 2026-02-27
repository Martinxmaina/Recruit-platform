import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";

interface ShortlistCandidate {
	id: string;
	stage: string;
	status: string;
	screening_score: number | null;
	candidate_name: string;
	candidate_email: string;
	candidate_title: string;
	job_title: string;
}

interface ClientShortlistProps {
	candidates: ShortlistCandidate[];
}

export function ClientShortlist({ candidates }: ClientShortlistProps) {
	if (candidates.length === 0) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-12">
					<Users className="mb-3 size-8 text-muted-foreground/50" />
					<p className="text-sm text-muted-foreground">No shortlisted candidates yet.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm font-semibold">Candidate Shortlist</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Candidate</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Job</TableHead>
							<TableHead>Stage</TableHead>
							<TableHead>Score</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{candidates.map((c) => (
							<TableRow key={c.id}>
								<TableCell>
									<div>
										<p className="text-sm font-medium">{c.candidate_name}</p>
										<p className="text-[10px] text-muted-foreground">{c.candidate_email}</p>
									</div>
								</TableCell>
								<TableCell className="text-sm text-muted-foreground">
									{c.candidate_title || "—"}
								</TableCell>
								<TableCell className="text-sm">{c.job_title}</TableCell>
								<TableCell>
									<Badge variant="outline" className="text-[10px]">
										{c.stage}
									</Badge>
								</TableCell>
								<TableCell className="text-sm">
									{c.screening_score !== null ? `${c.screening_score}%` : "—"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
