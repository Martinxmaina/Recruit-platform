import { NextRequest } from "next/server";
import {
	getJob,
	updateJob,
	deleteJob,
} from "@/app/(dashboard)/jobs/actions";
import { getCurrentUserOrg, jsonResponse, errorResponse } from "@/lib/api/helpers";

type Params = { params: Promise<{ id: string }> };

export async function GET(
	_request: NextRequest,
	{ params }: Params
) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const job = await getJob(id);
	if (!job) return errorResponse("Job not found", 404);
	return jsonResponse(job);
}

export async function PATCH(
	request: NextRequest,
	{ params }: Params
) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	let body: Record<string, unknown>;
	try {
		body = (await request.json()) as Record<string, unknown>;
	} catch {
		return errorResponse("Invalid JSON body", 400);
	}

	const result = await updateJob(id, {
		title: body.title as string | undefined,
		description: body.description as string | null | undefined,
		ai_requirements_summary: body.ai_requirements_summary as string | null | undefined,
		ai_working_hours: body.ai_working_hours as number | null | undefined,
		ai_job_language: body.ai_job_language as string | null | undefined,
		ai_visa_sponsorship: body.ai_visa_sponsorship as boolean | null | undefined,
		ai_keywords: body.ai_keywords as string[] | null | undefined,
		ai_taxonomies_a: body.ai_taxonomies_a as string[] | null | undefined,
		ai_education_requirements: body.ai_education_requirements as string | null | undefined,
		client_id: body.client_id as string | null | undefined,
		location: body.location as string | null | undefined,
		country: body.country as string | null | undefined,
		work_type: body.work_type as string | null | undefined,
		status: body.status as string | undefined,
	});
	if (result.error) return errorResponse(result.error, 400);
	return jsonResponse(result.data);
}

export async function DELETE(
	_request: NextRequest,
	{ params }: Params
) {
	const { id } = await params;
	const ctx = await getCurrentUserOrg();
	if (!ctx) return errorResponse("Unauthorized", 401);

	const result = await deleteJob(id);
	if (result?.error) return errorResponse(result.error, 400);
	return jsonResponse({ success: true });
}
