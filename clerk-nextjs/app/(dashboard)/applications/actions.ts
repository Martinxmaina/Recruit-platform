"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentUserOrg } from "@/lib/api/helpers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type Application = {
	id: string;
	candidate_id: string;
	job_id: string;
	stage: string;
	status: string;
	screening_score: number | null;
	applied_at: string | null;
	organization_id: string;
	created_at: string | null;
	updated_at: string | null;
};

export async function getApplications(filters?: {
	job_id?: string;
	candidate_id?: string;
	stage?: string;
	status?: string;
}) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) redirect("/dashboard");

	const supabase = await createAdminClient(ctx.userId);
	let query = supabase
		.from("applications")
		.select(
			`
			*,
			candidates!inner(
				id,
				full_name,
				email,
				current_title,
				current_company
			),
			jobs!inner(
				id,
				title,
				location,
				work_type,
				clients(name)
			)
		`
		)
		.eq("organization_id", ctx.orgId);

	if (filters?.job_id) {
		query = query.eq("job_id", filters.job_id);
	}

	if (filters?.candidate_id) {
		query = query.eq("candidate_id", filters.candidate_id);
	}

	if (filters?.stage) {
		query = query.eq("stage", filters.stage);
	}

	if (filters?.status) {
		query = query.eq("status", filters.status);
	}

	const { data: applications, error } = await query.order("applied_at", {
		ascending: false,
	});

	if (error) {
		console.error("Error fetching applications:", error);
		return [];
	}

	return applications ?? [];
}

export async function getJobApplications(jobId: string) {
	return getApplications({ job_id: jobId });
}

export async function getCandidateApplications(candidateId: string) {
	return getApplications({ candidate_id: candidateId });
}

export async function getApplication(id: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return null;
	const supabase = await createAdminClient(ctx.userId);
	const { data: application, error } = await supabase
		.from("applications")
		.select(
			`*,
			candidates!inner(id, full_name, email, current_title, current_company),
			jobs!inner(id, title, location, work_type, clients(name))
		`
		)
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.single();
	if (error) return null;
	return application;
}

export async function createApplication(
	candidateId: string,
	jobId: string,
	data?: {
		stage?: string;
		status?: string;
		applied_at?: string;
	}
) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { data: existing } = await supabase
		.from("applications")
		.select("id")
		.eq("candidate_id", candidateId)
		.eq("job_id", jobId)
		.eq("organization_id", ctx.orgId)
		.single();

	if (existing) {
		return { error: "Application already exists" };
	}

	const { data: application, error } = await supabase
		.from("applications")
		.insert({
			organization_id: ctx.orgId,
			candidate_id: candidateId,
			job_id: jobId,
			stage: data?.stage || "New",
			status: data?.status || "active",
			applied_at: data?.applied_at || new Date().toISOString(),
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating application:", error);
		return { error: error.message };
	}

	revalidatePath("/candidates");
	revalidatePath("/jobs");
	revalidatePath(`/candidates/${candidateId}`);
	revalidatePath(`/jobs/${jobId}`);
	return { data: application };
}

export async function updateApplication(
	id: string,
	data: {
		stage?: string;
		status?: string;
		screening_score?: number | null;
		stage_change_note?: string;
	}
) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { data: currentApp } = await supabase
		.from("applications")
		.select("stage, candidate_id")
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.single();

	const updateData: Record<string, unknown> = {
		updated_at: new Date().toISOString(),
	};

	if (data.stage !== undefined) updateData.stage = data.stage;
	if (data.status !== undefined) updateData.status = data.status;
	if (data.screening_score !== undefined) updateData.screening_score = data.screening_score;

	const { data: application, error } = await supabase
		.from("applications")
		.update(updateData)
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.select()
		.single();

	if (error) {
		console.error("Error updating application:", error);
		return { error: error.message };
	}

	if (
		data.stage !== undefined &&
		currentApp &&
		data.stage !== currentApp.stage &&
		data.stage_change_note
	) {
		const user = await getCurrentUser();
		const authorName =
			(user?.user_metadata?.full_name as string) ??
			(user?.email ?? "Unknown");

		const { error: noteError } = await supabase.from("notes").insert({
			organization_id: ctx.orgId,
			entity_type: "application",
			entity_id: id,
			content: `Stage changed from "${currentApp.stage}" to "${data.stage}": ${data.stage_change_note}`,
			author_id: ctx.userId,
			author_name: authorName,
		});

		if (noteError) {
			console.error("Error creating stage change note:", noteError);
		}
	}

	revalidatePath("/candidates");
	revalidatePath("/jobs");
	return { data: application };
}

export async function deleteApplication(id: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { error } = await supabase
		.from("applications")
		.delete()
		.eq("id", id)
		.eq("organization_id", ctx.orgId);

	if (error) {
		console.error("Error deleting application:", error);
		return { error: error.message };
	}

	revalidatePath("/candidates");
	revalidatePath("/jobs");
	return { success: true };
}
