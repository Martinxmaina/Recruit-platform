"use client";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardChartsProps {
	applicationsOverTime: { date: string; count: number }[];
	jobStatusDistribution: { name: string; value: number }[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

export function DashboardCharts({
	applicationsOverTime,
	jobStatusDistribution,
}: DashboardChartsProps) {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{/* Application Volume Line Chart */}
			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium">Application Trends</CardTitle>
				</CardHeader>
				<CardContent className="h-[300px] w-full">
					{applicationsOverTime.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={applicationsOverTime}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
								<XAxis
									dataKey="date"
									tick={{ fontSize: 12, fill: "#6B7280" }}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									tick={{ fontSize: 12, fill: "#6B7280" }}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "var(--background)",
										borderColor: "var(--border)",
										borderRadius: "8px",
										fontSize: "12px",
									}}
								/>
								<Line
									type="monotone"
									dataKey="count"
									stroke="var(--primary)"
									strokeWidth={2}
									dot={{ r: 4, fill: "var(--primary)" }}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					) : (
						<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
							No application data available
						</div>
					)}
				</CardContent>
			</Card>

			{/* Job Status Pie Chart */}
			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium">Jobs by Status</CardTitle>
				</CardHeader>
				<CardContent className="h-[300px] w-full">
					{jobStatusDistribution.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={jobStatusDistribution}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={80}
									fill="#8884d8"
									paddingAngle={5}
									dataKey="value"
								>
									{jobStatusDistribution.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: "var(--background)",
										borderColor: "var(--border)",
										borderRadius: "8px",
										fontSize: "12px",
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					) : (
						<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
							No job status data available
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
