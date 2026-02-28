"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, TrendingUp, Users } from "lucide-react";
import { ActivityTimeline } from "./activity-timeline";
import type { ActivityLog } from "@/app/(dashboard)/activity/actions";

interface UserWorklogProps {
	activities: ActivityLog[];
	orgActivities: ActivityLog[];
	stats: {
		totalActivities: number;
		totalHours: number;
		actionsByType: Record<string, number>;
	};
}

export function UserWorklog({ activities, orgActivities, stats }: UserWorklogProps) {
	return (
		<div className="space-y-6">
			<Tabs defaultValue="workflow" className="space-y-4">
				<TabsList>
					<TabsTrigger value="workflow" className="gap-2">
						<Users className="size-4" />
						Team workflow
					</TabsTrigger>
					<TabsTrigger value="mine" className="gap-2">
						<Calendar className="size-4" />
						My activity
					</TabsTrigger>
				</TabsList>

				<TabsContent value="workflow" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Team workflow</CardTitle>
							<p className="text-sm text-muted-foreground">
								{orgActivities.length} actions in the last 30 days
							</p>
						</CardHeader>
						<CardContent>
							<ActivityTimeline activities={orgActivities} showCandidateLinks={true} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="mine" className="space-y-6">
					{/* Stats Cards */}
					<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Activities</CardTitle>
						<TrendingUp className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalActivities}</div>
						<p className="text-xs text-muted-foreground">Actions performed</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
						<Clock className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}</div>
						<p className="text-xs text-muted-foreground">Time tracked</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Activity Types</CardTitle>
						<Calendar className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Object.keys(stats.actionsByType).length}
						</div>
						<p className="text-xs text-muted-foreground">Different actions</p>
					</CardContent>
				</Card>
			</div>

			{/* Activity Breakdown */}
			{Object.keys(stats.actionsByType).length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Activity Breakdown</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{Object.entries(stats.actionsByType)
								.sort(([, a], [, b]) => b - a)
								.map(([actionType, count]) => (
									<Badge key={actionType} variant="secondary">
										{actionType.replace(/_/g, " ")}: {count}
									</Badge>
								))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Activity Timeline */}
					<Card>
						<CardHeader>
							<CardTitle>Activity Timeline</CardTitle>
						</CardHeader>
						<CardContent>
							<ActivityTimeline activities={activities} showCandidateLinks={true} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
