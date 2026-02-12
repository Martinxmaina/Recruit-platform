import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import {
	getPipelineStages,
	createPipelineStage,
} from "@/app/(dashboard)/pipeline-stages/actions";
import { getOrgId, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET() {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return errorResponse("Unauthorized", 401);
	const org = await getOrgId(userId, orgId);
	if (!org) return errorResponse("Organization not found", 404);

	const stages = await getPipelineStages();
	return jsonResponse(stages);
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
	const name = data?.name as string | undefined;
	if (!name || typeof name !== "string")
		return errorResponse("name is required", 400);

	const result = await createPipelineStage(
		name,
		data.sort_order as number | undefined
	);
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data, 201);
}
