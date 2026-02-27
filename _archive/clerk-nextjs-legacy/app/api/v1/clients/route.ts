import { NextRequest } from "next/server";
import { getClients, createClient } from "@/app/(dashboard)/clients/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const clients = await getClients();
	return jsonResponse(clients);
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
	if (!data || typeof data.name !== "string")
		return errorResponse("name is required", 400);

	const result = await createClient({
		name: data.name as string,
		industry: (data.industry as string) ?? undefined,
		status: (data.status as "active" | "inactive" | "archived") ?? "active",
		contact_email: (data.contact_email as string) ?? undefined,
		contact_person: (data.contact_person as string) ?? undefined,
		contact_phone: (data.contact_phone as string) ?? undefined,
		website: (data.website as string) ?? undefined,
		address: (data.address as string) ?? undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data, 201);
}
