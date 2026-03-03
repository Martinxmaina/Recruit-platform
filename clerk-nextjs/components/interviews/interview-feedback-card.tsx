"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { updateInterview } from "@/app/(dashboard)/interviews/actions";
import type { Interview } from "@/app/(dashboard)/interviews/actions";
import { formatDate } from "@/lib/utils/date";

type InterviewWithApp = Interview & {
	applications?: {
		jobs?: { title: string };
	};
};

interface InterviewFeedbackCardProps {
	interview: InterviewWithApp;
}

export function InterviewFeedbackCard({ interview }: InterviewFeedbackCardProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [rating, setRating] = useState<number | null>(interview.rating ?? null);
	const [feedback, setFeedback] = useState(interview.feedback_notes ?? "");
	const [transcript, setTranscript] = useState(interview.meeting_transcript ?? "");

	const jobTitle =
		(interview.applications as { jobs?: { title: string } } | undefined)?.jobs?.title ??
		"";
	const scheduledAt = interview.scheduled_at
		? formatDate(new Date(interview.scheduled_at))
		: "";

	const handleSave = () => {
		startTransition(async () => {
			const result = await updateInterview(interview.id, {
				rating: rating ?? undefined,
				feedback_notes: feedback || null,
				meeting_transcript: transcript || null,
			});
			if (result.error) {
				alert(result.error);
				return;
			}
			router.refresh();
		});
	};

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div>
						<p className="font-medium">{jobTitle || "Interview"}</p>
						<p className="text-sm text-muted-foreground">
							{scheduledAt}
							{interview.interviewer_name
								? ` · ${interview.interviewer_name}`
								: ""}
							{` · ${interview.status}`}
						</p>
					</div>
					<Button size="sm" onClick={handleSave} disabled={isPending}>
						{isPending ? "Saving…" : "Save feedback"}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<Label className="text-xs text-muted-foreground">Rating (1–5)</Label>
					<div className="mt-1 flex gap-1">
						{[1, 2, 3, 4, 5].map((value) => (
							<button
								key={value}
								type="button"
								onClick={() => setRating(value)}
								className="rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<Star
									className={`size-6 ${
										rating !== null && value <= rating
											? "fill-yellow-400 text-yellow-400"
											: "text-muted-foreground"
									}`}
								/>
							</button>
						))}
					</div>
				</div>
				<div>
					<Label htmlFor={`feedback-${interview.id}`} className="text-xs text-muted-foreground">
						Comment / feedback
					</Label>
					<Textarea
						id={`feedback-${interview.id}`}
						value={feedback}
						onChange={(e) => setFeedback(e.target.value)}
						placeholder="Add feedback or comment..."
						rows={3}
						className="mt-1"
					/>
				</div>
				<div>
					<Label htmlFor={`transcript-${interview.id}`} className="text-xs text-muted-foreground">
						Meeting transcript
					</Label>
					<Textarea
						id={`transcript-${interview.id}`}
						value={transcript}
						onChange={(e) => setTranscript(e.target.value)}
						placeholder="Paste or type meeting transcript here..."
						rows={4}
						className="mt-1"
					/>
				</div>
			</CardContent>
		</Card>
	);
}
