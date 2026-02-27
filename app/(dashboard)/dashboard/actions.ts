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

	const supabase = await createAdminClient(ctx.userId);
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

	const supabase = await createAdminClient(ctx.userId);
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

export async function getRecentActivity() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data } = await supabase
		.from("applications")
		.select(`
			id,
			updated_at,
			status,
			stage,
			candidates!inner (full_name),
			jobs!inner (title)
		`)
		.eq("organization_id", ctx.orgId)
		.order("updated_at", { ascending: false })
		.limit(5);

	return (data ?? []).map((a: any) => ({
		id: a.id,
		title: "Application Updated",
		description: `${a.candidates.full_name} moved to ${a.stage} for ${a.jobs.title}`,
		time: formatActivityTime(a.updated_at),
	}));
}

export async function getApplicationsOverTime() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
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

	const supabase = await createAdminClient(ctx.userId);
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

	const supabase = await createAdminClient(ctx.userId);
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

	const supabase = await createAdminClient(ctx.userId);
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

	const supabase = await createAdminClient(ctx.userId);
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

	const supabase = await createAdminClient(ctx.userId);
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
