import { NextRequest } from "next/server";
import {
	getApplication,
	updateApplication,
	deleteApplication,
} from "@/app/(dashboard)/applications/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const application = await getApplication(id);
	if (!application) return errorResponse("Application not found", 404);
	return jsonResponse(application);
}

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

	const result = await updateApplication(id, {
		stage: body.stage as string | undefined,
		status: body.status as string | undefined,
		screening_score: body.screening_score as number | null | undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const result = await deleteApplication(id);
	if (result?.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true });
}
