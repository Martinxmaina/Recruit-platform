"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarInterview {
	id: string;
	scheduled_at: string;
	status: string;
	candidate_name: string;
	job_title: string;
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

	return (
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
									{dayInterviews.slice(0, 2).map((iv) => (
										<div
											key={iv.id}
											className="flex items-center gap-1 rounded px-1 py-0.5 bg-muted/50"
											title={`${iv.candidate_name} - ${iv.job_title}`}
										>
											<span className={cn("size-1.5 rounded-full shrink-0", STATUS_COLORS[iv.status] || "bg-gray-400")} />
											<span className="text-[9px] truncate">{iv.candidate_name}</span>
										</div>
									))}
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
	);
}
