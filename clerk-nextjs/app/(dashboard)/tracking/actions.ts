"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getTrackedCandidates() {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) {
		return [];
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

	const { data, error } = await supabase
		.from("tracked_candidates")
		.select(
			`
			*,
			candidates!inner (
				id,
				full_name,
				email,
				current_title
			)
		`
		)
		.eq("organization_id", org.id)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching tracked candidates:", error);
		return [];
	}

	return data ?? [];
}

export async function isCandidateTracked(candidateId: string) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) {
		return false;
	}

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return false;
	}

	const { count } = await supabase
		.from("tracked_candidates")
		.select("id", { count: "exact", head: true })
		.eq("organization_id", org.id)
		.eq("candidate_id", candidateId);

	return (count ?? 0) > 0;
}

export async function addToTracking(candidateId: string) {
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

	const { data: candidate } = await supabase
		.from("candidates")
		.select("id, linkedin_url")
		.eq("id", candidateId)
		.eq("organization_id", org.id)
		.single();

	if (!candidate) {
		return { error: "Candidate not found" };
	}

	const { error } = await supabase.from("tracked_candidates").insert({
		organization_id: org.id,
		candidate_id: candidate.id,
		linkedin_url: candidate.linkedin_url,
		added_by_user_id: userId,
	});

	if (error) {
		if (error.code === "23505") {
			return { error: "Candidate is already in tracking." };
		}
		console.error("Error adding tracked candidate:", error);
		return { error: error.message };
	}

	revalidatePath("/tracking");
	revalidatePath(`/candidates/${candidateId}`);
	return { success: true };
}

export async function removeFromTracking(trackedId: string) {
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
		.from("tracked_candidates")
		.delete()
		.eq("id", trackedId)
		.eq("organization_id", org.id);

	if (error) {
		console.error("Error removing tracked candidate:", error);
		return { error: error.message };
	}

	revalidatePath("/tracking");
	return { success: true };
}

export async function updateTrackedCandidate(
	trackedId: string,
	data: { linkedin_url?: string | null; notes?: string | null }
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

	const { error } = await supabase
		.from("tracked_candidates")
		.update({
			linkedin_url: data.linkedin_url ?? null,
			notes: data.notes ?? null,
			updated_at: new Date().toISOString(),
		})
		.eq("id", trackedId)
		.eq("organization_id", org.id);

	if (error) {
		console.error("Error updating tracked candidate:", error);
		return { error: error.message };
	}

	revalidatePath("/tracking");
	return { success: true };
}
