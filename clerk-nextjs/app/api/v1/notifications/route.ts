import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import {
	getNotifications,
	createNotification,
} from "@/app/(dashboard)/notifications/actions";
import { getOrgId, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET(request: NextRequest) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return errorResponse("Unauthorized", 401);
	const org = await getOrgId(userId, orgId);
	if (!org) return errorResponse("Organization not found", 404);

	const limit = Number(request.nextUrl.searchParams.get("limit")) || 20;
	const list = await getNotifications(limit);
	return jsonResponse(list);
}

export async function POST(request: NextRequest) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return errorResponse("Unauthorized", 401);
	const org = await getOrgId(userId, orgId);
	if (!org) return errorResponse("Organization not found", 404);

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return errorResponse("Invalid JSON body", 400);
	}
	const data = body as Record<string, unknown>;
	const targetUserId = data?.user_id as string | undefined;
	const type = data?.type as string | undefined;
	const title = data?.title as string | undefined;
	if (!targetUserId || !type || !title)
		return errorResponse("user_id, type and title are required", 400);

	const result = await createNotification({
		userId: targetUserId,
		type,
		title,
		message: (data.message as string) ?? undefined,
		link: (data.link as string) ?? undefined,
		metadata: (data.metadata as Record<string, unknown>) ?? undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true }, 201);
}
