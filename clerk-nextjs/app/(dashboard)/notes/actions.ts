"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { getCurrentUserOrg } from "@/lib/api/helpers";
import { revalidatePath } from "next/cache";

export type Note = {
	id: string;
	organization_id: string;
	entity_type: string;
	entity_id: string;
	author_id: string;
	author_name: string;
	content: string;
	created_at: string | null;
	updated_at: string | null;
};

export async function getNotes(entityType: string, entityId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data, error } = await supabase
		.from("notes")
		.select("*")
		.eq("organization_id", ctx.orgId)
		.eq("entity_type", entityType)
		.eq("entity_id", entityId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching notes:", error);
		return [];
	}

	return data ?? [];
}

export async function createNote(
	entityType: string,
	entityId: string,
	content: string
) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const user = await getCurrentUser();
	const authorName =
		(user?.user_metadata?.full_name as string) ?? (user?.email ?? "Unknown");

	const supabase = await createAdminClient(ctx.userId);
	const { data, error } = await supabase
		.from("notes")
		.insert({
			organization_id: ctx.orgId,
			entity_type: entityType,
			entity_id: entityId,
			author_id: ctx.userId,
			author_name: authorName,
			content,
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating note:", error);
		return { error: error.message };
	}

	revalidatePath(`/candidates/${entityId}`);
	revalidatePath(`/jobs/${entityId}`);
	revalidatePath(`/clients/${entityId}`);
	return { data };
}

export async function deleteNote(noteId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { error } = await supabase
		.from("notes")
		.delete()
		.eq("id", noteId)
		.eq("organization_id", ctx.orgId);

	if (error) {
		console.error("Error deleting note:", error);
		return { error: error.message };
	}

	return { success: true };
}
