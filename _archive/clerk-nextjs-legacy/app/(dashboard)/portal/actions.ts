"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserOrg } from "@/lib/api/helpers";

/**
 * Get jobs associated with the current client user's organization.
 */
export async function getPortalJobs() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data: jobs } = await supabase
		.from("jobs")
		.select("id, title, status, location, work_type, created_at, clients(name)")
		.eq("organization_id", ctx.orgId)
		.order("created_at", { ascending: false });

	return (jobs ?? []).map((j: any) => ({
		id: j.id,
		title: j.title,
		status: j.status,
		location: j.location,
		work_type: j.work_type,
		client_name: j.clients?.name ?? "",
		created_at: j.created_at,
	}));
}

/**
 * Get shortlisted candidates (applications in advanced stages)
 * for the client portal.
 */
export async function getPortalShortlist() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data } = await supabase
		.from("applications")
		.select(`
			id,
			stage,
			status,
			screening_score,
			candidates!inner(full_name, email, current_title),
			jobs!inner(title)
		`)
		.eq("organization_id", ctx.orgId)
		.not("stage", "eq", "applied")
		.order("updated_at", { ascending: false })
		.limit(50);

	return (data ?? []).map((a: any) => ({
		id: a.id,
		stage: a.stage,
		status: a.status,
		screening_score: a.screening_score,
		candidate_name: a.candidates?.full_name ?? "Unknown",
		candidate_email: a.candidates?.email ?? "",
		candidate_title: a.candidates?.current_title ?? "",
		job_title: a.jobs?.title ?? "Unknown",
	}));
}
