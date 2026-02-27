import { NextRequest } from "next/server";
import {
	getInterviews,
	createInterview,
} from "@/app/(dashboard)/interviews/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET(request: NextRequest) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const { searchParams } = request.nextUrl;
	const upcoming = searchParams.get("upcoming");
	const filters = {
		job_id: searchParams.get("job_id") ?? undefined,
		candidate_id: searchParams.get("candidate_id") ?? undefined,
		status: searchParams.get("status") ?? undefined,
		upcoming:
			upcoming === "true" ? true : upcoming === "false" ? false : undefined,
	};
	const interviews = await getInterviews(filters);
	return jsonResponse(interviews);
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
	const applicationId = data?.application_id as string | undefined;
	const scheduled_at = data?.scheduled_at as string | undefined;
	if (!applicationId || !scheduled_at)
		return errorResponse("application_id and scheduled_at are required", 400);

	const result = await createInterview(applicationId, {
		scheduled_at,
		status: (data.status as string) ?? undefined,
		notes: (data.notes as string) ?? null,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data, 201);
}
