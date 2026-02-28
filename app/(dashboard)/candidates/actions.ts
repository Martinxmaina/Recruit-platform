"use server";

import { getCurrentUserOrg } from "@/lib/api/helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type Candidate = {
	id: string;
	full_name: string;
	email: string | null;
	phone: string | null;
	linkedin_url: string | null;
	current_company: string | null;
	current_title: string | null;
	location: string | null;
	resume_url: string | null;
	source: string | null;
	organization_id: string;
	created_at: string | null;
	updated_at: string | null;
};

export type GetCandidatesFilters = {
	search?: string;
	source?: string;
	location?: string;
	job_id?: string;
	date_range?: "7" | "30" | "90";
	sort?: "new" | "old" | "name_asc" | "name_desc";
};

export async function getCandidates(filters?: GetCandidatesFilters) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) redirect("/sign-in");

	const supabase = await createAdminClient(ctx.userId);

	// If filtering by job_id, get candidate ids that have an application for that job
	let candidateIdsForJob: string[] | null = null;
	if (filters?.job_id) {
		const { data: appRows } = await supabase
			.from("applications")
			.select("candidate_id")
			.eq("job_id", filters.job_id)
			.eq("organization_id", ctx.orgId);
		if (!appRows?.length) return [];
		candidateIdsForJob = [...new Set(appRows.map((r) => r.candidate_id))];
	}

	let query = supabase
		.from("candidates")
		.select(
			`
			*,
			applications!left(
				id,
				job_id,
				stage,
				status,
				screening_score,
				applied_at,
				jobs!inner(
					id,
					title
				)
			)
		`
		)
		.eq("organization_id", ctx.orgId);

	if (filters?.search) {
		query = query.or(
			`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
		);
	}
	if (filters?.source) {
		query = query.eq("source", filters.source);
	}
	if (filters?.location?.trim()) {
		query = query.ilike("location", `%${filters.location.trim()}%`);
	}
	if (candidateIdsForJob) {
		query = query.in("id", candidateIdsForJob);
	}
	if (filters?.date_range) {
		const d = new Date();
		if (filters.date_range === "7") d.setDate(d.getDate() - 7);
		else if (filters.date_range === "30") d.setDate(d.getDate() - 30);
		else if (filters.date_range === "90") d.setDate(d.getDate() - 90);
		query = query.gte("created_at", d.toISOString());
	}

	const sort = filters?.sort ?? "new";
	if (sort === "old") {
		query = query.order("created_at", { ascending: true });
	} else if (sort === "name_asc") {
		query = query.order("full_name", { ascending: true });
	} else if (sort === "name_desc") {
		query = query.order("full_name", { ascending: false });
	} else {
		query = query.order("created_at", { ascending: false });
	}

	const { data: candidates, error } = await query;

	if (error) {
		console.error("Error fetching candidates:", error);
		return [];
	}

	return candidates ?? [];
}

export async function getCandidate(id: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) redirect("/sign-in");

	const supabase = await createAdminClient(ctx.userId);
	const { data: candidate, error } = await supabase
		.from("candidates")
		.select("*")
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.single();

	if (error) {
		console.error("Error fetching candidate:", error);
		return null;
	}

	return candidate;
}

export async function createCandidate(data: {
	full_name: string;
	email?: string | null;
	phone?: string | null;
	linkedin_url?: string | null;
	current_company?: string | null;
	current_title?: string | null;
	location?: string | null;
	resume_url?: string | null;
	source?: string | null;
}) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	try {
		const supabase = await createAdminClient(ctx.userId);
		const { data: candidate, error } = await supabase
			.from("candidates")
			.insert({
				organization_id: ctx.orgId,
				full_name: data.full_name,
				email: data.email || null,
				phone: data.phone || null,
				linkedin_url: data.linkedin_url || null,
				current_company: data.current_company || null,
				current_title: data.current_title || null,
				location: data.location || null,
				resume_url: data.resume_url || null,
				source: data.source || null,
			})
			.select()
			.single();

		if (error) {
			console.error("Error creating candidate:", error);
			return { error: error.message };
		}

		revalidatePath("/candidates");
		return { data: candidate };
	} catch (err) {
		console.error("Error creating candidate:", err);
		return {
			error: err instanceof Error ? err.message : "Failed to create candidate",
		};
	}
}

export async function updateCandidate(
	id: string,
	data: {
		full_name?: string;
		email?: string | null;
		phone?: string | null;
		linkedin_url?: string | null;
		current_company?: string | null;
		current_title?: string | null;
		location?: string | null;
		resume_url?: string | null;
		source?: string | null;
	}
) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	try {
		const supabase = await createAdminClient(ctx.userId);
		const updateData: Record<string, unknown> = {
			updated_at: new Date().toISOString(),
		};

		if (data.full_name !== undefined) updateData.full_name = data.full_name;
		if (data.email !== undefined) updateData.email = data.email;
		if (data.phone !== undefined) updateData.phone = data.phone;
		if (data.linkedin_url !== undefined) updateData.linkedin_url = data.linkedin_url;
		if (data.current_company !== undefined) updateData.current_company = data.current_company;
		if (data.current_title !== undefined) updateData.current_title = data.current_title;
		if (data.location !== undefined) updateData.location = data.location;
		if (data.resume_url !== undefined) updateData.resume_url = data.resume_url;
		if (data.source !== undefined) updateData.source = data.source;

		const { data: candidate, error } = await supabase
			.from("candidates")
			.update(updateData)
			.eq("id", id)
			.eq("organization_id", ctx.orgId)
			.select()
			.single();

		if (error) {
			console.error("Error updating candidate:", error);
			return { error: error.message };
		}

		revalidatePath("/candidates");
		revalidatePath(`/candidates/${id}`);
		return { data: candidate };
	} catch (err) {
		console.error("Error updating candidate:", err);
		return {
			error: err instanceof Error ? err.message : "Failed to update candidate",
		};
	}
}

export async function deleteCandidate(id: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	try {
		const supabase = await createAdminClient(ctx.userId);
		const { error } = await supabase
			.from("candidates")
			.delete()
			.eq("id", id)
			.eq("organization_id", ctx.orgId);

		if (error) {
			console.error("Error deleting candidate:", error);
			return { error: error.message };
		}

		revalidatePath("/candidates");
		return { success: true };
	} catch (err) {
		console.error("Error deleting candidate:", err);
		return {
			error: err instanceof Error ? err.message : "Failed to delete candidate",
		};
	}
}

export async function getCandidateApplications(candidateId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data: applications, error } = await supabase
		.from("applications")
		.select(
			`
			*,
			jobs!inner(
				id,
				title,
				location,
				work_type,
				status,
				clients(name)
			)
		`
		)
		.eq("candidate_id", candidateId)
		.eq("organization_id", ctx.orgId)
		.order("applied_at", { ascending: false });

	if (error) {
		console.error("Error fetching candidate applications:", error);
		return [];
	}

	return applications ?? [];
}
