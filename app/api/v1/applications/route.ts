import { NextRequest } from "next/server";
import {
	getApplications,
	createApplication,
} from "@/app/(dashboard)/applications/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET(request: NextRequest) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const { searchParams } = request.nextUrl;
	const filters = {
		job_id: searchParams.get("job_id") ?? undefined,
		candidate_id: searchParams.get("candidate_id") ?? undefined,
		stage: searchParams.get("stage") ?? undefined,
		status: searchParams.get("status") ?? undefined,
	};
	const applications = await getApplications(filters);
	return jsonResponse(applications);
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
	const candidateId = data?.candidate_id as string | undefined;
	const jobId = data?.job_id as string | undefined;
	if (!candidateId || !jobId)
		return errorResponse("candidate_id and job_id are required", 400);

	const result = await createApplication(candidateId, jobId, {
		stage: data.stage as string | undefined,
		status: data.status as string | undefined,
		applied_at: data.applied_at as string | undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data, 201);
}
