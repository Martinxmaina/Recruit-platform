import { NextRequest } from "next/server";
import {
	getCandidates,
	createCandidate,
} from "@/app/(dashboard)/candidates/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET(request: NextRequest) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const { searchParams } = request.nextUrl;
	const filters = {
		search: searchParams.get("search") ?? undefined,
		source: searchParams.get("source") ?? undefined,
	};
	const candidates = await getCandidates(filters);
	return jsonResponse(candidates);
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
	if (!data || typeof data.full_name !== "string")
		return errorResponse("full_name is required", 400);

	const result = await createCandidate({
		full_name: data.full_name as string,
		email: (data.email as string) ?? null,
		phone: (data.phone as string) ?? null,
		linkedin_url: (data.linkedin_url as string) ?? null,
		current_company: (data.current_company as string) ?? null,
		current_title: (data.current_title as string) ?? null,
		location: (data.location as string) ?? null,
		resume_url: (data.resume_url as string) ?? null,
		source: (data.source as string) ?? null,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data, 201);
}
