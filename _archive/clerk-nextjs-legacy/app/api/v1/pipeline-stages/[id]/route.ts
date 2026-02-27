import { NextRequest } from "next/server";
import {
	updatePipelineStage,
	deletePipelineStage,
} from "@/app/(dashboard)/pipeline-stages/actions";
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

	const result = await updatePipelineStage(id, {
		name: body.name as string | undefined,
		sort_order: body.sort_order as number | undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const result = await deletePipelineStage(id);
	if (result?.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true });
}
