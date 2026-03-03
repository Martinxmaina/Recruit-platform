import { getCurrentUser, getCurrentOrg } from "@/lib/auth/session";
import { getMemberDisplayName } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * Returns current user id, org id, and display name for API routes and server actions.
 * displayName is used for activity log (who moved the candidate, etc.).
 */
export async function getCurrentUserOrg(): Promise<{
	userId: string;
	orgId: string;
	displayName?: string | null;
} | null> {
	const user = await getCurrentUser();
	const org = await getCurrentOrg();
	if (!user || !org) return null;
	const displayName = await getMemberDisplayName(user.id, org.id);
	return { userId: user.id, orgId: org.id, displayName };
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
