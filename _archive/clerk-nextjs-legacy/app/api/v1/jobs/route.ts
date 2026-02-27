import { NextRequest } from "next/server";
import { getJobs, createJob } from "@/app/(dashboard)/jobs/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

export async function GET(request: NextRequest) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const { searchParams } = request.nextUrl;
	const filters = {
		status: searchParams.get("status") ?? undefined,
		work_type: searchParams.get("work_type") ?? undefined,
		country: searchParams.get("country") ?? undefined,
		client_id: searchParams.get("client_id") ?? undefined,
		search: searchParams.get("search") ?? undefined,
	};
	const jobs = await getJobs(filters);
	return jsonResponse(jobs);
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
	if (!data || typeof data.title !== "string")
		return errorResponse("title is required", 400);

	const result = await createJob({
		title: data.title as string,
		description: (data.description as string) ?? null,
		ai_requirements_summary: (data.ai_requirements_summary as string) ?? null,
		ai_working_hours: (data.ai_working_hours as number) ?? null,
		ai_job_language: (data.ai_job_language as string) ?? null,
		ai_visa_sponsorship: (data.ai_visa_sponsorship as boolean) ?? null,
		ai_keywords: (data.ai_keywords as string[]) ?? null,
		ai_taxonomies_a: (data.ai_taxonomies_a as string[]) ?? null,
		ai_education_requirements: (data.ai_education_requirements as string) ?? null,
		client_id: (data.client_id as string) ?? null,
		location: (data.location as string) ?? null,
		country: (data.country as string) ?? null,
		work_type: (data.work_type as string) ?? null,
		status: (data.status as string) ?? "open",
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data, 201);
}
