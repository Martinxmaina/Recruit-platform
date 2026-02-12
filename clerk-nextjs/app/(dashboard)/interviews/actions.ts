"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type Interview = {
	id: string;
	organization_id: string;
	application_id: string;
	scheduled_at: string;
	status: string;
	notes: string | null;
	interviewer_user_id: string | null;
	interviewer_name: string | null;
	created_at: string | null;
	updated_at: string | null;
};

export async function getInterviews(filters?: {
	job_id?: string;
	candidate_id?: string;
	status?: string;
	upcoming?: boolean;
}) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		redirect("/dashboard");
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return [];
	}

	// Get application IDs that match filters (if any)
	let applicationIds: string[] | null = null;

	if (filters?.job_id || filters?.candidate_id) {
		let appQuery = supabase
			.from("applications")
			.select("id")
			.eq("organization_id", org.id);

		if (filters?.job_id) {
			appQuery = appQuery.eq("job_id", filters.job_id);
		}

		if (filters?.candidate_id) {
			appQuery = appQuery.eq("candidate_id", filters.candidate_id);
		}

		const { data: matchingApplications } = await appQuery;

		if (!matchingApplications || matchingApplications.length === 0) {
			// No applications match the filters, return empty
			return [];
		}

		applicationIds = matchingApplications.map((app) => app.id);
	}

	// Build interview query
	let query = supabase
		.from("interviews")
		.select(
			`
			*,
			applications!inner(
				id,
				candidates!inner(
					id,
					full_name,
					email
				),
				jobs!inner(
					id,
					title
				)
			)
		`
		)
		.eq("organization_id", org.id);

	// Filter by application IDs if we have them
	if (applicationIds) {
		query = query.in("application_id", applicationIds);
	}

	if (filters?.status) {
		query = query.eq("status", filters.status);
	}

	if (filters?.upcoming !== undefined) {
		const now = new Date().toISOString();
		if (filters.upcoming) {
			query = query.gte("scheduled_at", now);
		} else {
			query = query.lt("scheduled_at", now);
		}
	}

	const { data: interviews, error } = await query.order("scheduled_at", {
		ascending: true,
	});

	if (error) {
		console.error("Error fetching interviews:", error);
		return [];
	}

	return interviews ?? [];
}

export async function getCandidateInterviews(candidateId: string) {
	return getInterviews({ candidate_id: candidateId });
}

export async function getInterview(id: string) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		redirect("/dashboard");
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return null;
	}

	const { data: interview, error } = await supabase
		.from("interviews")
		.select(
			`
			*,
			applications!inner(
				id,
				candidates!inner(
					id,
					full_name,
					email
				),
				jobs!inner(
					id,
					title
				)
			)
		`
		)
		.eq("id", id)
		.eq("organization_id", org.id)
		.single();

	if (error) {
		console.error("Error fetching interview:", error);
		return null;
	}

	return interview;
}

export async function createInterview(
	applicationId: string,
	data: {
		scheduled_at: string;
		status?: string;
		notes?: string | null;
		interviewer_user_id?: string | null;
		interviewer_name?: string | null;
	}
) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return { error: "Unauthorized" };
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return { error: "Organization not found" };
	}

	// Verify application exists and belongs to organization
	const { data: application } = await supabase
		.from("applications")
		.select("id, job_id, candidate_id")
		.eq("id", applicationId)
		.eq("organization_id", org.id)
		.single();

	if (!application) {
		return { error: "Application not found" };
	}

	const { data: interview, error } = await supabase
		.from("interviews")
		.insert({
			organization_id: org.id,
			application_id: applicationId,
			scheduled_at: data.scheduled_at,
			status: data.status || "scheduled",
			notes: data.notes || null,
			interviewer_user_id: data.interviewer_user_id || null,
			interviewer_name: data.interviewer_name || null,
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating interview:", error);
		return { error: error.message };
	}

	revalidatePath("/jobs");
	revalidatePath("/candidates");
	revalidatePath(`/jobs/${application.job_id}`);
	revalidatePath(`/candidates/${application.candidate_id}`);
	return { data: interview };
}

export async function updateInterview(
	id: string,
	data: {
		scheduled_at?: string;
		status?: string;
		notes?: string | null;
		interviewer_user_id?: string | null;
		interviewer_name?: string | null;
	}
) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return { error: "Unauthorized" };
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return { error: "Organization not found" };
	}

	const updateData: Record<string, unknown> = {
		updated_at: new Date().toISOString(),
	};

	if (data.scheduled_at !== undefined) updateData.scheduled_at = data.scheduled_at;
	if (data.status !== undefined) updateData.status = data.status;
	if (data.notes !== undefined) updateData.notes = data.notes;
	if (data.interviewer_user_id !== undefined)
		updateData.interviewer_user_id = data.interviewer_user_id;
	if (data.interviewer_name !== undefined)
		updateData.interviewer_name = data.interviewer_name;

	const { data: interview, error } = await supabase
		.from("interviews")
		.update(updateData)
		.eq("id", id)
		.eq("organization_id", org.id)
		.select()
		.single();

	if (error) {
		console.error("Error updating interview:", error);
		return { error: error.message };
	}

	revalidatePath("/interviews");
	revalidatePath("/jobs");
	revalidatePath("/candidates");
	return { data: interview };
}

export async function deleteInterview(id: string) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return { error: "Unauthorized" };
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return { error: "Organization not found" };
	}

	const { error } = await supabase
		.from("interviews")
		.delete()
		.eq("id", id)
		.eq("organization_id", org.id);

	if (error) {
		console.error("Error deleting interview:", error);
		return { error: error.message };
	}

	revalidatePath("/interviews");
	return { success: true };
}

/**
 * Get organization members for interviewer selection
 */
export async function getOrgMembers() {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return [];

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return [];

	const { data: members, error } = await supabase
		.from("org_members")
		.select("user_id, role")
		.eq("organization_id", org.id)
		.order("created_at", { ascending: true });

	if (error) {
		console.error("Error fetching org members:", error);
		return [];
	}

	return members ?? [];
}
