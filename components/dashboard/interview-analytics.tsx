"use client";

import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Clock, TrendingUp } from "lucide-react";

interface InterviewAnalyticsProps {
	completionRate: number;
	avgDaysToHire: number;
	byStatus: { name: string; value: number }[];
}

const STATUS_COLORS: Record<string, string> = {
	scheduled: "#3b82f6",
	completed: "#22c55e",
	cancelled: "#ef4444",
	rescheduled: "#f59e0b",
};

export function InterviewAnalytics({
	completionRate,
	avgDaysToHire,
	byStatus,
}: InterviewAnalyticsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm font-semibold">Interview Analytics</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Metrics row */}
				<div className="grid grid-cols-2 gap-4">
					<div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
						<CalendarCheck className="size-4 text-green-500" />
						<div>
							<p className="text-lg font-bold">{completionRate}%</p>
							<p className="text-[10px] text-muted-foreground">Completion Rate</p>
						</div>
					</div>
					<div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
						<Clock className="size-4 text-blue-500" />
						<div>
							<p className="text-lg font-bold">{avgDaysToHire}d</p>
							<p className="text-[10px] text-muted-foreground">Avg Time to Hire</p>
						</div>
					</div>
				</div>

				{/* Status breakdown */}
				{byStatus.length > 0 ? (
					<div className="h-[150px]">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={byStatus}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={55}
									innerRadius={30}
									strokeWidth={2}
								>
									{byStatus.map((entry) => (
										<Cell
											key={entry.name}
											fill={STATUS_COLORS[entry.name] || "#8884d8"}
										/>
									))}
								</Pie>
								<Tooltip
									contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				) : (
					<div className="flex items-center justify-center py-6">
						<p className="text-xs text-muted-foreground">No interview data</p>
					</div>
				)}

				{/* Legend */}
				<div className="flex flex-wrap gap-3">
					{byStatus.map((s) => (
						<div key={s.name} className="flex items-center gap-1.5">
							<span
								className="size-2 rounded-full"
								style={{ backgroundColor: STATUS_COLORS[s.name] || "#8884d8" }}
							/>
							<span className="text-[10px] capitalize text-muted-foreground">
								{s.name} ({s.value})
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
