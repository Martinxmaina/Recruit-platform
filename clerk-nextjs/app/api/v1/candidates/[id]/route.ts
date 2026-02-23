import { NextRequest } from "next/server";
import {
	getCandidate,
	updateCandidate,
	deleteCandidate,
} from "@/app/(dashboard)/candidates/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const candidate = await getCandidate(id);
	if (!candidate) return errorResponse("Candidate not found", 404);
	return jsonResponse(candidate);
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

	const result = await updateCandidate(id, {
		full_name: body.full_name as string | undefined,
		email: body.email as string | null | undefined,
		phone: body.phone as string | null | undefined,
		linkedin_url: body.linkedin_url as string | null | undefined,
		current_company: body.current_company as string | null | undefined,
		current_title: body.current_title as string | null | undefined,
		location: body.location as string | null | undefined,
		resume_url: body.resume_url as string | null | undefined,
		source: body.source as string | null | undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const result = await deleteCandidate(id);
	if (result?.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true });
}
