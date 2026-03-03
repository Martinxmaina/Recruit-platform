"use server";

import { getCurrentUserOrg } from "@/lib/api/helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

function getStartOfWeek(date: Date) {
	const value = new Date(date);
	const day = value.getDay();
	value.setDate(value.getDate() - day);
	value.setHours(0, 0, 0, 0);
	return value;
}

function getEndOfWeek(date: Date) {
	const value = getStartOfWeek(date);
	value.setDate(value.getDate() + 6);
	value.setHours(23, 59, 59, 999);
	return value;
}

function subtractDays(date: Date, days: number) {
	const value = new Date(date);
	value.setDate(value.getDate() - days);
	return value;
}

function formatDayLabel(value: string | Date) {
	return new Date(value).toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
	});
}

function formatActivityTime(value: string | Date | null) {
	if (!value) {
		return "Just now";
	}

	return new Date(value).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

export async function getDashboardStats() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) redirect("/dashboard");

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const now = new Date();
	const weekStart = getStartOfWeek(now).toISOString();
	const weekEnd = getEndOfWeek(now).toISOString();

	const [activeJobs, candidates, interviews, placements] = await Promise.all([
		supabase
			.from("jobs")
			.select("*", { count: "exact", head: true })
			.eq("organization_id", ctx.orgId)
			.eq("status", "open"),
		supabase
			.from("candidates")
			.select("*", { count: "exact", head: true })
			.eq("organization_id", ctx.orgId),
		supabase
			.from("interviews")
			.select("*", { count: "exact", head: true })
			.eq("organization_id", ctx.orgId)
			.gte("scheduled_at", weekStart)
			.lte("scheduled_at", weekEnd),
		supabase
			.from("applications")
			.select("*", { count: "exact", head: true })
			.eq("organization_id", ctx.orgId)
			.eq("status", "hired"),
	]);

	return {
		activeJobs: activeJobs.count ?? 0,
		candidates: candidates.count ?? 0,
		interviewsThisWeek: interviews.count ?? 0,
		placements: placements.count ?? 0,
	};
}

export async function getUpcomingInterviews() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const { data } = await supabase
		.from("interviews")
		.select(`
			id,
			scheduled_at,
			status,
			applications!inner (
				candidates!inner (full_name),
				jobs!inner (title)
			)
		`)
		.eq("organization_id", ctx.orgId)
		.gte("scheduled_at", new Date().toISOString())
		.order("scheduled_at", { ascending: true })
		.limit(5);

	return (data ?? []).map((i: any) => ({
		id: i.id,
		candidate: i.applications.candidates.full_name,
		jobTitle: i.applications.jobs.title,
		date: new Date(i.scheduled_at).toLocaleDateString(),
		time: new Date(i.scheduled_at).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		}),
		status: i.status,
	}));
}

/** Build short description from activity_log row (mirrors activity-timeline logic). */
function getActivityDescription(row: {
	action_type: string;
	old_values?: Record<string, unknown> | null;
	new_values?: Record<string, unknown> | null;
	action_details?: Record<string, unknown>;
}): string {
	const { action_type, old_values, new_values, action_details } = row;
	if (action_type === "stage_changed" && new_values) {
		const newStage = (new_values as { stage?: string }).stage || "Unknown";
		const oldStage = (old_values as { stage?: string })?.stage;
		const note = action_details?.note as string | undefined;
		const from = oldStage ? ` from ${oldStage}` : "";
		return `moved the candidate to ${newStage}${from}${note ? `: ${note}` : ""}`;
	}
	if (action_type === "status_changed" && old_values && new_values) {
		const oldStatus = (old_values as { status?: string }).status || "Unknown";
		const newStatus = (new_values as { status?: string }).status || "Unknown";
		return `changed status from "${oldStatus}" to "${newStatus}"`;
	}
	if (action_type === "interview_scheduled") {
		const interviewer = action_details?.interviewer_name as string | undefined;
		const scheduledAt = action_details?.scheduled_at as string | undefined;
		if (interviewer && scheduledAt) {
			const d = new Date(scheduledAt).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
			return `scheduled an interview with ${interviewer} on ${d}`;
		}
		return "scheduled an interview";
	}
	if (action_type === "note_added") {
		const content = action_details?.content as string | undefined;
		if (content) {
			const preview = content.length > 80 ? `${content.substring(0, 80)}...` : content;
			return `added notes: ${preview}`;
		}
		return "added notes";
	}
	if (action_type === "application_created") return "added the candidate to the job";
	if (action_type === "candidate_created") return "created the candidate";
	if (action_type === "candidate_tracked") return "added candidate to tracking";
	const formatted = action_type
		.split("_")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
	return formatted.toLowerCase();
}

/** Build link for activity item (candidate or job). */
function getActivityLink(row: {
	entity_type: string;
	entity_id: string;
	candidate_id: string | null;
	action_details?: Record<string, unknown>;
}): string | null {
	if (row.entity_type === "candidate" || row.candidate_id) {
		return `/candidates/${row.candidate_id || row.entity_id}`;
	}
	if (row.entity_type === "application") {
		const jobId = (row.action_details as { job_id?: string })?.job_id;
		if (jobId) return `/jobs/${jobId}`;
		return row.candidate_id ? `/candidates/${row.candidate_id}` : null;
	}
	if (row.entity_type === "job") return `/jobs/${row.entity_id}`;
	return null;
}

export async function getRecentActivity() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const { data } = await supabase
		.from("activity_logs")
		.select("*")
		.eq("organization_id", ctx.orgId)
		.order("created_at", { ascending: false })
		.limit(10);

	if (!data || data.length === 0) return [];

	return data.map((row: Record<string, unknown>) => ({
		id: row.id as string,
		user_name: (row.user_name as string) || "System",
		description: getActivityDescription({
			action_type: row.action_type as string,
			old_values: row.old_values as Record<string, unknown> | null,
			new_values: row.new_values as Record<string, unknown> | null,
			action_details: (row.action_details as Record<string, unknown>) ?? {},
		}),
		time: formatActivityTime(row.created_at as string),
		link: getActivityLink({
			entity_type: row.entity_type as string,
			entity_id: row.entity_id as string,
			candidate_id: row.candidate_id as string | null,
			action_details: row.action_details as Record<string, unknown>,
		}),
	}));
}

export async function getApplicationsOverTime() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const thirtyDaysAgo = subtractDays(new Date(), 30).toISOString();

	const { data } = await supabase
		.from("applications")
		.select("applied_at")
		.eq("organization_id", ctx.orgId)
		.gte("applied_at", thirtyDaysAgo)
		.order("applied_at", { ascending: true });

	if (!data) return [];

	// Group by date
	const groups = data.reduce((acc: Record<string, number>, curr) => {
		if (!curr.applied_at) return acc;
		const date = formatDayLabel(curr.applied_at);
		acc[date] = (acc[date] || 0) + 1;
		return acc;
	}, {});

	return Object.entries(groups).map(([date, count]) => ({ date, count }));
}

export async function getJobStatusDistribution() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const { data } = await supabase
		.from("jobs")
		.select("status")
		.eq("organization_id", ctx.orgId);

	if (!data) return [];

	const groups = data.reduce((acc: Record<string, number>, curr) => {
		acc[curr.status] = (acc[curr.status] || 0) + 1;
		return acc;
	}, {});

	return Object.entries(groups).map(([name, value]) => ({ name, value }));
}

/**
 * Returns application counts per pipeline stage for funnel chart.
 */
export async function getPipelineConversionMetrics() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const { data: stages } = await supabase
		.from("pipeline_stages")
		.select("name, sort_order")
		.eq("organization_id", ctx.orgId)
		.order("sort_order", { ascending: true });

	if (!stages || stages.length === 0) return [];

	const { data: apps } = await supabase
		.from("applications")
		.select("stage")
		.eq("organization_id", ctx.orgId);

	if (!apps) return [];

	const counts: Record<string, number> = {};
	for (const app of apps) {
		counts[app.stage] = (counts[app.stage] || 0) + 1;
	}

	return stages.map((s) => ({
		stage: s.name,
		count: counts[s.name] || 0,
	}));
}

/**
 * Returns interview analytics: completion rate, avg time to hire, interviews by status.
 */
export async function getInterviewAnalytics() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { completionRate: 0, avgDaysToHire: 0, byStatus: [] };

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const { data: interviews } = await supabase
		.from("interviews")
		.select("status, scheduled_at")
		.eq("organization_id", ctx.orgId);

	if (!interviews || interviews.length === 0) {
		return { completionRate: 0, avgDaysToHire: 0, byStatus: [] };
	}

	// Completion rate
	const completed = interviews.filter((i) => i.status === "completed").length;
	const completionRate = Math.round((completed / interviews.length) * 100);

	// By status
	const statusCounts: Record<string, number> = {};
	for (const i of interviews) {
		statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
	}
	const byStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

	const { data: hired } = await supabase
		.from("applications")
		.select("applied_at, updated_at")
		.eq("organization_id", ctx.orgId)
		.eq("status", "hired");

	let avgDaysToHire = 0;
	if (hired && hired.length > 0) {
		const days = hired
			.filter((h) => h.applied_at && h.updated_at)
			.map((h) => {
				const diff = new Date(h.updated_at!).getTime() - new Date(h.applied_at!).getTime();
				return diff / (1000 * 60 * 60 * 24);
			});
		avgDaysToHire = days.length > 0 ? Math.round(days.reduce((a, b) => a + b, 0) / days.length) : 0;
	}

	return { completionRate, avgDaysToHire, byStatus };
}

/**
 * Returns all candidates as CSV-ready data.
 */
export async function getCandidatesForExport() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const { data } = await supabase
		.from("candidates")
		.select("full_name, email, phone, location, current_title, source, created_at")
		.eq("organization_id", ctx.orgId)
		.order("created_at", { ascending: false });

	return data ?? [];
}

/**
 * Returns all jobs as CSV-ready data.
 */
export async function getJobsForExport() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId, ctx.displayName);
	const { data } = await supabase
		.from("jobs")
		.select("title, status, location, country, work_type, created_at, clients(name)")
		.eq("organization_id", ctx.orgId)
		.order("created_at", { ascending: false });

	return (data ?? []).map((j: any) => ({
		title: j.title,
		status: j.status,
		location: j.location,
		country: j.country,
		work_type: j.work_type,
		client: j.clients?.name ?? "",
		created_at: j.created_at,
	}));
}
