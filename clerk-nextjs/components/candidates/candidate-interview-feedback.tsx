import { Star, StickyNote, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CandidateInterviewFeedback() {
	// Mock interview feedback data
	const interviewFeedback = {
		rating: 4.0,
		maxRating: 5,
		interviewer: {
			name: "Thomas Henders",
			role: "VP of Engineering",
			avatar: "TH",
			date: "Oct 12, 2023",
		},
		feedback:
			"Alex showed exceptional depth in system design. He was able to walk through complex scaling trade-offs with ease. Coding task was clean and well-tested, though he could focus more on edge-case documentation. Definitely a strong candidate for the Lead role.",
	};

	// Mock internal notes
	const internalNotes = [
		{
			id: 1,
			text: "Salary expectations aligned with budget. Open to partial equity compensation.",
			author: "Sarah (Recruiter)",
			date: "Oct 10",
		},
	];

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-bold">Technical Interview Feedback</h3>
					<div className="flex items-center gap-1">
						{Array.from({ length: interviewFeedback.maxRating }).map((_, i) => (
							<Star
								key={i}
								className={`size-5 ${
									i < Math.floor(interviewFeedback.rating)
										? "fill-yellow-400 text-yellow-400"
										: "text-muted-foreground"
								}`}
							/>
						))}
						<span className="ml-2 text-sm font-bold">
							{interviewFeedback.rating} / {interviewFeedback.maxRating}
						</span>
					</div>
				</div>
				<div className="bg-muted/50 p-4 rounded-lg">
					<div className="flex items-center gap-3 mb-3">
						<Avatar className="size-10">
							<AvatarFallback className="bg-primary text-primary-foreground">
								{interviewFeedback.interviewer.avatar}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-bold">{interviewFeedback.interviewer.name}</p>
							<p className="text-xs text-muted-foreground">
								{interviewFeedback.interviewer.role} • Interviewed {interviewFeedback.interviewer.date}
							</p>
						</div>
					</div>
					<p className="text-sm leading-relaxed italic">{interviewFeedback.feedback}</p>
				</div>
				<div className="mt-6">
					<h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
						Internal Notes
					</h4>
					<div className="space-y-3">
						{internalNotes.map((note) => (
							<div
								key={note.id}
								className="p-3 bg-card border border-border rounded-lg flex items-start gap-3"
							>
								<StickyNote className="size-4 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-xs text-foreground">{note.text}</p>
									<p className="text-[10px] text-muted-foreground mt-1">
										{note.author} • {note.date}
									</p>
								</div>
							</div>
						))}
						<Button
							variant="outline"
							className="w-full border-2 border-dashed hover:border-primary/30 hover:text-primary transition-all"
						>
							<Plus className="mr-2 size-4" />
							Add internal note
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
