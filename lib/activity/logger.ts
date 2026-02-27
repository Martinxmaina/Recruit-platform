"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentUserOrg } from "@/lib/api/helpers";
import type { Json } from "@/lib/supabase/types";

export type ActivityLogData = {
	entityType: "candidate" | "application" | "job" | "interview" | "note" | "tracked_candidate";
	entityId: string;
	candidateId?: string | null;
	actionType: string;
	actionDetails?: Record<string, unknown>;
	oldValues?: Record<string, unknown>;
	newValues?: Record<string, unknown>;
	durationMinutes?: number | null;
	metadata?: Record<string, unknown>;
};

/**
 * Create an activity log entry
 * Uses current Supabase user and org from session.
 */
export async function createActivityLog(data: ActivityLogData) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) {
		console.warn("Cannot create activity log: user not authenticated");
		return { error: "Unauthorized" };
	}

	const user = await getCurrentUser();
	const userName =
		(user?.user_metadata?.full_name as string) ?? user?.email ?? ctx.userId;

	const supabase = await createAdminClient(ctx.userId);
	const { error } = await supabase.from("activity_logs").insert({
		organization_id: ctx.orgId,
		entity_type: data.entityType,
		entity_id: data.entityId,
		candidate_id: data.candidateId || null,
		user_id: ctx.userId,
		user_name: userName,
		action_type: data.actionType,
		action_details: (data.actionDetails || {}) as Json,
		old_values: (data.oldValues || null) as Json | null,
		new_values: (data.newValues || null) as Json | null,
		duration_minutes: data.durationMinutes || null,
		metadata: (data.metadata || {}) as Json,
	});

	if (error) {
		console.error("Error creating activity log:", error);
		return { error: error.message };
	}

	return { success: true };
}

/**
 * Helper to log application stage changes with notes
 */
export async function logStageChange(
	applicationId: string,
	candidateId: string,
	oldStage: string,
	newStage: string,
	note?: string
) {
	return createActivityLog({
		entityType: "application",
		entityId: applicationId,
		candidateId,
		actionType: "stage_changed",
		oldValues: { stage: oldStage },
		newValues: { stage: newStage },
		actionDetails: note ? { note } : {},
	});
}

/**
 * Helper to log interview scheduling with interviewer info
 */
export async function logInterviewScheduled(
	interviewId: string,
	applicationId: string,
	candidateId: string,
	interviewerUserId?: string,
	interviewerName?: string,
	scheduledAt?: string
) {
	return createActivityLog({
		entityType: "interview",
		entityId: interviewId,
		candidateId,
		actionType: "interview_scheduled",
		actionDetails: {
			application_id: applicationId,
			interviewer_user_id: interviewerUserId,
			interviewer_name: interviewerName,
			scheduled_at: scheduledAt,
		},
		newValues: {
			interviewer_user_id: interviewerUserId,
			interviewer_name: interviewerName,
			scheduled_at: scheduledAt,
		},
	});
}
