import { NextRequest } from "next/server";
import {
	updateTrackedCandidate,
	removeFromTracking,
} from "@/app/(dashboard)/tracking/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	let body: Record<string, unknown>;
	try {
		body = (await request.json()) as Record<string, unknown>;
	} catch {
		return errorResponse("Invalid JSON body", 400);
	}

	const result = await updateTrackedCandidate(id, {
		linkedin_url: body.linkedin_url as string | null | undefined,
		notes: body.notes as string | null | undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const result = await removeFromTracking(id);
	if (result?.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true });
}
