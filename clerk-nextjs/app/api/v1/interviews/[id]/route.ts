import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import {
	getInterview,
	updateInterview,
	deleteInterview,
} from "@/app/(dashboard)/interviews/actions";
import { getOrgId, jsonResponse, errorResponse } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return errorResponse("Unauthorized", 401);
	const org = await getOrgId(userId, orgId);
	if (!org) return errorResponse("Organization not found", 404);

	const interview = await getInterview(id);
	if (!interview) return errorResponse("Interview not found", 404);
	return jsonResponse(interview);
}

export async function PATCH(request: NextRequest, { params }: Params) {
	const { id } = await params;
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return errorResponse("Unauthorized", 401);
	const org = await getOrgId(userId, orgId);
	if (!org) return errorResponse("Organization not found", 404);

	let body: Record<string, unknown>;
	try {
		body = (await request.json()) as Record<string, unknown>;
	} catch {
		return errorResponse("Invalid JSON body", 400);
	}

	const result = await updateInterview(id, {
		scheduled_at: body.scheduled_at as string | undefined,
		status: body.status as string | undefined,
		notes: body.notes as string | null | undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return errorResponse("Unauthorized", 401);
	const org = await getOrgId(userId, orgId);
	if (!org) return errorResponse("Organization not found", 404);

	const result = await deleteInterview(id);
	if (result?.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true });
}
