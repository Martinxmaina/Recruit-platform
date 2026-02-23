import { NextRequest } from "next/server";
import { getClient, updateClient } from "@/app/(dashboard)/clients/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const client = await getClient(id);
	if (!client) return errorResponse("Client not found", 404);
	return jsonResponse(client);
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

	const existing = await getClient(id);
	if (!existing) return errorResponse("Client not found", 404);

	const result = await updateClient(id, {
		name: (body.name as string) ?? existing.name,
		industry: (body.industry as string) ?? existing.industry ?? undefined,
		status: (body.status as "active" | "inactive" | "archived") ?? existing.status,
		contact_email: (body.contact_email as string) ?? existing.contact_email ?? undefined,
		contact_person: (body.contact_person as string) ?? existing.contact_person ?? undefined,
		contact_phone: (body.contact_phone as string) ?? existing.contact_phone ?? undefined,
		website: (body.website as string) ?? existing.website ?? undefined,
		address: (body.address as string) ?? existing.address ?? undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data);
}
