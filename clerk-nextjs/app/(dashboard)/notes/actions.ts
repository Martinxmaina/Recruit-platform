"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return [];

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return [];

	const { data, error } = await supabase
		.from("notes")
		.select("*")
		.eq("organization_id", org.id)
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
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return { error: "Unauthorized" };

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return { error: "Organization not found" };

	// Get user name from Clerk
	const { sessionClaims } = await auth();
	const authorName =
		[sessionClaims?.firstName, sessionClaims?.lastName]
			.filter(Boolean)
			.join(" ") || "Unknown";

	const { data, error } = await supabase
		.from("notes")
		.insert({
			organization_id: org.id,
			entity_type: entityType,
			entity_id: entityId,
			author_id: userId,
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
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return { error: "Unauthorized" };

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return { error: "Organization not found" };

	const { error } = await supabase
		.from("notes")
		.delete()
		.eq("id", noteId)
		.eq("organization_id", org.id);

	if (error) {
		console.error("Error deleting note:", error);
		return { error: error.message };
	}

	return { success: true };
}
