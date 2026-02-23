import { NextRequest } from "next/server";
import {
	getTrackedCandidates,
	addToTracking,
} from "@/app/(dashboard)/tracking/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const list = await getTrackedCandidates();
	return jsonResponse(list);
}

export async function POST(request: NextRequest) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

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
