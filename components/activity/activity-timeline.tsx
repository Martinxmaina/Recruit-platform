"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date";
import {
	User,
	Briefcase,
	FileText,
	Calendar,
	MessageSquare,
	ArrowRight,
	CheckCircle,
	XCircle,
	Clock,
} from "lucide-react";
import type { ActivityLog } from "@/app/(dashboard)/activity/actions";

interface ActivityTimelineProps {
	activities: ActivityLog[];
	showCandidateLinks?: boolean;
}

const actionIcons: Record<string, React.ReactNode> = {
	application_created: <Briefcase className="size-4" />,
	application_updated: <Briefcase className="size-4" />,
	stage_changed: <ArrowRight className="size-4" />,
	status_changed: <CheckCircle className="size-4" />,
	interview_scheduled: <Calendar className="size-4" />,
	interview_completed: <CheckCircle className="size-4" />,
	interview_cancelled: <XCircle className="size-4" />,
	note_added: <MessageSquare className="size-4" />,
	candidate_created: <User className="size-4" />,
	candidate_updated: <User className="size-4" />,
	candidate_tracked: <User className="size-4" />,
};

const actionColors: Record<string, string> = {
	application_created: "bg-blue-500",
	stage_changed: "bg-purple-500",
	status_changed: "bg-green-500",
	interview_scheduled: "bg-orange-500",
	interview_completed: "bg-green-500",
	note_added: "bg-yellow-500",
	candidate_tracked: "bg-indigo-500",
};

function formatActionType(actionType: string): string {
	return actionType
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function getActionDescription(activity: ActivityLog): string {
	const { action_type, old_values, new_values, action_details } = activity;

	if (action_type === "stage_changed" && old_values && new_values) {
		const oldStage = (old_values as { stage?: string }).stage || "Unknown";
		const newStage = (new_values as { stage?: string }).stage || "Unknown";
		const note = action_details?.note as string | undefined;
		return `Moved from "${oldStage}" to "${newStage}"${note ? `: ${note}` : ""}`;
	}

	if (action_type === "status_changed" && old_values && new_values) {
		const oldStatus = (old_values as { status?: string }).status || "Unknown";
		const newStatus = (new_values as { status?: string }).status || "Unknown";
		return `Status changed from "${oldStatus}" to "${newStatus}"`;
	}

	if (action_type === "interview_scheduled") {
		const interviewer = action_details?.interviewer_name as string | undefined;
		const scheduledAt = action_details?.scheduled_at as string | undefined;
		if (interviewer && scheduledAt) {
			return `Scheduled with ${interviewer} on ${formatDate(scheduledAt)}`;
		}
		return "Interview scheduled";
	}

	if (action_type === "note_added") {
		const content = action_details?.content as string | undefined;
		if (content) {
			return content.length > 100 ? `${content.substring(0, 100)}...` : content;
		}
		return "Note added";
	}

	return formatActionType(action_type);
}

function getEntityLink(activity: ActivityLog): string | null {
	const { entity_type, entity_id, action_details } = activity;

	if (entity_type === "candidate") {
		return `/candidates/${entity_id}`;
	}
	if (entity_type === "application") {
		const jobId = (action_details as { job_id?: string })?.job_id;
		if (jobId) {
			return `/jobs/${jobId}`;
		}
		return `/candidates/${activity.candidate_id || ""}`;
	}
	if (entity_type === "job") {
		return `/jobs/${entity_id}`;
	}
	if (entity_type === "interview") {
		const applicationId = (action_details as { application_id?: string })
			?.application_id;
		if (applicationId) {
			return `/interviews`;
		}
	}
	return null;
}

export function ActivityTimeline({
	activities,
	showCandidateLinks = true,
}: ActivityTimelineProps) {
	if (activities.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Clock className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No activity recorded yet.</p>
			</div>
		);
	}

	// Group activities by date
	const groupedByDate: Record<string, ActivityLog[]> = {};
	activities.forEach((activity) => {
		const date = new Date(activity.created_at).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		if (!groupedByDate[date]) {
			groupedByDate[date] = [];
		}
		groupedByDate[date].push(activity);
	});

	return (
		<div className="space-y-6">
			{Object.entries(groupedByDate)
				.sort(([dateA], [dateB]) => {
					return new Date(dateB).getTime() - new Date(dateA).getTime();
				})
				.map(([date, dateActivities]) => (
					<div key={date} className="space-y-4">
						<h3 className="text-sm font-semibold text-muted-foreground sticky top-0 bg-background py-2">
							{date}
						</h3>
						<div className="space-y-3">
							{dateActivities.map((activity) => {
								const icon = actionIcons[activity.action_type] || (
									<FileText className="size-4" />
								);
								const color =
									actionColors[activity.action_type] || "bg-gray-500";
								const entityLink = getEntityLink(activity);

								return (
									<Card key={activity.id} className="hover:shadow-sm transition-shadow">
										<CardContent className="pt-4">
											<div className="flex items-start gap-4">
												<div
													className={`${color} rounded-full p-2 text-white shrink-0`}
												>
													{icon}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between gap-2">
														<div className="flex-1">
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-semibold text-sm">
																	{activity.user_name}
																</span>
																<span className="text-muted-foreground text-xs">
																	{formatActionType(activity.action_type)}
																</span>
															</div>
															<p className="text-sm text-muted-foreground mt-1">
																{getActionDescription(activity)}
															</p>
															{activity.duration_minutes && (
																<Badge variant="outline" className="mt-2 text-xs">
																	<Clock className="mr-1 size-3" />
																	{activity.duration_minutes} min
																</Badge>
															)}
														</div>
														<div className="text-xs text-muted-foreground shrink-0">
															{new Date(activity.created_at).toLocaleTimeString(
																"en-US",
																{
																	hour: "numeric",
																	minute: "2-digit",
																}
															)}
														</div>
													</div>
													{showCandidateLinks && activity.candidate_id && (
														<div className="mt-2">
															<Link
																href={`/candidates/${activity.candidate_id}`}
																className="text-xs text-primary hover:underline"
															>
																View Candidate →
															</Link>
														</div>
													)}
													{entityLink && (
														<div className="mt-2">
															<Link
																href={entityLink}
																className="text-xs text-primary hover:underline"
															>
																View Details →
															</Link>
														</div>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				))}
		</div>
	);
}
