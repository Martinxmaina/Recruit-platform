import { NextRequest } from "next/server";
import { markAsRead } from "@/app/(dashboard)/notifications/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const result = await markAsRead(id);
	if (result?.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true });
}
