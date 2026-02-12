"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
 * Automatically extracts user info from auth context and organization
 */
export async function createActivityLog(data: ActivityLogData) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) {
		console.warn("Cannot create activity log: user not authenticated");
		return { error: "Unauthorized" };
	}

	const supabase = await createAdminClient(userId);

	// Get organization_id
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return { error: "Organization not found" };
	}

	// Get user name from Clerk (fallback to user ID)
	let userName = userId;
	try {
		// In a real implementation, you might fetch user name from Clerk
		// For now, use userId as fallback
		userName = userId;
	} catch {
		// Use userId as fallback
	}

	const { error } = await supabase.from("activity_logs").insert({
		organization_id: org.id,
		entity_type: data.entityType,
		entity_id: data.entityId,
		candidate_id: data.candidateId || null,
		user_id: userId,
		user_name: userName,
		action_type: data.actionType,
		action_details: data.actionDetails || {},
		old_values: data.oldValues || null,
		new_values: data.newValues || null,
		duration_minutes: data.durationMinutes || null,
		metadata: data.metadata || {},
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
