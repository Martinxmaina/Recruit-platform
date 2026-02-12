"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Get jobs associated with the current client user's organization.
 * For client role: shows only jobs linked to the client record
 * associated with the user.
 */
export async function getPortalJobs() {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return [];

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return [];

	// Find which client record belongs to this user (if any)
	const { data: member } = await supabase
		.from("org_members")
		.select("user_id")
		.eq("organization_id", org.id)
		.eq("user_id", userId)
		.single();

	// Get all jobs for the org (clients can see all org jobs they're assigned to)
	const { data: jobs } = await supabase
		.from("jobs")
		.select("id, title, status, location, work_type, created_at, clients(name)")
		.eq("organization_id", org.id)
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
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return [];

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return [];

	// Get applications in "interview" or later stages
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
		.eq("organization_id", org.id)
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
