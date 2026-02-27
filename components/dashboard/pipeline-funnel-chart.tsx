"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface PipelineFunnelChartProps {
	data: { stage: string; count: number }[];
}

const FUNNEL_COLORS = [
	"#6366f1",
	"#8b5cf6",
	"#a78bfa",
	"#c4b5fd",
	"#ddd6fe",
	"#ede9fe",
];

export function PipelineFunnelChart({ data }: PipelineFunnelChartProps) {
	if (!data || data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-semibold">Pipeline Funnel</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center py-8">
					<BarChart3 className="mb-2 size-8 text-muted-foreground/50" />
					<p className="text-xs text-muted-foreground">No pipeline data</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm font-semibold">Pipeline Funnel</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[250px]">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={data} layout="vertical">
							<CartesianGrid strokeDasharray="3 3" horizontal={false} />
							<XAxis type="number" fontSize={11} />
							<YAxis
								dataKey="stage"
								type="category"
								width={100}
								fontSize={11}
								tickLine={false}
							/>
							<Tooltip
								contentStyle={{
									fontSize: "12px",
									borderRadius: "8px",
								}}
							/>
							<Bar dataKey="count" radius={[0, 4, 4, 0]}>
								{data.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
