"use server";

import { getCurrentUserOrg } from "@/lib/api/helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type Job = {
	id: string;
	title: string;
	description: string | null;
	ai_requirements_summary: string | null;
	ai_working_hours: number | null;
	ai_job_language: string | null;
	ai_visa_sponsorship: boolean | null;
	ai_keywords: string[] | null;
	ai_taxonomies_a: string[] | null;
	ai_education_requirements: string | null;
	client_id: string | null;
	organization_id: string;
	location: string | null;
	country: string | null;
	work_type: string | null;
	status: string;
	posted_at: string | null;
	created_at: string | null;
	updated_at: string | null;
	// n8n / source
	external_id?: number | null;
	source?: string | null;
	source_type?: string | null;
	source_domain?: string | null;
	url?: string | null;
	external_apply_url?: string | null;
	linkedin_id?: number | null;
	date_posted?: string | null;
	date_validthrough?: string | null;
	// location
	locations_derived?: string[] | null;
	cities_derived?: string[] | null;
	regions_derived?: string[] | null;
	countries_derived?: string[] | null;
	remote_derived?: boolean | null;
	lats_derived?: number[] | null;
	lngs_derived?: number[] | null;
	// employment
	employment_type?: string[] | null;
	seniority?: string | null;
	// salary
	ai_salary_currency?: string | null;
	ai_salary_value?: number | null;
	ai_salary_minvalue?: number | null;
	ai_salary_maxvalue?: number | null;
	ai_salary_unittext?: string | null;
	// AI enrichment
	ai_key_skills?: string[] | null;
	ai_core_responsibilities?: string | null;
	ai_experience_level?: string | null;
	ai_work_arrangement?: string | null;
	ai_work_arrangement_office_days?: number | null;
	ai_remote_location?: string | null;
	ai_remote_location_derived?: string | null;
	ai_benefits?: unknown;
	ai_hiring_manager_name?: string | null;
	ai_hiring_manager_email_address?: string | null;
	description_text?: string | null;
	// organization
	organization_name?: string | null;
	organization_url?: string | null;
	organization_logo?: string | null;
	linkedin_org_employees?: number | null;
	linkedin_org_url?: string | null;
	linkedin_org_size?: string | null;
	linkedin_org_slogan?: string | null;
	linkedin_org_industry?: string | null;
	linkedin_org_description?: string | null;
	linkedin_org_headquarters?: string | null;
	linkedin_org_type?: string | null;
	linkedin_org_foundeddate?: string | null;
	linkedin_org_specialties?: string[] | null;
	linkedin_org_locations?: string[] | null;
	// recruiter
	recruiter_name?: string | null;
	recruiter_title?: string | null;
	recruiter_url?: string | null;
};

type JobWithClient = Job & { clients?: { name: string } | null };

function parseStringArray(value: unknown): string[] | null {
	if (!Array.isArray(value)) {
		return null;
	}
	return value.filter((item): item is string => typeof item === "string");
}

function parseNumberArray(value: unknown): number[] | null {
	if (!Array.isArray(value)) {
		return null;
	}
	return value.filter((item): item is number => typeof item === "number");
}

function normalizeJob(job: Record<string, unknown>): JobWithClient {
	return {
		...(job as JobWithClient),
		ai_keywords: parseStringArray(job.ai_keywords),
		ai_taxonomies_a: parseStringArray(job.ai_taxonomies_a),
		ai_key_skills: parseStringArray(job.ai_key_skills),
		employment_type: parseStringArray(job.employment_type),
		locations_derived: parseStringArray(job.locations_derived),
		cities_derived: parseStringArray(job.cities_derived),
		regions_derived: parseStringArray(job.regions_derived),
		countries_derived: parseStringArray(job.countries_derived),
		lats_derived: parseNumberArray(job.lats_derived),
		lngs_derived: parseNumberArray(job.lngs_derived),
		linkedin_org_specialties: parseStringArray(job.linkedin_org_specialties),
		linkedin_org_locations: parseStringArray(job.linkedin_org_locations),
	};
}

export async function getJobs(filters?: {
	status?: string;
	work_type?: string;
	country?: string;
	client_id?: string;
	search?: string;
}) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) redirect("/dashboard");

	const supabase = await createAdminClient(ctx.userId);
	let query = supabase
		.from("jobs")
		.select("*, clients(name)")
		.eq("organization_id", ctx.orgId);

	if (filters?.status) {
		query = query.eq("status", filters.status);
	}

	if (filters?.work_type) {
		query = query.eq("work_type", filters.work_type);
	}

	if (filters?.country) {
		query = query.eq("country", filters.country);
	}

	if (filters?.client_id) {
		query = query.eq("client_id", filters.client_id);
	}

	if (filters?.search) {
		query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
	}

	const { data: jobs, error } = await query.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching jobs:", error);
		return [];
	}

	return (jobs ?? []).map((job) => normalizeJob(job as Record<string, unknown>));
}

export async function getJob(id: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) redirect("/dashboard");

	const supabase = await createAdminClient(ctx.userId);
	const { data: job, error } = await supabase
		.from("jobs")
		.select("*, clients(name)")
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.single();

	if (error) {
		console.error("Error fetching job:", error);
		return null;
	}

	return normalizeJob(job as Record<string, unknown>);
}

export async function createJob(data: {
	title: string;
	description?: string | null;
	ai_requirements_summary?: string | null;
	ai_working_hours?: number | null;
	ai_job_language?: string | null;
	ai_visa_sponsorship?: boolean | null;
	ai_keywords?: string[] | null;
	ai_taxonomies_a?: string[] | null;
	ai_education_requirements?: string | null;
	client_id?: string | null;
	location?: string | null;
	country?: string | null;
	work_type?: string | null;
	status?: string;
}) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { data: job, error } = await supabase
		.from("jobs")
		.insert({
			organization_id: ctx.orgId,
			title: data.title,
			description: data.description || null,
			ai_requirements_summary: data.ai_requirements_summary ?? null,
			ai_working_hours: data.ai_working_hours ?? null,
			ai_job_language: data.ai_job_language ?? null,
			ai_visa_sponsorship: data.ai_visa_sponsorship ?? null,
			ai_keywords: data.ai_keywords ?? [],
			ai_taxonomies_a: data.ai_taxonomies_a ?? [],
			ai_education_requirements: data.ai_education_requirements ?? null,
			client_id: data.client_id || null,
			location: data.location || null,
			country: data.country || null,
			work_type: data.work_type || null,
			status: data.status || "open",
			posted_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating job:", error);
		return { error: error.message };
	}

	revalidatePath("/jobs");
	return { data: job };
}

export async function updateJob(
	id: string,
	data: {
		title?: string;
		description?: string | null;
		ai_requirements_summary?: string | null;
		ai_working_hours?: number | null;
		ai_job_language?: string | null;
		ai_visa_sponsorship?: boolean | null;
		ai_keywords?: string[] | null;
		ai_taxonomies_a?: string[] | null;
		ai_education_requirements?: string | null;
		client_id?: string | null;
		location?: string | null;
		country?: string | null;
		work_type?: string | null;
		status?: string;
	}
) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const updateData: Record<string, unknown> = {
		updated_at: new Date().toISOString(),
	};

	if (data.title !== undefined) updateData.title = data.title;
	if (data.description !== undefined) updateData.description = data.description;
	if (data.ai_requirements_summary !== undefined) {
		updateData.ai_requirements_summary = data.ai_requirements_summary;
	}
	if (data.ai_working_hours !== undefined) {
		updateData.ai_working_hours = data.ai_working_hours;
	}
	if (data.ai_job_language !== undefined) {
		updateData.ai_job_language = data.ai_job_language;
	}
	if (data.ai_visa_sponsorship !== undefined) {
		updateData.ai_visa_sponsorship = data.ai_visa_sponsorship;
	}
	if (data.ai_keywords !== undefined) {
		updateData.ai_keywords = data.ai_keywords ?? [];
	}
	if (data.ai_taxonomies_a !== undefined) {
		updateData.ai_taxonomies_a = data.ai_taxonomies_a ?? [];
	}
	if (data.ai_education_requirements !== undefined) {
		updateData.ai_education_requirements = data.ai_education_requirements;
	}
	if (data.client_id !== undefined) updateData.client_id = data.client_id;
	if (data.location !== undefined) updateData.location = data.location;
	if (data.country !== undefined) updateData.country = data.country;
	if (data.work_type !== undefined) updateData.work_type = data.work_type;
	if (data.status !== undefined) updateData.status = data.status;

	const { data: job, error } = await supabase
		.from("jobs")
		.update(updateData)
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.select()
		.single();

	if (error) {
		console.error("Error updating job:", error);
		return { error: error.message };
	}

	revalidatePath("/jobs");
	revalidatePath(`/jobs/${id}`);
	return { data: job };
}

export async function deleteJob(id: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { error } = await supabase
		.from("jobs")
		.delete()
		.eq("id", id)
		.eq("organization_id", ctx.orgId);

	if (error) {
		console.error("Error deleting job:", error);
		return { error: error.message };
	}

	revalidatePath("/jobs");
	return { success: true };
}
