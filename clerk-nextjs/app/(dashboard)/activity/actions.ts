"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActivityLog = {
	id: string;
	organization_id: string;
	entity_type: string;
	entity_id: string;
	candidate_id: string | null;
	user_id: string;
	user_name: string;
	action_type: string;
	action_details: Record<string, unknown>;
	old_values: Record<string, unknown> | null;
	new_values: Record<string, unknown> | null;
	duration_minutes: number | null;
	created_at: string;
	metadata: Record<string, unknown>;
};

/**
 * Get all activity for a specific candidate
 */
export async function getCandidateActivity(candidateId: string) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return [];

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return [];

	const { data, error } = await supabase
		.from("activity_logs")
		.select("*")
		.eq("organization_id", org.id)
		.eq("candidate_id", candidateId)
		.order("created_at", { ascending: false })
		.limit(100);

	if (error) {
		console.error("Error fetching candidate activity:", error);
		return [];
	}

	return (data as ActivityLog[]) ?? [];
}

/**
 * Get activity for a specific job (through applications)
 */
export async function getJobActivity(jobId: string) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return [];

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return [];

	// Get all applications for this job
	const { data: applications } = await supabase
		.from("applications")
		.select("id, candidate_id")
		.eq("job_id", jobId)
		.eq("organization_id", org.id);

	if (!applications || applications.length === 0) return [];

	const applicationIds = applications.map((a) => a.id);

	const { data, error } = await supabase
		.from("activity_logs")
		.select("*")
		.eq("organization_id", org.id)
		.in("entity_id", applicationIds)
		.eq("entity_type", "application")
		.order("created_at", { ascending: false })
		.limit(100);

	if (error) {
		console.error("Error fetching job activity:", error);
		return [];
	}

	return (data as ActivityLog[]) ?? [];
}

/**
 * Get activity for the currently logged-in user (worklog)
 */
export async function getUserActivity(dateRange?: { start?: string; end?: string }) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return [];

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return [];

	let query = supabase
		.from("activity_logs")
		.select("*")
		.eq("organization_id", org.id)
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (dateRange?.start) {
		query = query.gte("created_at", dateRange.start);
	}
	if (dateRange?.end) {
		query = query.lte("created_at", dateRange.end);
	}

	const { data, error } = await query.limit(500);

	if (error) {
		console.error("Error fetching user activity:", error);
		return [];
	}

	return (data as ActivityLog[]) ?? [];
}

/**
 * Get activity statistics for the current user
 */
export async function getActivityStats(dateRange?: { start?: string; end?: string }) {
	const activities = await getUserActivity(dateRange);

	const totalHours =
		activities.reduce((sum, a) => sum + (a.duration_minutes || 0), 0) / 60;
	const actionsByType: Record<string, number> = {};

	activities.forEach((activity) => {
		actionsByType[activity.action_type] = (actionsByType[activity.action_type] || 0) + 1;
	});

	return {
		totalActivities: activities.length,
		totalHours: Math.round(totalHours * 100) / 100,
		actionsByType,
	};
}
