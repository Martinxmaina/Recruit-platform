import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { deleteNote } from "@/app/(dashboard)/notes/actions";
import { getOrgId, jsonResponse, errorResponse } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const { userId, orgId } = await auth();
	if (!userId || !orgId) return errorResponse("Unauthorized", 401);
	const org = await getOrgId(userId, orgId);
	if (!org) return errorResponse("Organization not found", 404);

	const result = await deleteNote(id);
	if (result?.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true });
}
