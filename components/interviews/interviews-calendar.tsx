"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarInterview {
	id: string;
	scheduled_at: string;
	status: string;
	candidate_name: string;
	job_title: string;
	notes?: string | null;
	interviewer_name?: string | null;
	stage?: string | null;
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

	const maxVisible = 5;

	function eventTooltipContent(iv: CalendarInterview) {
		const time = new Date(iv.scheduled_at).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
		});
		const lines = [
			`${iv.candidate_name} · ${iv.job_title}`,
			`${time} · ${iv.status}`,
			...(iv.stage ? [`Pipeline: ${iv.stage}`] : []),
			...(iv.interviewer_name ? [`Interviewer: ${iv.interviewer_name}`] : []),
			...(iv.notes ? [`Notes: ${iv.notes}`] : []),
		];
		return lines.join("\n");
	}

	return (
		<TooltipProvider delayDuration={200}>
			<Card className="min-h-[640px] flex flex-col">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-base">
							<CalendarDays className="size-5" />
							Interview Calendar
						</CardTitle>
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="icon" className="size-8" onClick={prev}>
								<ChevronLeft className="size-4" />
							</Button>
							<span className="text-base font-medium min-w-[160px] text-center">
								{MONTHS[month]} {year}
							</span>
							<Button variant="ghost" size="icon" className="size-8" onClick={next}>
								<ChevronRight className="size-4" />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex-1 min-h-0">
					{/* Day headers */}
					<div className="grid grid-cols-7 gap-px mb-2">
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
							<div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
								{d}
							</div>
						))}
					</div>
					{/* Calendar grid */}
					<div className="grid grid-cols-7 gap-1">
						{Array.from({ length: firstDay }).map((_, i) => (
							<div key={`empty-${i}`} className="min-h-[140px] bg-muted/30 rounded-md" />
						))}
						{Array.from({ length: daysInMonth }).map((_, i) => {
							const day = i + 1;
							const dayInterviews = byDate[day.toString()] || [];
							const isToday = isCurrentMonth && day === today;
							return (
								<div
									key={day}
									className={cn(
										"min-h-[140px] p-2 rounded-md border border-transparent flex flex-col",
										isToday && "border-primary bg-primary/5",
										dayInterviews.length > 0 && "bg-muted/20"
									)}
								>
									<span
										className={cn(
											"text-sm font-medium shrink-0",
											isToday && "text-primary font-bold"
										)}
									>
										{day}
									</span>
									<div className="mt-1 space-y-1 flex-1 min-h-0 overflow-auto">
										{dayInterviews.slice(0, maxVisible).map((iv) => {
											const timeStr = new Date(iv.scheduled_at).toLocaleTimeString("en-US", {
												hour: "numeric",
												minute: "2-digit",
											});
											return (
												<Tooltip key={iv.id}>
													<TooltipTrigger asChild>
														<div className="rounded-md border bg-card px-2 py-1.5 text-left shadow-sm hover:bg-muted/50 cursor-default">
															<p className="text-xs font-medium truncate">
																{timeStr} · {iv.candidate_name}
															</p>
															<p className="text-[11px] text-muted-foreground truncate">
																{iv.job_title}
																{iv.stage ? ` · ${iv.stage}` : ""}
															</p>
															{(iv.interviewer_name || iv.notes) && (
																<p className="text-[10px] text-muted-foreground truncate mt-0.5">
																	{[iv.interviewer_name, iv.notes ? (iv.notes.length > 40 ? `${iv.notes.slice(0, 40)}…` : iv.notes) : null]
																		.filter(Boolean)
																		.join(" · ")}
																</p>
															)}
															<span
																className={cn(
																	"inline-block size-2 rounded-full mt-0.5",
																	STATUS_COLORS[iv.status] || "bg-gray-400"
																)}
																aria-hidden
															/>
														</div>
													</TooltipTrigger>
													<TooltipContent side="right" className="max-w-xs whitespace-pre-line text-xs">
														{eventTooltipContent(iv)}
													</TooltipContent>
												</Tooltip>
											);
										})}
										{dayInterviews.length > maxVisible && (
											<span className="text-xs text-muted-foreground pl-1">
												+{dayInterviews.length - maxVisible} more
											</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</TooltipProvider>
	);
}
