import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import {
	getTrackedCandidates,
	addToTracking,
} from "@/app/(dashboard)/tracking/actions";
import { getOrgId, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET() {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return errorResponse("Unauthorized", 401);
	const org = await getOrgId(userId, orgId);
	if (!org) return errorResponse("Organization not found", 404);

	const list = await getTrackedCandidates();
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
	const candidateId = data?.candidate_id as string | undefined;
	if (!candidateId) return errorResponse("candidate_id is required", 400);

	const result = await addToTracking(candidateId);
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true }, 201);
}
