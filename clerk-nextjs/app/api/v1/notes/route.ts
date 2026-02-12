import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { getNotes, createNote } from "@/app/(dashboard)/notes/actions";
import { getOrgId, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET(request: NextRequest) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return errorResponse("Unauthorized", 401);
	const org = await getOrgId(userId, orgId);
	if (!org) return errorResponse("Organization not found", 404);

	const { searchParams } = request.nextUrl;
	const entityType = searchParams.get("entity_type");
	const entityId = searchParams.get("entity_id");
	if (!entityType || !entityId)
		return errorResponse("entity_type and entity_id are required", 400);

	const notes = await getNotes(entityType, entityId);
	return jsonResponse(notes);
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
	const entityType = data?.entity_type as string | undefined;
	const entityId = data?.entity_id as string | undefined;
	const content = data?.content as string | undefined;
	if (!entityType || !entityId || typeof content !== "string")
		return errorResponse("entity_type, entity_id and content are required", 400);

	const result = await createNote(entityType, entityId, content);
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data, 201);
}
