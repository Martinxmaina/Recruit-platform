import { getCurrentUser, getCurrentOrg } from "@/lib/auth/session";
import { NextResponse } from "next/server";

/**
 * Returns current Supabase user id and DB organization id for API routes and server actions.
 * Use this instead of auth() + getOrgId when you need userId and orgId.
 */
export async function getCurrentUserOrg(): Promise<{
	userId: string;
	orgId: string;
} | null> {
	const user = await getCurrentUser();
	const org = await getCurrentOrg();
	if (!user || !org) return null;
	return { userId: user.id, orgId: org.id };
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
