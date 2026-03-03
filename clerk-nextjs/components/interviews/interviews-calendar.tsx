"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarInterview {
	id: string;
	scheduled_at: string;
	status: string;
	candidate_name: string;
	job_title: string;
	interviewer_name: string | null;
	notes: string | null;
}

interface InterviewsCalendarProps {
	interviews: CalendarInterview[];
}

function getDaysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
	return new Date(year, month, 1).getDay();
}

const MONTHS = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

const STATUS_COLORS: Record<string, string> = {
	scheduled: "bg-blue-500",
	completed: "bg-green-500",
	cancelled: "bg-red-500",
	rescheduled: "bg-yellow-500",
};

export function InterviewsCalendar({ interviews }: InterviewsCalendarProps) {
	const now = new Date();
	const [year, setYear] = useState(now.getFullYear());
	const [month, setMonth] = useState(now.getMonth());
	const [selectedInterview, setSelectedInterview] = useState<CalendarInterview | null>(null);

	const daysInMonth = getDaysInMonth(year, month);
	const firstDay = getFirstDayOfMonth(year, month);

	const prev = () => {
		if (month === 0) {
			setYear(year - 1);
			setMonth(11);
		} else {
			setMonth(month - 1);
		}
	};

	const next = () => {
		if (month === 11) {
			setYear(year + 1);
			setMonth(0);
		} else {
			setMonth(month + 1);
		}
	};

	// Group interviews by date string (YYYY-MM-DD)
	const byDate: Record<string, CalendarInterview[]> = {};
	for (const interview of interviews) {
		const d = new Date(interview.scheduled_at);
		if (d.getFullYear() === year && d.getMonth() === month) {
			const key = d.getDate().toString();
			if (!byDate[key]) byDate[key] = [];
			byDate[key].push(interview);
		}
	}

	const today = now.getDate();
	const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;

	return (
		<>
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-sm">
						<CalendarDays className="size-4" />
						Interview Calendar
					</CardTitle>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" className="size-7" onClick={prev}>
							<ChevronLeft className="size-4" />
						</Button>
						<span className="text-sm font-medium min-w-[140px] text-center">
							{MONTHS[month]} {year}
						</span>
						<Button variant="ghost" size="icon" className="size-7" onClick={next}>
							<ChevronRight className="size-4" />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{/* Day headers */}
				<div className="grid grid-cols-7 gap-px mb-1">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
						<div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
							{d}
						</div>
					))}
				</div>
				{/* Calendar grid */}
				<div className="grid grid-cols-7 gap-px">
					{/* Empty cells for offset */}
					{Array.from({ length: firstDay }).map((_, i) => (
						<div key={`empty-${i}`} className="min-h-[60px] bg-muted/30 rounded-sm" />
					))}
					{/* Day cells */}
					{Array.from({ length: daysInMonth }).map((_, i) => {
						const day = i + 1;
						const dayInterviews = byDate[day.toString()] || [];
						const isToday = isCurrentMonth && day === today;
						return (
							<div
								key={day}
								className={cn(
									"min-h-[60px] p-1 rounded-sm border border-transparent",
									isToday && "border-primary bg-primary/5",
									dayInterviews.length > 0 && "bg-muted/20"
								)}
							>
								<span className={cn(
									"text-[10px] font-medium",
									isToday && "text-primary font-bold"
								)}>
									{day}
								</span>
								<div className="mt-0.5 space-y-0.5">
									{dayInterviews.slice(0, 2).map((iv) => {
										const time = new Date(iv.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
										const tooltipParts = [
											`${iv.candidate_name} · ${iv.job_title}`,
											time,
											iv.interviewer_name ? `Interviewer: ${iv.interviewer_name}` : null,
											iv.notes ? `Notes: ${iv.notes}` : null,
										].filter(Boolean);
										return (
											<button
												key={iv.id}
												type="button"
												className="w-full text-left rounded px-1 py-0.5 bg-muted/50 space-y-0.5 hover:bg-muted/70 transition-colors cursor-pointer"
												title={tooltipParts.join("\n")}
												onClick={() => setSelectedInterview(iv)}
											>
												<div className="flex items-center gap-1">
													<span className={cn("size-1.5 rounded-full shrink-0", STATUS_COLORS[iv.status] || "bg-gray-400")} />
													<span className="text-[8px] text-muted-foreground shrink-0">{time}</span>
													<span className="text-[9px] truncate">{iv.candidate_name}</span>
												</div>
												{iv.interviewer_name && (
													<div className="text-[8px] text-muted-foreground truncate pl-2.5" title={iv.interviewer_name}>
														{iv.interviewer_name}
													</div>
												)}
												{iv.notes && (
													<div className="text-[8px] text-muted-foreground truncate pl-2.5 max-w-full" title={iv.notes}>
														{iv.notes}
													</div>
												)}
											</button>
										);
									})}
									{dayInterviews.length > 2 && (
										<span className="text-[9px] text-muted-foreground pl-1">
											+{dayInterviews.length - 2} more
										</span>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>

		<Dialog open={!!selectedInterview} onOpenChange={(open) => !open && setSelectedInterview(null)}>
			<DialogContent>
				{selectedInterview && (
					<>
						<DialogHeader>
							<DialogTitle>Interview details</DialogTitle>
						</DialogHeader>
						<div className="grid gap-3 text-sm">
							<div>
								<span className="text-muted-foreground">Candidate</span>
								<p className="font-medium">{selectedInterview.candidate_name}</p>
							</div>
							<div>
								<span className="text-muted-foreground">Job</span>
								<p className="font-medium">{selectedInterview.job_title}</p>
							</div>
							<div>
								<span className="text-muted-foreground">Date & time</span>
								<p className="font-medium">
									{new Date(selectedInterview.scheduled_at).toLocaleDateString(undefined, {
										weekday: "short",
										month: "short",
										day: "numeric",
										year: "numeric",
									})}{" "}
									at{" "}
									{new Date(selectedInterview.scheduled_at).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							</div>
							{selectedInterview.interviewer_name && (
								<div>
									<span className="text-muted-foreground">Interviewer</span>
									<p className="font-medium">{selectedInterview.interviewer_name}</p>
								</div>
							)}
							{selectedInterview.notes && (
								<div>
									<span className="text-muted-foreground">Notes</span>
									<p className="font-medium whitespace-pre-wrap">{selectedInterview.notes}</p>
								</div>
							)}
							<div>
								<span className="text-muted-foreground">Status</span>
								<p className="font-medium capitalize">{selectedInterview.status}</p>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setSelectedInterview(null)}>
								Close
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
		</>
	);
}
