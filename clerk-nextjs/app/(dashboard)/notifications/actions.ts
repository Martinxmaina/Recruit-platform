"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type Notification = {
	id: string;
	organization_id: string;
	user_id: string;
	type: string;
	title: string;
	message: string | null;
	link: string | null;
	metadata: unknown;
	read_at: string | null;
	created_at: string | null;
};

export async function getNotifications(limit = 20) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return [];

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return [];

	const { data } = await supabase
		.from("notifications")
		.select("*")
		.eq("organization_id", org.id)
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(limit);

	return data ?? [];
}

export async function getUnreadCount() {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return 0;

	const supabase = await createAdminClient(userId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return 0;

	const { count } = await supabase
		.from("notifications")
		.select("*", { count: "exact", head: true })
		.eq("organization_id", org.id)
		.eq("user_id", userId)
		.is("read_at", null);

	return count ?? 0;
}

export async function markAsRead(notificationId: string) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return { error: "Unauthorized" };

	const supabase = await createAdminClient(userId);

	const { error } = await supabase
		.from("notifications")
		.update({ read_at: new Date().toISOString() })
		.eq("id", notificationId)
		.eq("user_id", userId);

	if (error) return { error: error.message };

	revalidatePath("/dashboard");
	return { success: true };
}

export async function markAllAsRead() {
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
		.from("notifications")
		.update({ read_at: new Date().toISOString() })
		.eq("organization_id", org.id)
		.eq("user_id", userId)
		.is("read_at", null);

	if (error) return { error: error.message };

	revalidatePath("/dashboard");
	return { success: true };
}

export async function createNotification(data: {
	userId: string;
	type: string;
	title: string;
	message?: string;
	link?: string;
	metadata?: Record<string, unknown>;
}) {
	const { userId: currentUserId, orgId } = await auth();
	if (!currentUserId || !orgId) return { error: "Unauthorized" };

	const supabase = await createAdminClient(currentUserId);
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) return { error: "Organization not found" };

	const insertData: any = {
		organization_id: org.id,
		user_id: data.userId,
		type: data.type,
		title: data.title,
		message: data.message ?? null,
		link: data.link ?? null,
		metadata: data.metadata ?? {},
	};
	const { error } = await supabase.from("notifications").insert(insertData);

	if (error) return { error: error.message };
	return { success: true };
}
