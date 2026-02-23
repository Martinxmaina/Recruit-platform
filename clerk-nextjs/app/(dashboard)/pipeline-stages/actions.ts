"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserOrg } from "@/lib/api/helpers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type PipelineStage = {
	id: string;
	name: string;
	sort_order: number;
	organization_id: string;
	created_at: string | null;
};

const DEFAULT_STAGES = [
	{ name: "New", sort_order: 1 },
	{ name: "Screening", sort_order: 2 },
	{ name: "Interview 1", sort_order: 3 },
	{ name: "Interview 2", sort_order: 4 },
	{ name: "Offer", sort_order: 5 },
	{ name: "Hired", sort_order: 6 },
	{ name: "Rejected", sort_order: 7 },
];

export async function getPipelineStages() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) redirect("/dashboard");

	const supabase = await createAdminClient(ctx.userId);
	const { data: stages, error } = await supabase
		.from("pipeline_stages")
		.select("*")
		.eq("organization_id", ctx.orgId)
		.order("sort_order", { ascending: true });

	if (error) {
		console.error("Error fetching pipeline stages:", error);
		return [];
	}

	if (!stages || stages.length === 0) {
		return await ensureDefaultStages(ctx.userId, ctx.orgId);
	}

	return stages ?? [];
}

async function ensureDefaultStages(userId: string, orgId: string) {
	const supabase = await createAdminClient(userId);

	// Check if stages already exist
	const { data: existing } = await supabase
		.from("pipeline_stages")
		.select("id")
		.eq("organization_id", orgId)
		.limit(1);

	if (existing && existing.length > 0) {
		// Stages already exist, fetch and return them
		const { data: stages } = await supabase
			.from("pipeline_stages")
			.select("*")
			.eq("organization_id", orgId)
			.order("sort_order", { ascending: true });
		return stages ?? [];
	}

	// Create default stages
	const stagesToInsert = DEFAULT_STAGES.map((stage) => ({
		organization_id: orgId,
		name: stage.name,
		sort_order: stage.sort_order,
	}));

	const { data: newStages, error } = await supabase
		.from("pipeline_stages")
		.insert(stagesToInsert)
		.select();

	if (error) {
		console.error("Error creating default stages:", error);
		console.error("Error details:", {
			code: error.code,
			message: error.message,
			details: error.details,
			hint: error.hint,
			orgId,
		});
		return [];
	}

	console.log(
		`Created ${newStages?.length || 0} default pipeline stages for organization ${orgId}`
	);
	return newStages ?? [];
}

export async function createPipelineStage(name: string, sort_order?: number) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	if (sort_order === undefined) {
		const { data: lastStage } = await supabase
			.from("pipeline_stages")
			.select("sort_order")
			.eq("organization_id", ctx.orgId)
			.order("sort_order", { ascending: false })
			.limit(1)
			.single();

		sort_order = lastStage ? lastStage.sort_order + 1 : 1;
	}

	const { data: stage, error } = await supabase
		.from("pipeline_stages")
		.insert({
			organization_id: ctx.orgId,
			name: name.trim(),
			sort_order,
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating pipeline stage:", error);
		return { error: error.message };
	}

	revalidatePath("/settings/pipeline");
	return { data: stage };
}

export async function updatePipelineStage(
	id: string,
	data: { name?: string; sort_order?: number }
) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const updateData: Record<string, unknown> = {};

	if (data.name !== undefined) updateData.name = data.name.trim();
	if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;

	const { data: stage, error } = await supabase
		.from("pipeline_stages")
		.update(updateData)
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.select()
		.single();

	if (error) {
		console.error("Error updating pipeline stage:", error);
		return { error: error.message };
	}

	revalidatePath("/settings/pipeline");
	return { data: stage };
}

export async function deletePipelineStage(id: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { data: stage } = await supabase
		.from("pipeline_stages")
		.select("name")
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.single();

	if (!stage) {
		return { error: "Stage not found" };
	}

	const { data: newStage } = await supabase
		.from("pipeline_stages")
		.select("id")
		.eq("organization_id", ctx.orgId)
		.eq("name", "New")
		.single();

	if (newStage) {
		await supabase
			.from("applications")
			.update({ stage: "New" })
			.eq("organization_id", ctx.orgId)
			.eq("stage", stage.name);
	}

	const { error } = await supabase
		.from("pipeline_stages")
		.delete()
		.eq("id", id)
		.eq("organization_id", ctx.orgId);

	if (error) {
		console.error("Error deleting pipeline stage:", error);
		return { error: error.message };
	}

	revalidatePath("/settings/pipeline");
	revalidatePath("/jobs");
	return { success: true };
}

export async function reorderPipelineStages(
	stages: Array<{ id: string; sort_order: number }>
) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const updates = stages.map((stage) =>
		supabase
			.from("pipeline_stages")
			.update({ sort_order: stage.sort_order })
			.eq("id", stage.id)
			.eq("organization_id", ctx.orgId)
	);

	const results = await Promise.all(updates);
	const errors = results.filter((r) => r.error);

	if (errors.length > 0) {
		console.error("Error reordering pipeline stages:", errors);
		return { error: "Failed to reorder some stages" };
	}

	revalidatePath("/settings/pipeline");
	revalidatePath("/jobs");
	return { success: true };
}
