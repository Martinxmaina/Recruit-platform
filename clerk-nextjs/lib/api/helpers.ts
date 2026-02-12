import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * Resolves Clerk org ID to Supabase organization UUID.
 * Returns org.id or null if not found.
 */
export async function getOrgId(
	userId: string,
	orgId: string
): Promise<{ id: string } | null> {
	const supabase = await createAdminClient(userId);
	const { data } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();
	return data ?? null;
}

export function jsonResponse(
	data: unknown,
	status = 200
): NextResponse {
	return NextResponse.json(data, { status });
}

export function errorResponse(
	message: string,
	status: number
): NextResponse {
	return NextResponse.json({ error: message }, { status });
}
