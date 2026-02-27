"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserOrg } from "@/lib/api/helpers";
import { revalidatePath } from "next/cache";

export async function getTrackedCandidates() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
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
		.eq("organization_id", ctx.orgId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching tracked candidates:", error);
		return [];
	}

	return data ?? [];
}

export async function isCandidateTracked(candidateId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return false;

	const supabase = await createAdminClient(ctx.userId);
	const { count } = await supabase
		.from("tracked_candidates")
		.select("id", { count: "exact", head: true })
		.eq("organization_id", ctx.orgId)
		.eq("candidate_id", candidateId);

	return (count ?? 0) > 0;
}

export async function addToTracking(candidateId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { data: candidate } = await supabase
		.from("candidates")
		.select("id, linkedin_url")
		.eq("id", candidateId)
		.eq("organization_id", ctx.orgId)
		.single();

	if (!candidate) {
		return { error: "Candidate not found" };
	}

	const { error } = await supabase.from("tracked_candidates").insert({
		organization_id: ctx.orgId,
		candidate_id: candidate.id,
		linkedin_url: candidate.linkedin_url,
		added_by_user_id: ctx.userId,
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
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { error } = await supabase
		.from("tracked_candidates")
		.delete()
		.eq("id", trackedId)
		.eq("organization_id", ctx.orgId);

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
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { error } = await supabase
		.from("tracked_candidates")
		.update({
			linkedin_url: data.linkedin_url ?? null,
			notes: data.notes ?? null,
			updated_at: new Date().toISOString(),
		})
		.eq("id", trackedId)
		.eq("organization_id", ctx.orgId);

	if (error) {
		console.error("Error updating tracked candidate:", error);
		return { error: error.message };
	}

	revalidatePath("/tracking");
	return { success: true };
}
