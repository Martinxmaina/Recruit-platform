"use server";

import { getCurrentUserOrg } from "@/lib/api/helpers";
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
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data } = await supabase
		.from("notifications")
		.select("*")
		.eq("organization_id", ctx.orgId)
		.eq("user_id", ctx.userId)
		.order("created_at", { ascending: false })
		.limit(limit);

	return data ?? [];
}

export async function getUnreadCount() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return 0;

	const supabase = await createAdminClient(ctx.userId);
	const { count } = await supabase
		.from("notifications")
		.select("*", { count: "exact", head: true })
		.eq("organization_id", ctx.orgId)
		.eq("user_id", ctx.userId)
		.is("read_at", null);

	return count ?? 0;
}

export async function markAsRead(notificationId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { error } = await supabase
		.from("notifications")
		.update({ read_at: new Date().toISOString() })
		.eq("id", notificationId)
		.eq("user_id", ctx.userId);

	if (error) return { error: error.message };

	revalidatePath("/dashboard");
	return { success: true };
}

export async function markAllAsRead() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { error } = await supabase
		.from("notifications")
		.update({ read_at: new Date().toISOString() })
		.eq("organization_id", ctx.orgId)
		.eq("user_id", ctx.userId)
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
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const insertData: Record<string, unknown> = {
		organization_id: ctx.orgId,
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
